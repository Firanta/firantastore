import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createPaymentToken, PaymentItem } from "@/lib/midtransService";

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        callbacks?: {
          onSuccess?: (result: unknown) => void;
          onError?: (error: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

interface MidtransPaymentProps {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  items: PaymentItem[];
  onSuccess?: (result: unknown) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
  loading?: boolean;
}

export const MidtransPayment = ({
  orderId,
  amount,
  customerName,
  customerEmail,
  items,
  onSuccess,
  onError,
  onClose,
  loading = false,
}: MidtransPaymentProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const paymentInProgressRef = useRef(false);
  const isDev = import.meta.env.DEV;

  // Load Midtrans snap script - only load once
  useEffect(() => {
    if (!window.snap) {
      if (isDev) console.log("[MidtransPayment] Loading Midtrans Snap script...");
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.async = true;
      script.setAttribute(
        "data-client-key",
        import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "SB-Mid-client-qL3iowxuzGaqwQwv"
      );
      script.onload = () => {
        if (isDev) console.log("[MidtransPayment] Midtrans Snap script loaded successfully");
      };
      script.onerror = () => {
        console.error("[MidtransPayment] Failed to load Midtrans script");
      };
      document.body.appendChild(script);
    }
  }, [isDev]);

  const handlePayment = async () => {
    // Prevent multiple simultaneous payment attempts
    if (paymentInProgressRef.current) {
      if (isDev) console.warn("[MidtransPayment] Payment already in progress, ignoring click");
      toast({
        title: "Sedang Diproses",
        description: "Pembayaran sedang diproses. Tunggu hingga selesai.",
        duration: 2000,
      });
      return;
    }

    if (!window.snap) {
      console.error("[MidtransPayment] Snap not loaded yet");
      toast({
        title: "Error",
        description: "Midtrans script belum dimuat. Silakan refresh halaman.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // Mark payment as in progress
    paymentInProgressRef.current = true;
    setIsLoading(true);

    try {
      if (isDev) console.log("[MidtransPayment] Starting payment process for order:", orderId);

      const token = await createPaymentToken(
        orderId,
        amount,
        customerName || "Pelanggan",
        customerEmail,
        items
      );

      if (isDev) console.log("[MidtransPayment] Token received successfully, token:", token.substring(0, 20) + "...");

      // Ensure snap.pay is ready before calling
      if (!window.snap || typeof window.snap.pay !== "function") {
        throw new Error("Midtrans Snap not properly initialized");
      }

      if (isDev) console.log("[MidtransPayment] Calling snap.pay...");

      // Call snap.pay with proper error handling
      try {
        window.snap.pay(token, {
          onSuccess: (result) => {
            if (isDev) console.log("[MidtransPayment] Payment success:", result);
            paymentInProgressRef.current = false;
            setIsLoading(false);
            
            toast({
              title: "Pembayaran Berhasil!",
              description: "Order Anda telah dikonfirmasi. Anda sedang diarahkan ke dashboard...",
              duration: 3000,
            });
            onSuccess?.(result);
          },
          onError: (error) => {
            console.error("[MidtransPayment] Payment error from snap:", error);
            paymentInProgressRef.current = false;
            setIsLoading(false);
            
            toast({
              title: "Pembayaran Gagal",
              description: "Silakan coba lagi atau gunakan metode pembayaran lain.",
              variant: "destructive",
              duration: 5000,
            });
            onError?.(new Error("Payment failed"));
          },
          onClose: () => {
            if (isDev) console.log("[MidtransPayment] Payment popup closed");
            paymentInProgressRef.current = false;
            setIsLoading(false);
            
            toast({
              title: "Pembayaran Dibatalkan",
              description: "Anda menutup halaman pembayaran.",
              duration: 2000,
            });
            onClose?.();
          },
        });
      } catch (snapError) {
        console.error("[MidtransPayment] Error calling snap.pay:", snapError);
        paymentInProgressRef.current = false;
        setIsLoading(false);
        
        const errorMsg = snapError instanceof Error ? snapError.message : "Failed to open payment popup";
        toast({
          title: "Error Pembayaran",
          description: errorMsg,
          variant: "destructive",
          duration: 5000,
        });
        onError?.(snapError instanceof Error ? snapError : new Error(errorMsg));
      }
    } catch (error) {
      console.error("[MidtransPayment] Error creating payment token:", error);
      paymentInProgressRef.current = false;
      setIsLoading(false);

      let errorMessage = "Gagal memproses pembayaran";

      if (error instanceof Error) {
        if (error.message.includes("CORS")) {
          errorMessage = "Error koneksi ke server. Pastikan backend/server sudah berjalan";
        } else if (error.message.includes("not authenticated")) {
          errorMessage = "Anda belum login. Silakan login terlebih dahulu";
        } else if (error.message.includes("401")) {
          errorMessage = "Gagal verifikasi. Silakan logout dan login kembali";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage = "Tidak dapat terhubung ke backend. Cek koneksi internet atau hubungi admin";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Terjadi Kesalahan",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });

      onError?.(
        error instanceof Error ? error : new Error("Failed to create payment token")
      );
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading || loading || paymentInProgressRef.current}
      className="w-full bg-green-600 hover:bg-green-700"
      size="lg"
    >
      {isLoading || loading ? "Memproses..." : `Bayar Sekarang - Rp ${amount.toLocaleString("id-ID")}`}
    </Button>
  );
};
