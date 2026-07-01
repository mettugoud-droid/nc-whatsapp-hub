"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function FinancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/finance")
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch(() => setData(null))
        .finally(() => setLoading(false));
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
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
  const expenseBreakdown: any[] = data?.expenseBreakdown || [];
  const recentTransactions: any[] = data?.recentTransactions || [];

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
                {stats.dailyCollectionsChange && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>{stats.dailyCollectionsChange}</span>
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold mt-3">{stats.dailyCollections || "₹0"}</p>
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
              </div>
              <p className="text-2xl font-bold mt-3">{stats.codCollections || "₹0"}</p>
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
                {stats.prepaidChange && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>{stats.prepaidChange}</span>
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold mt-3">{stats.prepaidCollections || "₹0"}</p>
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
              <p className="text-2xl font-bold mt-3">{stats.pendingSettlements || "₹0"}</p>
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
              <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-brand-primary" />
              </div>
              <p className="text-2xl font-bold mt-3">{stats.courierCharges || "₹0"}</p>
              <p className="text-sm text-muted-foreground">Courier Charges</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold mt-3">{stats.refunds || "₹0"}</p>
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
                {stats.netRevenueChange && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>{stats.netRevenueChange}</span>
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold mt-3">{stats.netRevenue || "₹0"}</p>
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
                {stats.grossProfitChange && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>{stats.grossProfitChange}</span>
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold mt-3">{stats.grossProfit || "₹0"}</p>
              <p className="text-sm text-muted-foreground">Gross Profit (MTD)</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
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
            {revenueData.length === 0 ? (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                <p>No revenue data yet. Upload orders to see financial trends.</p>
              </div>
            ) : (
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
                    <Area type="monotone" dataKey="revenue" stroke="#608748" fillOpacity={1} fill="url(#colorFinRevenue)" strokeWidth={2} name="Revenue" />
                    <Area type="monotone" dataKey="cod" stroke="#DFAD35" fillOpacity={1} fill="url(#colorFinCOD)" strokeWidth={1.5} name="COD" />
                    <Area type="monotone" dataKey="prepaid" stroke="#3B82F6" fillOpacity={1} fill="url(#colorFinPrepaid)" strokeWidth={1.5} name="Prepaid" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Expense Breakdown + Transactions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {expenseBreakdown.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                  No expense data available
                </div>
              ) : (
                <>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                          {expenseBreakdown.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {expenseBreakdown.map((item: any) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold">₹{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No transactions yet. Financial data will appear once orders are processed.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((txn: any) => (
                    <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center ${txn.amount > 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                          {txn.amount > 0 ? <ArrowUpRight className="h-4 w-4 text-green-600" /> : <ArrowDownRight className="h-4 w-4 text-red-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{txn.customer}</p>
                          <p className="text-xs text-muted-foreground">{txn.id} &bull; {txn.type} &bull; {txn.method}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${txn.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                          {txn.amount > 0 ? "+" : ""}₹{Math.abs(txn.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{txn.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
