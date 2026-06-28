"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Banknote,
  CreditCard,
  Truck,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  PieChart as PieChartIcon,
  Wallet,
} from "lucide-react";
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

// Sample finance data
const revenueData = [
  { date: "1 Oct", revenue: 42000, cod: 25000, prepaid: 17000 },
  { date: "2 Oct", revenue: 38000, cod: 22000, prepaid: 16000 },
  { date: "3 Oct", revenue: 55000, cod: 30000, prepaid: 25000 },
  { date: "4 Oct", revenue: 48000, cod: 26000, prepaid: 22000 },
  { date: "5 Oct", revenue: 62000, cod: 33000, prepaid: 29000 },
  { date: "6 Oct", revenue: 45000, cod: 24000, prepaid: 21000 },
  { date: "7 Oct", revenue: 71000, cod: 38000, prepaid: 33000 },
  { date: "8 Oct", revenue: 58000, cod: 31000, prepaid: 27000 },
  { date: "9 Oct", revenue: 67000, cod: 35000, prepaid: 32000 },
  { date: "10 Oct", revenue: 73000, cod: 39000, prepaid: 34000 },
  { date: "11 Oct", revenue: 56000, cod: 29000, prepaid: 27000 },
  { date: "12 Oct", revenue: 81000, cod: 42000, prepaid: 39000 },
  { date: "13 Oct", revenue: 69000, cod: 36000, prepaid: 33000 },
  { date: "14 Oct", revenue: 75000, cod: 40000, prepaid: 35000 },
];

const expenseBreakdown = [
  { name: "Courier Charges", value: 45000, color: "#608748" },
  { name: "Packaging", value: 12000, color: "#DFAD35" },
  { name: "Platform Fees", value: 8500, color: "#3B82F6" },
  { name: "Refunds", value: 15000, color: "#EF4444" },
  { name: "Marketing", value: 22000, color: "#8B5CF6" },
];

const recentTransactions = [
  { id: "TXN-4521", type: "Collection", customer: "Deepika Nair", amount: 2499, method: "COD", status: "completed", date: "Today, 11:30 AM" },
  { id: "TXN-4520", type: "Refund", customer: "Rahul Sharma", amount: -899, method: "UPI", status: "processed", date: "Today, 10:15 AM" },
  { id: "TXN-4519", type: "Collection", customer: "Neha Singh", amount: 1450, method: "Prepaid", status: "completed", date: "Today, 9:45 AM" },
  { id: "TXN-4518", type: "Collection", customer: "Amit Patel", amount: 3200, method: "COD", status: "pending", date: "Today, 9:00 AM" },
  { id: "TXN-4517", type: "Settlement", customer: "Courier Partner", amount: -12500, method: "NEFT", status: "completed", date: "Yesterday" },
  { id: "TXN-4516", type: "Collection", customer: "Priya Gupta", amount: 1899, method: "Prepaid", status: "completed", date: "Yesterday" },
];

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-muted-foreground">
            Revenue tracking, collections, and financial overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" /> This Month
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <IndianRupee className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+18%</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">₹75,400</p>
              <p className="text-sm text-muted-foreground">Daily Collections</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Banknote className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <ArrowDownRight className="h-4 w-4" />
                  <span>-5%</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">₹40,200</p>
              <p className="text-sm text-muted-foreground">COD Collections</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+32%</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">₹35,200</p>
              <p className="text-sm text-muted-foreground">Prepaid Collections</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">₹1,85,000</p>
              <p className="text-sm text-muted-foreground">Pending Settlements</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">₹45,000</p>
              <p className="text-sm text-muted-foreground">Courier Charges</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <RotateCcw className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">₹15,000</p>
              <p className="text-sm text-muted-foreground">Refunds</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+22%</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">₹8,40,000</p>
              <p className="text-sm text-muted-foreground">Net Revenue (MTD)</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <PieChartIcon className="h-6 w-6 text-teal-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+8%</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">₹3,15,000</p>
              <p className="text-sm text-muted-foreground">Gross Profit (MTD)</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue Trend (Daily)</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#608748]" />
                  <span className="text-muted-foreground">Total Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#DFAD35]" />
                  <span className="text-muted-foreground">COD</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#3B82F6]" />
                  <span className="text-muted-foreground">Prepaid</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorFinRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#608748" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#608748" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorFinCOD" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DFAD35" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#DFAD35" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorFinPrepaid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      backgroundColor: "hsl(var(--card))",
                    }}
                    formatter={(value: number) => [`₹${(value / 1000).toFixed(1)}K`, ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#608748"
                    fillOpacity={1}
                    fill="url(#colorFinRevenue)"
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="cod"
                    stroke="#DFAD35"
                    fillOpacity={1}
                    fill="url(#colorFinCOD)"
                    strokeWidth={1.5}
                    name="COD"
                  />
                  <Area
                    type="monotone"
                    dataKey="prepaid"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorFinPrepaid)"
                    strokeWidth={1.5}
                    name="Prepaid"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Expense Breakdown + Transactions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {expenseBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold">₹{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center ${
                          txn.amount > 0
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-red-100 dark:bg-red-900/30"
                        }`}
                      >
                        {txn.amount > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{txn.customer}</p>
                        <p className="text-xs text-muted-foreground">
                          {txn.id} &bull; {txn.type} &bull; {txn.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${
                          txn.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {txn.amount > 0 ? "+" : ""}₹{Math.abs(txn.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{txn.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
