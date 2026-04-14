import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MidtransPayment } from "@/components/MidtransPayment";
import { type PaymentItem } from "@/lib/midtransService";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Package, Shield } from "lucide-react";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, addOrder } = useUser();
  const { toast } = useToast();

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  // Get items from navigation state or localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Silakan Login",
        description: "Anda harus login untuk melakukan checkout",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    const stateItems = location.state?.items;
    if (stateItems) {
      setItems(stateItems);
    } else {
      // Try to get from localStorage
      const savedItems = localStorage.getItem("checkoutItems");
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    }
  }, [isAuthenticated, navigate, location, toast]);

  // Calculate subtotal
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(total);
  }, [items]);

  const total = subtotal;
  const orderId = `ORD-${user?.email?.split("@")[0]}-${Date.now()}`;

  const handlePaymentSuccess = () => {
    setIsPaid(true);
    setIsSuccessDialogOpen(true);
    localStorage.removeItem("checkoutItems");

    // Save orders to database
    items.forEach((item: any) => {
      addOrder({
        templateId: item.templateId,
        templateName: item.name,
        category: item.category || "Template",
        option: item.option || "Standard",
        price: item.price,
        status: "completed",
        paymentMethod: "Midtrans",
      } as any);
    });

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 5000);
  };

  const handlePaymentError = (error: Error) => {
    toast({
      title: "Transaksi Gagal",
      description: "Transaksi anda gagal, lakukan kembali pesanan anda.",
      variant: "destructive",
    });

    addOrder({
      templateId: 0,
      templateName: "",
      category: "",
      option: "",
      price: 0,
      status: "failed",
      paymentMethod: "Midtrans",
    } as any);
  };

  if (isPaid) {
    return (
      <>
        <Navbar brandTextColor="text-black" />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <Shield className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-green-600">Pembayaran Berhasil!</h2>
            <p className="text-gray-600 mb-6">Order Anda telah dikonfirmasi. Anda akan diarahkan ke dashboard.</p>
            <Button onClick={() => navigate("/dashboard")} className="bg-primary">
              Kembali ke Dashboard
            </Button>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar brandTextColor="text-black" />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-4 font-semibold text-primary hover:text-primary/80"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-2">Selesaikan pembayaran Anda</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Items Summary */}
              <div className="md:col-span-2 space-y-4">
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Package className="w-5 h-5" />
                      Ringkasan Pesanan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.length > 0 ? (
                      <>
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2">
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </p>
                          </div>
                        ))}
                        <Separator className="my-4" />
                        <div className="flex justify-between items-center py-2">
                          <p className="font-medium text-gray-900">Subtotal</p>
                          <p className="font-semibold text-gray-900">
                            Rp {subtotal.toLocaleString("id-ID")}
                          </p>
                        </div>

                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Tidak ada item dalam keranjang</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Alamat Pengiriman</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-gray-900">{user?.name || "Nama Pengguna"}</p>
                    <p className="text-gray-700">{user?.email}</p>
                    <p className="text-gray-700">{user?.phone || "No. Telepon belum diisi"}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Summary */}
              <div>
                <Card className="sticky top-4 bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Total Pembayaran</CardTitle>
                    <CardDescription className="text-2xl font-bold text-primary mt-2">
                      Rp {total.toLocaleString("id-ID")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        📍 <strong>Mode Sandbox:</strong> Gunakan kartu test Midtrans untuk pembayaran
                      </p>
                    </div>

                    {items.length > 0 ? (
                      !isPaid ? (
                        <MidtransPayment
                          orderId={orderId}
                          amount={total}
                          customerName={user?.name || "Pelanggan"}
                          customerEmail={user?.email || ""}
                          items={items as PaymentItem[]}
                          onSuccess={handlePaymentSuccess}
                          onError={handlePaymentError}
                        />
                      ) : (
                        <Button disabled className="w-full bg-slate-400 text-white">
                          Pembayaran berhasil, silakan tunggu...
                        </Button>
                      )
                    ) : (
                      <Button disabled className="w-full bg-slate-400 text-white">
                        Tidak ada item untuk dibayar
                      </Button>
                    )}

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-start gap-2 text-xs text-gray-600">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                        <span>Pembayaran aman menggunakan Midtrans</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle>Pembayaran Berhasil!</DialogTitle>
            <DialogDescription>
              Terima kasih, pesanan Anda berhasil diproses. Berikut detail produk yang dibeli.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="rounded-lg border bg-slate-50 p-4">
              <p className="text-sm text-slate-600">No. Order</p>
              <p className="font-semibold text-slate-900 break-all">{orderId}</p>
            </div>

            <div className="rounded-lg border bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-900">Detail Produk</h3>
              <div className="mt-3 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Total Pembayaran</p>
              <p className="text-xl font-semibold text-slate-900">Rp {total.toLocaleString("id-ID")}</p>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button onClick={() => navigate("/dashboard")} className="w-full bg-primary text-white">
              Kembali ke Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default Checkout;
