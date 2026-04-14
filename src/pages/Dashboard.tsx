import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Package,
  User,
  Settings,
  Star,
  MessageSquare,
  Download,
  X,
  Edit2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser, OrderItem } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { user, orders, logout, rateTemplate, updateProfile } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<
    "orders" | "profile" | "settings"
  >("orders");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [ratingForm, setRatingForm] = useState({ rating: 0, comment: "" });
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState(
    user || { name: "", email: "", phone: "", company: "" }
  );

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logout Berhasil",
        description: "Anda telah keluar dari akun Anda",
        duration: 2000,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Logout Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleSubmitRating = (orderId: string) => {
    if (ratingForm.rating === 0) {
      toast({
        title: "Rating Diperlukan",
        description: "Pilih rating setidaknya 1 bintang",
        duration: 2000,
      });
      return;
    }

    rateTemplate(orderId, ratingForm.rating, ratingForm.comment);
    toast({
      title: "Rating Berhasil",
      description: "Terima kasih atas ulasan Anda!",
      duration: 2000,
    });
    setSelectedOrder(null);
    setRatingForm({ rating: 0, comment: "" });
  };

  const handleUpdateProfile = () => {
    updateProfile(profileData);
    toast({
      title: "Profil Diperbarui",
      description: "Data profil Anda telah disimpan",
      duration: 2000,
    });
    setEditProfile(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Silakan login untuk mengakses dashboard
          </p>
          <button
            onClick={() => navigate("/signin")}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-700";
      case "pending":
        return "bg-yellow-500/20 text-yellow-700";
      case "cancelled":
      case "failed":
        return "bg-red-500/20 text-red-700";
      default:
        return "bg-gray-500/20 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Selamat datang kembali, {user.name}!
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-red-500/30 text-red-600 hover:bg-red-500/10 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 flex-wrap">
            {[
              { id: "orders", label: "Pesanan", icon: Package },
              { id: "profile", label: "Profil", icon: User },
              { id: "settings", label: "Pengaturan", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "border border-primary/30 text-muted-foreground hover:text-foreground hover:border-primary/60"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {orders.length === 0 ? (
                  <div className="text-center py-20">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">
                      Anda belum memiliki pesanan
                    </p>
                    <button
                      onClick={() => navigate("/templates")}
                      className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                    >
                      Lihat Template
                    </button>
                  </div>
                ) : (
                  orders.map((order, idx) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="glass rounded-xl p-6 glow-border hover:glow-border-primary transition-all duration-300"
                    >
                      {order.status !== "failed" ? (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-[0.1em]">
                              Template
                            </p>
                            <p className="font-semibold text-foreground">
                              {order.templateName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-[0.1em]">
                              Kategori
                            </p>
                            <p className="font-semibold text-foreground">
                              {order.category}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-[0.1em]">
                              Paket
                            </p>
                            <p className="text-sm text-foreground">
                              {order.option}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-[0.1em]">
                              Harga
                            </p>
                            <p className="font-bold text-primary">
                              {formatPrice(order.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 justify-between md:flex-col md:items-start">
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status === "completed"
                                ? "Selesai"
                                : order.status === "pending"
                                  ? "Menunggu"
                                  : "Dibatalkan"}
                            </span>
                            {!order.rating && order.status === "completed" && (
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setRatingForm({ rating: 0, comment: "" });
                                }}
                                className="text-xs text-primary hover:underline"
                              >
                                Beri Rating
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 mb-4 rounded-2xl border border-red-200 bg-red-50 p-5">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-[0.1em]">
                                Status
                              </p>
                              <p className="text-base font-semibold text-red-700">Gagal</p>
                            </div>
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(
                                order.status
                              )}`}
                            >
                              Gagal
                            </span>
                          </div>
                          <div className="rounded-2xl bg-red-50 p-4 border border-red-200">
                            <p className="text-sm font-semibold text-red-700">
                              Transaksi anda gagal, lakukan kembali pesanan anda.
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                              Produk template tidak dilampirkan karena pembayaran tidak berhasil.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(order.date)}</span>
                        {order.rating && (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < order.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span>Sudah dirating</span>
                          </div>
                        )}
                        {order.status === "completed" && (
                          <button className="flex items-center gap-1 text-primary hover:underline">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl"
              >
                <div className="glass rounded-xl p-8 glow-border">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-foreground">
                      Profil Saya
                    </h2>
                    {!editProfile && (
                      <button
                        onClick={() => setEditProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>

                  {editProfile ? (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg opacity-50 cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Email tidak dapat diubah
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nomor Telepon
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone || ""}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nama Perusahaan
                        </label>
                        <input
                          type="text"
                          value={profileData.company || ""}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              company: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={handleUpdateProfile}
                          className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                        >
                          Simpan Perubahan
                        </button>
                        <button
                          onClick={() => setEditProfile(false)}
                          className="flex-1 py-2.5 rounded-lg border border-primary/30 text-foreground hover:bg-primary/5 transition-colors"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="pb-6 border-b border-border">
                        <p className="text-sm text-muted-foreground mb-1">
                          Nama Lengkap
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {user.name}
                        </p>
                      </div>

                      <div className="pb-6 border-b border-border">
                        <p className="text-sm text-muted-foreground mb-1">
                          Email
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {user.email}
                        </p>
                      </div>

                      <div className="pb-6 border-b border-border">
                        <p className="text-sm text-muted-foreground mb-1">
                          Nomor Telepon
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {user.phone || "Belum diatur"}
                        </p>
                      </div>

                      <div className="pb-6 border-b border-border">
                        <p className="text-sm text-muted-foreground mb-1">
                          Nama Perusahaan
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {user.company || "Belum diatur"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Bergabung sejak
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl"
              >
                <div className="glass rounded-xl p-8 glow-border space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Pengaturan
                  </h2>

                  <div>
                    <label className="flex items-center justify-between py-4 border-b border-border cursor-pointer">
                      <span className="font-medium text-foreground">
                        Notifikasi Email
                      </span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center justify-between py-4 border-b border-border cursor-pointer">
                      <span className="font-medium text-foreground">
                        Notifikasi SMS
                      </span>
                      <input type="checkbox" className="w-5 h-5" />
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center justify-between py-4 border-b border-border cursor-pointer">
                      <span className="font-medium text-foreground">
                        Newsletter
                      </span>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5"
                      />
                    </label>
                  </div>

                  <div className="pt-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Zona Berbahaya
                    </h3>
                    <button className="px-6 py-2.5 rounded-lg bg-red-500/20 text-red-600 border border-red-500/30 hover:bg-red-500/30 transition-colors font-semibold">
                      Hapus Akun
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl max-w-md w-full p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Beri Rating
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-muted-foreground mb-6">
                Bagaimana pengalaman Anda dengan{" "}
                <strong>{selectedOrder.templateName}</strong>?
              </p>

              <div className="space-y-6">
                {/* Star Rating */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-4">
                    Rating
                  </p>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setRatingForm({
                            ...ratingForm,
                            rating: i + 1,
                          })
                        }
                        className={`text-3xl transition-all duration-300 ${
                          i < ratingForm.rating
                            ? "text-yellow-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        ★
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Komentar (Opsional)
                  </label>
                  <textarea
                    value={ratingForm.comment}
                    onChange={(e) =>
                      setRatingForm({
                        ...ratingForm,
                        comment: e.target.value,
                      })
                    }
                    placeholder="Bagikan pengalaman Anda..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 resize-none h-24"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSubmitRating(selectedOrder.id)}
                    className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                  >
                    Kirim Rating
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-2.5 rounded-lg border border-primary/30 text-foreground hover:bg-primary/5 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Dashboard;
