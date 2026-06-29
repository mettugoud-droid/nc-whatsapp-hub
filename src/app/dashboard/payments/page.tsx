"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock,
  Link2,
  Settings,
  Shield,
  Loader2,
} from "lucide-react";

function getPaymentStatusBadge(status: string) {
  switch (status) {
    case "captured":
      return <Badge variant="success">Paid</Badge>;
    case "pending":
      return <Badge variant="warning">Pending</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    case "expired":
      return <Badge variant="outline">Expired</Badge>;
    case "refunded":
      return <Badge variant="info">Refunded</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function PaymentsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const payments: any[] = data?.payments || [];
  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Track payment links and transactions via Razorpay
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Gateway Settings
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Collections"
          value={stats.totalCollections || "₹0"}
          change={stats.collectionsToday || undefined}
          changeType="positive"
          icon={IndianRupee}
          delay={0}
        />
        <StatCard
          title="Successful Payments"
          value={stats.successfulPayments?.toString() || "0"}
          change={stats.successRate || undefined}
          changeType="positive"
          icon={CheckCircle2}
          iconColor="bg-green-100 text-green-600 dark:bg-green-900/30"
          delay={0.1}
        />
        <StatCard
          title="Failed Payments"
          value={stats.failedPayments?.toString() || "0"}
          change={stats.failedChange || undefined}
          changeType="positive"
          icon={XCircle}
          iconColor="bg-red-100 text-red-600 dark:bg-red-900/30"
          delay={0.2}
        />
        <StatCard
          title="Active Payment Links"
          value={stats.activeLinks?.toString() || "0"}
          change={stats.expiringToday || undefined}
          changeType="neutral"
          icon={Link2}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30"
          delay={0.3}
        />
      </div>

      {/* Payment Gateway Info */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {payments.length === 0 ? (
                <div className="py-12 text-center">
                  <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-1">No transactions yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Payments will appear here once customers start paying via payment links.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-accent/30">
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Order</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Amount</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Method</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Paid At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment: any) => (
                        <tr key={payment.id} className="border-b hover:bg-accent/20 transition-colors">
                          <td className="px-4 py-3 text-sm font-mono">{payment.orderId}</td>
                          <td className="px-4 py-3 text-sm">{payment.customer}</td>
                          <td className="px-4 py-3 text-sm text-right font-bold">₹{payment.amount}</td>
                          <td className="px-4 py-3 text-sm text-center">{payment.method || "—"}</td>
                          <td className="px-4 py-3 text-center">{getPaymentStatusBadge(payment.status)}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{payment.paidAt || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gateway Config Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand-primary" />
              Payment Gateway
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-accent/50 border">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">Razorpay</p>
                  <p className="text-xs text-green-600">Connected</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode</span>
                  <Badge variant="warning" className="text-[10px]">Sandbox</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Key ID</span>
                  <span className="font-mono">rzp_test_***</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Webhook</span>
                  <Badge variant="success" className="text-[10px]">Active</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase">Supported Gateways</p>
              {["Razorpay", "Cashfree", "PhonePe", "PayU", "Stripe", "Paytm"].map((gw) => (
                <div key={gw} className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50">
                  <span className="text-sm">{gw}</span>
                  {gw === "Razorpay" ? (
                    <Badge variant="success" className="text-[10px]">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">Available</Badge>
                  )}
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full" size="sm">
              <Settings className="h-3 w-3 mr-2" />
              Configure Gateway
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
