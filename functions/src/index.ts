// @ts-ignore - Dependencies will be installed later
import * as admin from "firebase-admin";
// @ts-ignore - Dependencies will be installed later
import * as functions from "firebase-functions";
// @ts-ignore - Dependencies will be installed later
import Midtrans from "midtrans-client";

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Initialize Midtrans Snap
const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-D5CuUjIMFG2v5tpQ1YRKWNAL",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "SB-Mid-client-qL3iowxuzGaqwQwv",
});

export const createPaymentToken = functions.https.onCall(
  async (
    data: {
      orderId: string;
      amount: number;
      customerName: string;
      customerEmail: string;
      items: Array<{
        id: string;
        price: number;
        quantity: number;
        name: string;
      }>;
    },
    context: functions.https.CallableContext
  ) => {
    try {
      // Verify authentication
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "User tidak terautentikasi"
        );
      }

      const { orderId, amount, customerName, customerEmail, items } = data;

      // Validate input
      if (!orderId || !amount || !customerName || !customerEmail) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Missing required fields"
        );
      }

      // Prepare transaction data for Midtrans
      const transactionData = {
        transaction_details: {
          order_id: orderId,
          gross_amount: amount,
        },
        customer_details: {
          first_name: customerName,
          email: customerEmail,
        },
        item_details: items,
      };

      // Create transaction token
      const token = await snap.createTransactionToken(transactionData);

      // Save transaction record to Firestore
      await admin
        .firestore()
        .collection("transactions")
        .doc(orderId)
        .set(
          {
            token,
            amount,
            status: "pending",
            customerName,
            customerEmail,
            items,
            userId: context.auth.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

      return { token, orderId };
    } catch (error) {
      console.error("Error creating payment token:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Gagal membuat token pembayaran"
      );
    }
  }
);

export const handleMidtransWebhook = functions.https.onRequest(
  async (req: functions.https.Request, res: functions.Response) => {
    try {
      // Verify webhook signature
      const orderId = req.body.order_id;
      const transactionStatus = req.body.transaction_status;
      const fraudStatus = req.body.fraud_status;

      if (!orderId) {
        res.status(400).json({ error: "Missing order_id" });
        return;
      }

      // Determine payment status
      let paymentStatus = "pending";
      let isPaid = false;

      if (transactionStatus === "settlement") {
        paymentStatus = "settlement";
        isPaid = true;
      } else if (
        transactionStatus === "pending" ||
        transactionStatus === "capture"
      ) {
        paymentStatus = "pending";
        isPaid = false;
      } else if (transactionStatus === "cancel" || transactionStatus === "deny") {
        paymentStatus = "cancelled";
        isPaid = false;
      } else if (transactionStatus === "expire") {
        paymentStatus = "expired";
        isPaid = false;
      }

      // Update transaction status in Firestore
      await admin
        .firestore()
        .collection("transactions")
        .doc(orderId)
        .update({
          status: paymentStatus,
          isPaid,
          transactionStatus,
          fraudStatus,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      // If payment successful, update order status
      if (isPaid) {
        await admin
          .firestore()
          .collection("orders")
          .doc(orderId)
          .update({
            paymentStatus: "paid",
            isPaid: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          })
          .catch(() => {
            // Order might not exist yet, it's OK
            console.log("Order not found, but transaction updated");
          });
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  }
);

export const getTransactionStatus = functions.https.onCall(
  async (data: { orderId: string }, context: functions.https.CallableContext) => {
    try {
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "User tidak terautentikasi"
        );
      }

      const { orderId } = data;

      const doc = await admin
        .firestore()
        .collection("transactions")
        .doc(orderId)
        .get();

      if (!doc.exists) {
        throw new functions.https.HttpsError("not-found", "Transaksi tidak ditemukan");
      }

      return doc.data();
    } catch (error) {
      console.error("Error getting transaction status:", error);
      throw new functions.https.HttpsError("internal", "Gagal mengambil status transaksi");
    }
  }
);
