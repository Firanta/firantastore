import { auth } from "./firebase";

export interface PaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Get backend URL from environment with fallback
const getBackendUrl = (): string => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  
  // If in localhost environment, try local backend first
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Try local backend first (http://localhost:3001)
    return 'http://localhost:3001';
  }
  
  // Use production backend URL if configured
  if (envUrl) {
    return envUrl;
  }
  
  // Fallback to production
  return "https://firantastoree-backend.vercel.app";
};

const BACKEND_URL = getBackendUrl();
if (import.meta.env.DEV) {
  console.log('[MidtransService] Using backend URL:', BACKEND_URL);
}

export const createPaymentToken = async (
  orderId: string,
  amount: number,
  customerName: string,
  customerEmail: string,
  items: PaymentItem[]
): Promise<string> => {
  const isDev = import.meta.env.DEV;
  
  try {
    // Get Firebase ID Token
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated - please login first");
    }

    if (isDev) console.log('[MidtransService] Getting Firebase token for user:', user.uid);
    const token = await user.getIdToken();
    if (isDev) console.log('[MidtransService] Firebase token obtained');

    if (isDev) console.log('[MidtransService] Sending request to:', `${BACKEND_URL}/api/midtrans/create-token`);
    
    const requestBody = {
      orderId,
      amount,
      customerName,
      customerEmail,
      items,
    };

    if (isDev) console.log('[MidtransService] Request body:', requestBody);

    const response = await fetch(`${BACKEND_URL}/api/midtrans/create-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (isDev) console.log('[MidtransService] Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[MidtransService] Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (isDev) console.log('[MidtransService] Token created successfully');
    return data.token;
  } catch (error) {
    console.error("[MidtransService] Error creating payment token:", error);
    throw error;
  }
};

export const getTransactionStatus = async (
  orderId: string
): Promise<{
  token: string;
  amount: number;
  status: string;
  isPaid: boolean;
  transactionStatus?: string;
}> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch(
      `${BACKEND_URL}/api/midtrans/status/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting transaction status:", error);
    throw error;
  }
};
