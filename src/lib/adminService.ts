import { auth } from "@/lib/firebase";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Helper function to get auth token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  return await user.getIdToken();
};

// ============ ADMIN ORDERS ============

export const adminGetOrders = async (
  status?: string,
  limit: number = 50,
  offset: number = 0
) => {
  const token = await getAuthToken();
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const response = await fetch(`${API_BASE_URL}/api/admin/orders?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
};

export const adminGetOrderById = async (orderId: string) => {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch order");
  return response.json();
};

export const adminUpdateOrderStatus = async (
  orderId: string,
  status: "pending" | "completed" | "cancelled" | "failed"
) => {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw new Error("Failed to update order status");
  return response.json();
};

export const adminDeleteOrder = async (orderId: string) => {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete order");
  return response.json();
};

// ============ ADMIN TEMPLATES ============

export const adminGetTemplates = async (
  category?: string,
  limit: number = 50,
  offset: number = 0
) => {
  const token = await getAuthToken();
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const response = await fetch(`${API_BASE_URL}/api/admin/templates?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch templates");
  return response.json();
};

export const adminUpdateTemplate = async (
  templateId: string,
  data: {
    name?: string;
    price?: number;
    category?: string;
    description?: string;
  }
) => {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/admin/templates/${templateId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update template");
  return response.json();
};

export const adminDeleteTemplate = async (templateId: string) => {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/admin/templates/${templateId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete template");
  return response.json();
};

// ============ ADMIN ANALYTICS ============

export const adminGetAnalyticsSummary = async () => {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch analytics");
  return response.json();
};
