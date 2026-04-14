import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import Midtrans from 'midtrans-client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow localhost for development, and allow any in production
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:8080',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:3000',
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Still allow in production - don't block
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint before Firebase init
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Firebase Admin Setup
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
);

let firebaseInitialized = false;

if (Object.keys(serviceAccount).length > 0) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseInitialized = true;
    console.log('[Firebase] Admin SDK initialized');
  } catch (error) {
    console.warn('[Firebase] Failed to initialize:', error);
    firebaseInitialized = false;
  }
} else {
  console.warn('[Firebase] Service account not configured - using test mode without Firebase');
  firebaseInitialized = false;
}

// Midtrans Setup
const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-D5CuUjIMFG2v5tpQ1YRKWNAL',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-qL3iowxuzGaqwQwv',
});
console.log('[Midtrans] Snap configured');

// Middleware untuk verify Firebase token
const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // In local test mode without Firebase, skip token verification
  if (!firebaseInitialized) {
    console.warn('[Auth] Skipping Firebase token verification (test mode)');
    (req as any).uid = 'test-user-' + Math.random().toString(36).substr(2, 9);
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token' });
  }

  try {
    const token = authHeader.substring(7);
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).uid = decodedToken.uid;
    next();
  } catch (error: any) {
    console.error('[Auth] Token verification failed:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create Payment Token
app.post('/api/midtrans/create-token', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const { orderId, amount, customerName, customerEmail, items } = req.body;
    const uid = (req as any).uid;

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
});

// Midtrans Webhook
app.post('/api/midtrans/webhook', async (req: Request, res: Response) => {
  try {
    const { order_id, transaction_status, fraud_status } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: 'Missing order_id' });
    }

    // Determine payment status
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

      // Update order if paid
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
            // Order might not exist, it's OK
            console.log('Order not found');
          });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get Transaction Status
app.get('/api/midtrans/status/:orderId', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (admin.apps.length > 0) {
      const doc = await admin
        .firestore()
        .collection('transactions')
        .doc(orderId)
        .get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json(doc.data());
    } else {
      res.status(500).json({ error: 'Database not configured' });
    }
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// ============== ADMIN ENDPOINTS ==============

// Middleware untuk verify admin
const verifyAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!firebaseInitialized) {
    // Test mode - allow any request
    (req as any).uid = 'test-admin';
    (req as any).isAdmin = true;
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token' });
  }

  try {
    const token = authHeader.substring(7);
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check if user is admin
    if (!decodedToken.isAdmin && !decodedToken.admin) {
      return res.status(403).json({ error: 'Forbidden - Not an admin' });
    }

    (req as any).uid = decodedToken.uid;
    (req as any).isAdmin = true;
    next();
  } catch (error: any) {
    console.error('[AdminAuth] Token verification failed:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all orders (admin)
app.get('/api/admin/orders', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { status, startDate, endDate, limit = 50, offset = 0 } = req.query;

    if (!firebaseInitialized) {
      return res.json({ orders: [], total: 0, message: 'Test mode' });
    }

    let query: any = admin.firestore().collection('orders');

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    // Get total count
    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    // Get paginated results
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string))
      .get();

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }));

    res.json({ orders, total, limit, offset });
  } catch (error: any) {
    console.error('[AdminAPI] Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// Get single order details (admin)
app.get('/api/admin/orders/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!firebaseInitialized) {
      return res.json({ order: { id, message: 'Test mode' } });
    }

    const doc = await admin.firestore().collection('orders').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    });
  } catch (error: any) {
    console.error('[AdminAPI] Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
});

// Update order status (admin)
app.patch('/api/admin/orders/:id/status', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'completed', 'cancelled', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (!firebaseInitialized) {
      return res.json({ success: true, message: 'Test mode' });
    }

    await admin.firestore().collection('orders').doc(id).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, id, status });
  } catch (error: any) {
    console.error('[AdminAPI] Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order', details: error.message });
  }
});

// Delete order (admin)
app.delete('/api/admin/orders/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!firebaseInitialized) {
      return res.json({ success: true, id, message: 'Test mode' });
    }

    await admin.firestore().collection('orders').doc(id).delete();
    res.json({ success: true, id });
  } catch (error: any) {
    console.error('[AdminAPI] Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order', details: error.message });
  }
});

// Get all templates (admin)
app.get('/api/admin/templates', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { category, limit = 50, offset = 0 } = req.query;

    if (!firebaseInitialized) {
      return res.json({ templates: [], total: 0, message: 'Test mode' });
    }

    let query: any = admin.firestore().collection('templates');

    // Filter by category if provided
    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }

    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string))
      .get();

    const templates = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ templates, total, limit, offset });
  } catch (error: any) {
    console.error('[AdminAPI] Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates', details: error.message });
  }
});

// Update template (admin)
app.put('/api/admin/templates/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, category, description } = req.body;

    if (!firebaseInitialized) {
      return res.json({ success: true, id, message: 'Test mode' });
    }

    await admin.firestore().collection('templates').doc(id).update({
      ...(name && { name }),
      ...(price && { price }),
      ...(category && { category }),
      ...(description && { description }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, id });
  } catch (error: any) {
    console.error('[AdminAPI] Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template', details: error.message });
  }
});

// Delete template (admin)
app.delete('/api/admin/templates/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!firebaseInitialized) {
      return res.json({ success: true, id, message: 'Test mode' });
    }

    await admin.firestore().collection('templates').doc(id).delete();
    res.json({ success: true, id });
  } catch (error: any) {
    console.error('[AdminAPI] Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template', details: error.message });
  }
});

// Get analytics summary (admin)
app.get('/api/admin/analytics/summary', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    if (!firebaseInitialized) {
      return res.json({ summary: { totalRevenue: 0, totalOrders: 0 }, message: 'Test mode' });
    }

    const ordersSnapshot = await admin.firestore().collection('orders').get();
    const allOrders = ordersSnapshot.docs.map(doc => doc.data());

    const completedOrders = allOrders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.price || 0), 0);

    res.json({
      summary: {
        totalRevenue,
        totalOrders: allOrders.length,
        completedOrders: completedOrders.length,
        pendingOrders: allOrders.filter(o => o.status === 'pending').length,
        averageOrderValue: completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0,
      }
    });
  } catch (error: any) {
    console.error('[AdminAPI] Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics', details: error.message });
  }
});

// ============== USER MANAGEMENT ENDPOINTS (ADMIN) ==============

// Get all users (admin)
app.get('/api/admin/users', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { role, limit = 50, offset = 0, search } = req.query;

    if (!firebaseInitialized) {
      return res.json({ users: [], total: 0, message: 'Test mode' });
    }

    let query: any = admin.firestore().collection('users');

    // Filter by role if provided
    if (role && role !== 'all') {
      query = query.where('role', '==', role);
    }

    const countSnapshot = await query.count().get();
    let total = countSnapshot.data().count;

    let snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string))
      .get();

    let users = snapshot.docs.map(doc => ({
      id: doc.id,
      uid: doc.data().uid,
      email: doc.data().email,
      name: doc.data().name,
      phone: doc.data().phone,
      role: doc.data().role,
      isActive: doc.data().isActive,
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }));

    // Client-side search filter if provided
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      users = users.filter(u => 
        u.email.toLowerCase().includes(searchLower) ||
        u.name.toLowerCase().includes(searchLower)
      );
      total = users.length;
    }

    res.json({ users, total, limit, offset });
  } catch (error: any) {
    console.error('[AdminAPI] Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Get single user (admin)
app.get('/api/admin/users/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!firebaseInitialized) {
      return res.json({ user: { id, message: 'Test mode' } });
    }

    const doc = await admin.firestore().collection('users').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    });
  } catch (error: any) {
    console.error('[AdminAPI] Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
});

// Create/Update user document (admin)
// Can be called with Firebase UID to create user Firestore document
app.post('/api/admin/users', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { uid, email, name, phone, company, city, address, country, role, isActive } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: 'UID and email are required' });
    }

    if (!firebaseInitialized) {
      return res.json({ success: true, uid, message: 'Test mode' });
    }

    const userData: any = {
      uid,
      email,
      name: name || '',
      phone: phone || '',
      company: company || '',
      city: city || '',
      address: address || '',
      country: country || '',
      role: role || 'user',
      isActive: isActive !== undefined ? isActive : true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore().collection('users').doc(uid).set(userData, { merge: true });

    res.json({ success: true, uid, message: 'User document created/updated' });
  } catch (error: any) {
    console.error('[AdminAPI] Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

// Update user (admin)
app.put('/api/admin/users/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!firebaseInitialized) {
      return res.json({ success: true, id, message: 'Test mode' });
    }

    // Remove protected fields
    delete updates.uid;
    delete updates.createdAt;

    await admin.firestore().collection('users').doc(id).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, id });
  } catch (error: any) {
    console.error('[AdminAPI] Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
});

// Delete user (admin)
app.delete('/api/admin/users/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!firebaseInitialized) {
      return res.json({ success: true, id, message: 'Test mode' });
    }

    // Delete from Firestore only (Firebase Auth users must be deleted via Firebase Console)
    await admin.firestore().collection('users').doc(id).delete();

    res.json({ 
      success: true, 
      id, 
      message: 'User document deleted from Firestore. Please delete from Firebase Auth separately.' 
    });
  } catch (error: any) {
    console.error('[AdminAPI] Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

// Set admin claim (admin)
app.post('/api/admin/users/:id/set-admin', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;

    if (!firebaseInitialized) {
      return res.json({ success: true, id, message: 'Test mode' });
    }

    // Set custom claim
    await admin.auth().setCustomUserClaims(id, { isAdmin: isAdmin === true });

    // Update Firestore document
    await admin.firestore().collection('users').doc(id).update({
      role: isAdmin ? 'admin' : 'user',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ 
      success: true, 
      id, 
      isAdmin: isAdmin === true,
      message: 'Admin claim updated' 
    });
  } catch (error: any) {
    console.error('[AdminAPI] Error setting admin claim:', error);
    res.status(500).json({ error: 'Failed to set admin claim', details: error.message });
  }
});

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`   Health check: GET http://localhost:${PORT}/health`);
});
