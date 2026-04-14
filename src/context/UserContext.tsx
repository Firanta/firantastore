import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export interface CartItem {
  id: string;
  templateId: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  option?: string;
}

export interface OrderItem {
  id: string;
  templateId: number;
  templateName: string;
  category: string;
  option: string;
  price: number;
  date: string;
  status: "pending" | "completed" | "cancelled" | "failed";
  paymentMethod: string;
  rating?: number;
  reviewComment?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  createdAt: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  orders: OrderItem[];
  cart: CartItem[];
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  addOrder: (order: OrderItem) => void;
  rateTemplate: (orderId: string, rating: number, comment: string) => void;
  updateProfile: (data: Partial<User>) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateCartItem: (itemId: string, quantity: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage and Firebase on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const isDev = import.meta.env.DEV;
    if (isDev) console.log("[UserContext] Initializing auth state listener...");

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(
      auth, 
      (firebaseUser: FirebaseUser | null) => {
        try {
          if (firebaseUser) {
            // User is logged in via Firebase
            if (isDev) console.log("[UserContext] Firebase user detected:", firebaseUser.uid);
            const userData: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
              email: firebaseUser.email || "",
              createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()).toISOString(),
            };
            setUser(userData);
            // Save to localStorage for offline access
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // User is logged out
            if (isDev) console.log("[UserContext] No Firebase user detected");
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
              try {
                setUser(JSON.parse(savedUser));
              } catch {
                setUser(null);
              }
            } else {
              setUser(null);
            }
          }
        } catch (error) {
          console.error("[UserContext] Error in auth state change:", error);
          setUser(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("[UserContext] Auth state listener error:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("Email dan password harus diisi");
    }

    try {
      const isDev = import.meta.env.DEV;
      if (isDev) console.log("[Auth] Attempting login for:", email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (isDev) console.log("[Auth] Login successful for user:", result.user.uid);
      
      const userData: User = {
        id: result.user.uid,
        name: result.user.displayName || email.split("@")[0],
        email: result.user.email || "",
        createdAt: new Date(result.user.metadata.creationTime || Date.now()).toISOString(),
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      console.error("[Auth] Login error:", error);
      let errorMessage = "Login gagal";

      if (error.code === "auth/user-not-found") {
        errorMessage = "Email tidak terdaftar. Silakan signup terlebih dahulu";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Password salah. Coba lagi";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Email atau password salah. Periksa kembali atau daftar akun baru";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Akun ini telah dinonaktifkan";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Terlalu banyak percobaan login. Coba lagi nanti";
      } else if (error.message?.includes("400")) {
        errorMessage = "Email atau password salah. Periksa kembali atau daftar akun baru";
      } else if (error.message?.includes("network")) {
        errorMessage = "Error jaringan. Periksa koneksi internet Anda";
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      throw new Error("Semua field harus diisi");
    }
    if (password.length < 6) {
      throw new Error("Password minimal 6 karakter");
    }
    if (!email.includes("@")) {
      throw new Error("Masukkan email yang valid");
    }

    try {
      console.log("[Auth] Attempting signup for:", email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("[Auth] Signup successful for user:", result.user.uid);
      
      const userData: User = {
        id: result.user.uid,
        name: name,
        email: result.user.email || "",
        createdAt: new Date(result.user.metadata.creationTime || Date.now()).toISOString(),
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      console.error("[Auth] Signup error details:", {
        code: error.code,
        message: error.message,
        fullError: error
      });
      let errorMessage = "Daftar gagal";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email sudah terdaftar. Gunakan email lain atau login";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password terlalu lemah. Gunakan minimal 6 karakter";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Format email tidak valid";
      } else if (error.code === "auth/missing-email") {
        errorMessage = "Email harus diisi";
      } else if (error.code === "auth/missing-password") {
        errorMessage = "Password harus diisi";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Email/Password sign up tidak diaktifkan di Firebase. Hubungi administrator";
      } else if (error.message?.includes("400") || error.message?.includes("INVALID_LOGIN_CREDENTIALS")) {
        errorMessage = "Gagal terhubung ke Firebase. Pastikan Email/Password sign up diaktifkan di Firebase Console";
      } else if (error.message?.includes("network")) {
        errorMessage = "Error jaringan. Periksa koneksi internet Anda";
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user");
    } catch (error: any) {
      throw new Error(error.message || "Logout gagal");
    }
  };

  const addOrder = (order: OrderItem) => {
    const newOrder = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const rateTemplate = (orderId: string, rating: number, comment: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, rating, reviewComment: comment }
        : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const addToCart = (item: CartItem) => {
    const existingItem = cart.find(c => c.id === item.id);
    let updatedCart: CartItem[];
    
    if (existingItem) {
      updatedCart = cart.map(c =>
        c.id === item.id ? { ...c, quantity: c.quantity + item.quantity } : c
      );
    } else {
      updatedCart = [...cart, item];
    }
    
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter(c => c.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateCartItem = (itemId: string, quantity: number) => {
    let updatedCart: CartItem[];
    
    if (quantity <= 0) {
      updatedCart = cart.filter(c => c.id !== itemId);
    } else {
      updatedCart = cart.map(c =>
        c.id === itemId ? { ...c, quantity } : c
      );
    }
    
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const value: UserContextType = {
    user,
    isAuthenticated: !!user,
    orders,
    cart,
    login,
    signup,
    logout,
    addOrder,
    rateTemplate,
    updateProfile,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser harus digunakan dalam UserProvider");
  }
  return context;
};
