"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ShoppingCart,
  IndianRupee,
  CreditCard,
  Banknote,
  TrendingUp,
  Users,
  Repeat,
  Star,
  Loader2,
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/analytics")
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch(() => setData(null))
        .finally(() => setLoading(false));
    };
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const revenueData: any[] = data?.revenueData || [];
  const topProducts: any[] = data?.topProducts || [];
  const topCustomers: any[] = data?.topCustomers || [];
  const codVsPrepaid: any[] = data?.codVsPrepaid || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Business Intelligence
        </h1>
        <p className="text-muted-foreground">
          Nature&apos;s Crates performance analytics and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders?.toString() || "0"}
          change={stats.ordersChange || undefined}
          changeType="positive"
          icon={ShoppingCart}
          delay={0}
        />
        <StatCard
          title="Revenue"
          value={stats.revenue || "₹0"}
          change={stats.revenueChange || undefined}
          changeType="positive"
          icon={IndianRupee}
          iconColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
          delay={0.1}
        />
        <StatCard
          title="COD to Prepaid %"
          value={stats.codToPrepaidPct || "0%"}
          change={stats.codToPrepaidChange || undefined}
          changeType="positive"
          icon={CreditCard}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30"
          delay={0.2}
        />
        <StatCard
          title="Repeat Purchase %"
          value={stats.repeatPurchasePct || "0%"}
          change={stats.repeatPurchaseChange || undefined}
          changeType="positive"
          icon={Repeat}
          iconColor="bg-purple-100 text-purple-600 dark:bg-purple-900/30"
          delay={0.3}
        />
      </div>

      {/* Second Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Avg Order Value"
          value={stats.avgOrderValue || "₹0"}
          change={stats.aovChange || undefined}
          changeType="positive"
          icon={Banknote}
          iconColor="bg-brand-secondary/10 text-brand-secondary"
          delay={0.4}
        />
        <StatCard
          title="Campaign ROI"
          value={stats.campaignRoi || "—"}
          change={stats.roiNote || undefined}
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-brand-primary/10 text-brand-primary"
          delay={0.5}
        />
        <StatCard
          title="Customer LTV"
          value={stats.customerLtv || "₹0"}
          change={stats.ltvNote || undefined}
          changeType="neutral"
          icon={Users}
          iconColor="bg-orange-100 text-orange-600 dark:bg-orange-900/30"
          delay={0.6}
        />
        <StatCard
          title="Coupon Usage"
          value={stats.couponUsage?.toString() || "0"}
          change={stats.couponNote || undefined}
          changeType="neutral"
          icon={Star}
          iconColor="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
          delay={0.7}
        />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Orders Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              <p>No data available. Upload your orders to see revenue trends here.</p>
            </div>
          ) : (
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#608748" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#608748" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                    }}
                    formatter={(value: number) => [`₹${(value / 1000).toFixed(0)}K`, ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#608748"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* COD vs Prepaid + Top Products */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">COD vs Prepaid</CardTitle>
          </CardHeader>
          <CardContent>
            {codVsPrepaid.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                No data available
              </div>
            ) : (
              <>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={codVsPrepaid}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {codVsPrepaid.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6">
                  {codVsPrepaid.map((item: any) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">
                        {item.name} ({item.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No product data yet</p>
            ) : (
              topProducts.map((product: any, i: number) => (
                <div key={product.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">
                    #{i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.orders} orders
                    </p>
                  </div>
                  <p className="text-sm font-bold text-brand-primary">
                    ₹{(product.revenue / 1000).toFixed(0)}K
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Customers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCustomers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No customer data yet</p>
            ) : (
              topCustomers.map((customer: any, i: number) => (
                <div key={customer.name} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-brand-primary">
                      {customer.name.split(" ").map((n: string) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {customer.orders} orders &bull; LTV: ₹{(customer.ltv / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <p className="text-xs font-bold">₹{(customer.revenue / 1000).toFixed(0)}K</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders Chart: COD vs Prepaid */}
      <Card>
        <CardHeader>
          <CardTitle>COD vs Prepaid Orders (Monthly)</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>No data available</p>
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                    }}
                  />
                  <Bar dataKey="codOrders" fill="#DFAD35" radius={[4, 4, 0, 0]} name="COD" />
                  <Bar dataKey="prepaidOrders" fill="#608748" radius={[4, 4, 0, 0]} name="Prepaid" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
