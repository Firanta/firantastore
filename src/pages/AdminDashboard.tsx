import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Order {
  id: string;
  templateName: string;
  userId: string;
  price: number;
  status: "pending" | "completed" | "cancelled" | "failed";
  createdAt: any;
  category?: string;
  option?: string;
  paymentStatus?: string;
  updatedAt?: any;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  totalTemplates: number;
  totalUsers: number;
  recentOrders: Order[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalTemplates: 0,
    totalUsers: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Count total orders
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const allOrders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        // Calculate stats
        const completed = allOrders.filter((order) => order.status === "completed").length;
        const pending = allOrders.filter((order) => order.status === "pending").length;
        const revenue = allOrders.reduce((sum, order) => {
          if (order.status === "completed") {
            return sum + (order.price || 0);
          }
          return sum;
        }, 0);

        // Get recent orders
        const recentOrdersQuery = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
        const recentOrders = recentOrdersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        // Count templates
        const templatesSnapshot = await getDocs(collection(db, "templates"));
        const totalTemplates = templatesSnapshot.size;

        // Count users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const totalUsers = usersSnapshot.size;

        setStats({
          totalOrders: allOrders.length,
          totalRevenue: revenue,
          completedOrders: completed,
          pendingOrders: pending,
          totalTemplates,
          totalUsers,
          recentOrders,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subtitle,
    color,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>{Icon}</div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Selamat datang di Admin Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={<ShoppingCart className="text-white" size={24} />}
            label="Total Pesanan"
            value={stats.totalOrders}
            color="bg-blue-500"
          />
          <StatCard
            icon={<DollarSign className="text-white" size={24} />}
            label="Pendapatan Total"
            value={`Rp ${(stats.totalRevenue / 1000).toFixed(0)}K`}
            color="bg-green-500"
          />
          <StatCard
            icon={<CheckCircle className="text-white" size={24} />}
            label="Pesanan Selesai"
            value={stats.completedOrders}
            color="bg-emerald-500"
          />
          <StatCard
            icon={<Clock className="text-white" size={24} />}
            label="Pesanan Pending"
            value={stats.pendingOrders}
            color="bg-yellow-500"
          />
          <StatCard
            icon={<Package className="text-white" size={24} />}
            label="Total Template"
            value={stats.totalTemplates}
            color="bg-purple-500"
          />
          <StatCard
            icon={<Users className="text-white" size={24} />}
            label="Total Pengguna"
            value={stats.totalUsers}
            color="bg-pink-500"
          />
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Pesanan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Template</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Harga</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 font-mono text-xs">
                          {order.id.substring(0, 8)}...
                        </td>
                        <td className="py-3 px-4 text-gray-700">{order.templateName}</td>
                        <td className="py-3 px-4 text-gray-900 font-semibold">
                          Rp {(order.price || 0).toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status === "completed"
                              ? "Selesai"
                              : order.status === "pending"
                              ? "Pending"
                              : "Dibatalkan"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-xs">
                          {order.createdAt
                            ? new Date(order.createdAt.toDate?.() || order.createdAt).toLocaleDateString(
                                "id-ID"
                              )
                            : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        Belum ada pesanan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

// Dollar sign icon - fallback if not available
function DollarSign(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}
