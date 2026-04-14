import { VercelRequest, VercelResponse } from '@vercel/node';
import * as admin from 'firebase-admin';
import Midtrans from 'midtrans-client';

// Firebase Admin Setup
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
);

let firebaseInitialized = false;

if (Object.keys(serviceAccount).length > 0 && !admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseInitialized = true;
  } catch (error) {
    firebaseInitialized = false;
  }
}

// Midtrans Setup
const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-D5CuUjIMFG2v5tpQ1YRKWNAL',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-qL3iowxuzGaqwQwv',
});

// Middleware untuk verify Firebase token
const verifyFirebaseToken = async (req: VercelRequest): Promise<string | null> => {
  // In test mode without Firebase, return test user ID
  if (!firebaseInitialized) {
    return 'test-user-' + Math.random().toString(36).substr(2, 9);
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    return null;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enhanced CORS with detailed headers
  const origin = req.headers.origin || '*';
  
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);

  try {
    switch (pathname) {
      case '/api/health':
        if (req.method === 'GET') {
          res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            platform: 'vercel',
            corsEnabled: true
          });
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      case '/api/midtrans/create-token':
        if (req.method === 'POST') {
          try {
            const uid = await verifyFirebaseToken(req);
            if (!uid) {
              console.error('[Backend] Firebase token verification failed');
              return res.status(401).json({ error: 'Unauthorized - Invalid Firebase token' });
            }

            const { orderId, amount, customerName, customerEmail, items } = req.body;

            console.log('[API] create-token request received:', { orderId, amount, customerEmail });

            // Validate required fields
            if (!orderId || !amount || !customerEmail) {
              console.error('[API] Missing required fields:', { orderId, amount, customerEmail });
              return res.status(400).json({ error: 'Missing required fields: orderId, amount, customerEmail' });
            }

            // Use provided customerName or generate from email
            const finalCustomerName = customerName && customerName.trim() ? customerName : customerEmail.split('@')[0];
            console.log('[API] Using customer name:', finalCustomerName);

            // Calculate gross_amount from items if provided (Midtrans requirement)
            let grossAmount = amount;
            const itemDetails: any[] = [];

            if (items && Array.isArray(items) && items.length > 0) {
              try {
                grossAmount = 0;
                items.forEach((item: any) => {
                  const itemPrice = Number(item.price) || 0;
                  const itemQty = Number(item.quantity) || 1;
                  const itemTotal = itemPrice * itemQty;
                  grossAmount += itemTotal;

                  // Add to item_details with required fields
                  itemDetails.push({
                    id: String(item.id || item.templateId || 'item'),
                    name: String(item.name || 'Product'),
                    price: itemPrice,
                    quantity: itemQty,
                  });
                });
                console.log('[Midtrans] Calculated gross_amount from items:', { originalAmount: amount, calculatedAmount: grossAmount, itemCount: items.length });
              } catch (itemError: any) {
                console.warn('[Midtrans] Error processing items, using amount as-is:', itemError.message);
                itemDetails.length = 0;
                grossAmount = amount;
              }
            }

            // If no items processed, create default item
            if (itemDetails.length === 0) {
              itemDetails.push({
                id: 'item-1',
                name: 'Service',
                price: parseInt(String(amount)),
                quantity: 1,
              });
              console.log('[Midtrans] Using default item with amount:', amount);
            }

            // Create transaction token
            const transactionData = {
              transaction_details: {
                order_id: String(orderId),
                gross_amount: parseInt(String(grossAmount)),
              },
              customer_details: {
                first_name: finalCustomerName,
                email: String(customerEmail),
              },
              item_details: itemDetails,
            };

            console.log('[Midtrans] Creating token with data:', { 
              orderId, 
              grossAmount: transactionData.transaction_details.gross_amount,
              itemCount: itemDetails.length,
              customerName: finalCustomerName
            });

            const token = await (snap as any).createTransactionToken(transactionData);
            console.log('[Midtrans] Token created successfully:', orderId);

            // Save to Firestore only if Firebase is initialized (not in test mode)
            if (firebaseInitialized) {
              try {
                console.log('[Firestore] Attempting to save transaction...');
                const firestoreData = {
                  token,
                  orderId: String(orderId),
                  amount: parseInt(String(grossAmount)),
                  status: 'pending',
                  customerName: finalCustomerName,
                  customerEmail: String(customerEmail),
                  itemCount: itemDetails.length,
                  userId: uid || 'test-user',
                  createdAt: admin.firestore.FieldValue.serverTimestamp(),
                  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                };
                
                await admin
                  .firestore()
                  .collection('transactions')
                  .doc(String(orderId))
                  .set(firestoreData, { merge: true });
                console.log('[Firestore] Transaction saved successfully');
              } catch (firestoreError: any) {
                console.warn('[Firestore] Failed to save (non-blocking):', firestoreError.message);
                // Don't block payment on Firestore failure
              }
            } else {
              console.log('[Firestore] Skipping save (test mode - Firebase not initialized)');
            }

            // Return token to client
            console.log('[API] Returning token successfully for order:', orderId);
            return res.status(200).json({ 
              success: true,
              token, 
              orderId,
              grossAmount: transactionData.transaction_details.gross_amount
            });

          } catch (error: any) {
            console.error('[API] Error creating token:', error.message, error);
            return res.status(500).json({ 
              success: false,
              error: 'Failed to create payment token',
              details: error.message || 'Unknown error'
            });
          }
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      case '/api/midtrans/webhook':
        if (req.method === 'POST') {
          const { order_id, transaction_status, fraud_status } = req.body;

          if (!order_id) {
            return res.status(400).json({ error: 'Missing order_id' });
          }

          let paymentStatus = 'pending';
          let isPaid = false;

          if (transaction_status === 'settlement') {
            paymentStatus = 'settlement';
            isPaid = true;
          } else if (transaction_status === 'pending') {
            paymentStatus = 'pending';
            isPaid = false;
          } else if (transaction_status === 'cancel' || transaction_status === 'deny') {
            paymentStatus = 'cancelled';
            isPaid = false;
          } else if (transaction_status === 'expire') {
            paymentStatus = 'expired';
            isPaid = false;
          }

          // Update Firestore
          if (admin.apps.length > 0) {
            await admin
              .firestore()
              .collection('transactions')
              .doc(order_id)
              .update({
                status: paymentStatus,
                isPaid,
                transactionStatus: transaction_status,
                fraudStatus: fraud_status,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              });

            if (isPaid) {
              await admin
                .firestore()
                .collection('orders')
                .doc(order_id)
                .update({
                  paymentStatus: 'paid',
                  isPaid: true,
                  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                })
                .catch(() => {
                  console.log('Order not found');
                });
            }
          }

          res.status(200).json({ success: true });
        } else {
          res.status(405).json({ error: 'Method not allowed' });
        }
        break;

      default:
        if (pathname.startsWith('/api/midtrans/status/')) {
          if (req.method === 'GET') {
            const uid = await verifyFirebaseToken(req);
            if (!uid) {
              return res.status(401).json({ error: 'Unauthorized' });
            }

            const orderId = pathname.split('/api/midtrans/status/')[1];

            if (admin.apps.length > 0) {
              const doc = await admin
                .firestore()
                .collection('transactions')
                .doc(orderId)
                .get();

              if (!doc.exists) {
                return res.status(404).json({ error: 'Transaction not found' });
              }

              res.status(200).json(doc.data());
            } else {
              res.status(500).json({ error: 'Database not configured' });
            }
          } else {
            res.status(405).json({ error: 'Method not allowed' });
          }
        } else {
          res.status(404).json({ error: 'Not found' });
        }
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}