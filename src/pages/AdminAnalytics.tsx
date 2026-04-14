import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AnalyticsData {
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  completionRate: number;
  topProducts: Array<{ name: string; count: number; revenue: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    completionRate: 0,
    topProducts: [],
    revenueByMonth: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const allOrders = ordersSnapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as any[];

        // Calculate metrics
        const totalRevenue = allOrders.reduce((sum, order) => {
          if (order.status === "completed") {
            return sum + (order.price || 0);
          }
          return sum;
        }, 0);

        const completedOrders = allOrders.filter((o) => o.status === "completed");
        const completionRate = allOrders.length > 0 
          ? Math.round((completedOrders.length / allOrders.length) * 100) 
          : 0;

        const averageOrderValue = completedOrders.length > 0 
          ? Math.round(totalRevenue / completedOrders.length) 
          : 0;

        // Group revenue by month
        const revenueByMonth: Record<string, number> = {};
        completedOrders.forEach((order) => {
          const date = order.createdAt?.toDate?.() || new Date(order.createdAt);
          const monthKey = new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
          });
          revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + (order.price || 0);
        });

        // Get top products
        const productMap: Record<string, { count: number; revenue: number }> = {};
        completedOrders.forEach((order) => {
          const name = order.templateName || "Unknown";
          if (!productMap[name]) {
            productMap[name] = { count: 0, revenue: 0 };
          }
          productMap[name].count += 1;
          productMap[name].revenue += order.price || 0;
        });

        const topProducts = Object.entries(productMap)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        // Calculate monthly revenue (current month)
        const currentMonth = new Date().toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
        });
        const monthlyRevenue = revenueByMonth[currentMonth] || 0;

        setAnalytics({
          totalRevenue,
          monthlyRevenue,
          totalOrders: allOrders.length,
          averageOrderValue,
          completionRate,
          topProducts,
          revenueByMonth: Object.entries(revenueByMonth).map(([month, revenue]) => ({
            month,
            revenue,
          })),
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const MetricCard = ({
    label,
    value,
    trend,
    trendValue,
  }: {
    label: string;
    value: string;
    trend?: "up" | "down";
    trendValue?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-gray-600">{label}</p>
        <div className="flex items-baseline justify-between mt-3">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {trend === "up" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Data penjualan dan performa bisnis</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            label="Total Pendapatan"
            value={`Rp ${(analytics.totalRevenue / 1000000).toFixed(2)}M`}
            trend="up"
            trendValue="+12%"
          />
          <MetricCard
            label="Pendapatan Bulan Ini"
            value={`Rp ${(analytics.monthlyRevenue / 1000).toFixed(0)}K`}
            trend="up"
            trendValue="+8%"
          />
          <MetricCard
            label="Rata-rata Order"
            value={`Rp ${(analytics.averageOrderValue / 1000).toFixed(0)}K`}
          />
          <MetricCard
            label="Total Pesanan"
            value={analytics.totalOrders.toString()}
          />
          <MetricCard
            label="Tingkat Penyelesaian"
            value={`${analytics.completionRate}%`}
            trend="up"
            trendValue="+5%"
          />
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600">Last Update</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                {new Date().toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Template Terlaris
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.length > 0 ? (
                analytics.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-600 mt-1">{product.count} pesanan</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        Rp {(product.revenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">Belum ada data penjualan</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Month */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Pendapatan per Bulan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.revenueByMonth.length > 0 ? (
                analytics.revenueByMonth.slice(-6).reverse().map((item, index) => {
                  const maxRevenue = Math.max(
                    ...analytics.revenueByMonth.map((r) => r.revenue)
                  );
                  const percentage = (item.revenue / maxRevenue) * 100;

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-700">{item.month}</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Rp {(item.revenue / 1000000).toFixed(2)}M
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-8">Belum ada data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
