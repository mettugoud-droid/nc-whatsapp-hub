"use client";

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
  LineChart,
  Line,
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
  Package,
} from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 285000, orders: 420, codOrders: 280, prepaidOrders: 140 },
  { month: "Feb", revenue: 312000, orders: 456, codOrders: 295, prepaidOrders: 161 },
  { month: "Mar", revenue: 345000, orders: 510, codOrders: 310, prepaidOrders: 200 },
  { month: "Apr", revenue: 298000, orders: 445, codOrders: 265, prepaidOrders: 180 },
  { month: "May", revenue: 378000, orders: 567, codOrders: 320, prepaidOrders: 247 },
  { month: "Jun", revenue: 425000, orders: 612, codOrders: 335, prepaidOrders: 277 },
  { month: "Jul", revenue: 456000, orders: 680, codOrders: 350, prepaidOrders: 330 },
  { month: "Aug", revenue: 489000, orders: 720, codOrders: 360, prepaidOrders: 360 },
  { month: "Sep", revenue: 534000, orders: 780, codOrders: 370, prepaidOrders: 410 },
  { month: "Oct", revenue: 578000, orders: 845, codOrders: 380, prepaidOrders: 465 },
];

const topProducts = [
  { name: "Premium Cashews", revenue: 125000, orders: 234 },
  { name: "Organic Almonds", revenue: 98000, orders: 189 },
  { name: "Trail Mix Combo", revenue: 87000, orders: 165 },
  { name: "Dried Fruits Box", revenue: 76000, orders: 145 },
  { name: "Walnuts 500g", revenue: 65000, orders: 130 },
];

const topCustomers = [
  { name: "Deepika Nair", orders: 22, revenue: 45000, ltv: 78000 },
  { name: "Neha Singh", orders: 15, revenue: 38000, ltv: 62000 },
  { name: "Rahul Sharma", orders: 12, revenue: 28000, ltv: 45000 },
  { name: "Anita Verma", orders: 9, revenue: 22000, ltv: 35000 },
  { name: "Amit Patel", orders: 8, revenue: 18000, ltv: 28000 },
];

const codVsPrepaid = [
  { name: "COD", value: 45, color: "#DFAD35" },
  { name: "Prepaid", value: 55, color: "#608748" },
];

export default function AnalyticsPage() {
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
          value="845"
          change="+15% this month"
          changeType="positive"
          icon={ShoppingCart}
          delay={0}
        />
        <StatCard
          title="Revenue"
          value="₹5,78,000"
          change="+8.2% vs last month"
          changeType="positive"
          icon={IndianRupee}
          iconColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
          delay={0.1}
        />
        <StatCard
          title="COD to Prepaid %"
          value="57.1%"
          change="+12% improvement"
          changeType="positive"
          icon={CreditCard}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30"
          delay={0.2}
        />
        <StatCard
          title="Repeat Purchase %"
          value="42.5%"
          change="+5.3% this quarter"
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
          value="₹684"
          change="+₹35 from last month"
          changeType="positive"
          icon={Banknote}
          iconColor="bg-brand-secondary/10 text-brand-secondary"
          delay={0.4}
        />
        <StatCard
          title="Campaign ROI"
          value="3.2x"
          change="Per ₹1 spent"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-brand-primary/10 text-brand-primary"
          delay={0.5}
        />
        <StatCard
          title="Customer LTV"
          value="₹4,250"
          change="12-month average"
          changeType="neutral"
          icon={Users}
          iconColor="bg-orange-100 text-orange-600 dark:bg-orange-900/30"
          delay={0.6}
        />
        <StatCard
          title="Coupon Usage"
          value="1,245"
          change="₹62,000 in discounts"
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
        </CardContent>
      </Card>

      {/* COD vs Prepaid + Top Products */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">COD vs Prepaid</CardTitle>
          </CardHeader>
          <CardContent>
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
                    {codVsPrepaid.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6">
              {codVsPrepaid.map((item) => (
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((product, i) => (
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
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Customers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCustomers.map((customer, i) => (
              <div key={customer.name} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-brand-primary">
                    {customer.name.split(" ").map((n) => n[0]).join("")}
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
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Orders Chart: COD vs Prepaid */}
      <Card>
        <CardHeader>
          <CardTitle>COD vs Prepaid Orders (Monthly)</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
