import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Query,
  QueryConstraint,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// ============ TEMPLATES ============
export const getTemplates = async (): Promise<any[]> => {
  try {
    const templatesRef = collection(db, "templates");
    const snapshot = await getDocs(templatesRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};

export const getTemplateById = async (id: string): Promise<any> => {
  try {
    const templateRef = doc(db, "templates", id);
    const snapshot = await getDoc(templateRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching template:", error);
    throw error;
  }
};

export const getTemplatesByCategory = async (category: string): Promise<any[]> => {
  try {
    const templatesRef = collection(db, "templates");
    const q = query(templatesRef, where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching templates by category:", error);
    throw error;
  }
};

// ============ ORDERS ============
export const addOrder = async (
  userId: string,
  templateId: string,
  templateName: string,
  category: string,
  option: "softfile" | "url",
  price: number
) => {
  try {
    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, {
      userId,
      templateId,
      templateName,
      category,
      option,
      price,
      status: "pending",
      createdAt: new Date(),
      rating: null,
      reviewComment: null,
      downloadUrl: null,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};

export const getOrdersByUserId = async (userId: string): Promise<any[]> => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<any> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const snapshot = await getDoc(orderRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: "pending" | "completed" | "cancelled" | "failed"
) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status, updatedAt: new Date() });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// ============ RATINGS ============
export const addRating = async (
  userId: string,
  orderId: string,
  templateId: string,
  rating: number,
  comment: string
) => {
  try {
    const ratingsRef = collection(db, "ratings");
    const docRef = await addDoc(ratingsRef, {
      userId,
      orderId,
      templateId,
      rating,
      comment,
      createdAt: new Date(),
    });

    // Update order with rating
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      rating,
      reviewComment: comment,
      updatedAt: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error;
  }
};

export const getRatingsByTemplateId = async (templateId: string): Promise<any[]> => {
  try {
    const ratingsRef = collection(db, "ratings");
    const q = query(ratingsRef, where("templateId", "==", templateId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};

export const getAverageRating = async (templateId: string) => {
  try {
    const ratings = await getRatingsByTemplateId(templateId);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc: number, r: any) => acc + r.rating, 0);
    return sum / ratings.length;
  } catch (error) {
    console.error("Error calculating average rating:", error);
    throw error;
  }
};

// ============ USERS ============
export const createUser = async (
  uid: string,
  email: string,
  name: string,
  phone?: string,
  company?: string
) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      uid,
      email,
      name,
      phone: phone || "",
      company: company || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUserById = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return { uid: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUser = async (
  uid: string,
  data: {
    name?: string;
    phone?: string;
    company?: string;
    avatar?: string;
  }
) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { ...data, updatedAt: new Date() });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// ============ CATEGORIES ============
export const getCategories = async (): Promise<any[]> => {
  try {
    const categoriesRef = collection(db, "categories");
    const snapshot = await getDocs(categoriesRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<any> => {
  try {
    const categoryRef = doc(db, "categories", id);
    const snapshot = await getDoc(categoryRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

// ============ CART ============
export const addToCart = async (
  userId: string,
  templateId: string,
  templateName: string,
  option: "softfile" | "url",
  price: number,
  quantity: number = 1
) => {
  try {
    const cartRef = doc(db, "cart", userId);
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      const existingCart = cartDoc.data();
      const items = existingCart.items || [];

      // Check if item already in cart
      const itemIndex = items.findIndex(
        (item: any) => item.templateId === templateId && item.option === option
      );

      if (itemIndex > -1) {
        items[itemIndex].quantity += quantity;
      } else {
        items.push({
          templateId,
          templateName,
          option,
          price,
          quantity,
        });
      }

      const total = items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );

      await updateDoc(cartRef, {
        items,
        total,
        updatedAt: new Date(),
      });
    } else {
      // Create new cart
      await setDoc(cartRef, {
        userId,
        items: [
          {
            templateId,
            templateName,
            option,
            price,
            quantity,
          },
        ],
        total: price * quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const getCart = async (userId: string): Promise<any> => {
  try {
    const cartRef = doc(db, "cart", userId);
    const snapshot = await getDoc(cartRef);
    if (snapshot.exists()) {
      return { userId: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const clearCart = async (userId: string) => {
  try {
    const cartRef = doc(db, "cart", userId);
    await deleteDoc(cartRef);
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

export const removeFromCart = async (
  userId: string,
  templateId: string,
  option: string
) => {
  try {
    const cartRef = doc(db, "cart", userId);
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      const existingCart = cartDoc.data();
      let items = existingCart.items || [];

      items = items.filter(
        (item: any) => !(item.templateId === templateId && item.option === option)
      );

      if (items.length === 0) {
        await deleteDoc(cartRef);
      } else {
        const total = items.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        );

        await updateDoc(cartRef, {
          items,
          total,
          updatedAt: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};
