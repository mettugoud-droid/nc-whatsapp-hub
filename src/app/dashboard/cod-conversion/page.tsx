"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  ArrowLeftRight,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Link2,
  AlertCircle,
  TrendingUp,
  Search,
  Play,
  RefreshCw,
  Loader2,
} from "lucide-react";

function getConversionStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return <Badge variant="outline">Pending</Badge>;
    case "link_sent":
      return <Badge variant="info">Link Sent</Badge>;
    case "payment_pending":
      return <Badge variant="warning">Payment Pending</Badge>;
    case "payment_successful":
      return <Badge variant="success">Converted</Badge>;
    case "payment_failed":
      return <Badge variant="destructive">Failed</Badge>;
    case "link_expired":
      return <Badge variant="destructive">Expired</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function CodConversionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cod-conversion")
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

  const codOrders: any[] = data?.orders || [];
  const stats = data?.stats || {};

  const filtered = codOrders.filter(
    (o: any) =>
      (o.customer || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.orderId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            COD to Prepaid Conversion
          </h1>
          <p className="text-muted-foreground">
            Convert Cash on Delivery orders to prepaid with automated discounts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Orders
          </Button>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Auto Convert
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total COD Orders"
          value={stats.totalCodOrders?.toString() || "0"}
          icon={ArrowLeftRight}
          delay={0}
        />
        <StatCard
          title="Converted to Prepaid"
          value={stats.converted?.toString() || "0"}
          change={stats.convertedToday ? `+${stats.convertedToday} today` : undefined}
          changeType="positive"
          icon={CheckCircle2}
          iconColor="bg-green-100 text-green-600 dark:bg-green-900/30"
          delay={0.1}
        />
        <StatCard
          title="Conversion Rate"
          value={stats.conversionRate || "0%"}
          change={stats.conversionRateChange || undefined}
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30"
          delay={0.2}
        />
        <StatCard
          title="Revenue Collected"
          value={stats.revenueCollected || "₹0"}
          change={stats.revenueToday || undefined}
          changeType="positive"
          icon={IndianRupee}
          iconColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
          delay={0.3}
        />
        <StatCard
          title="Total Discount Given"
          value={stats.totalDiscount || "₹0"}
          change={stats.avgDiscount || undefined}
          changeType="neutral"
          icon={AlertCircle}
          iconColor="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
          delay={0.4}
        />
      </div>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Automated Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {[
              { step: 1, label: "Detect COD", icon: Search },
              { step: 2, label: "Apply Discount", icon: IndianRupee },
              { step: 3, label: "Generate Link", icon: Link2 },
              { step: 4, label: "Send WhatsApp", icon: Send },
              { step: 5, label: "Schedule Reminders", icon: Clock },
              { step: 6, label: "Payment Received", icon: CheckCircle2 },
              { step: 7, label: "Update Status", icon: RefreshCw },
            ].map((item, i) => (
              <div key={item.step} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-brand-primary" />
                  </div>
                  <span className="text-[10px] font-medium text-center whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
                {i < 6 && (
                  <div className="w-8 h-0.5 bg-brand-primary/30 mx-1 mt-[-16px]" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Orders Table */}
      {codOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ArrowLeftRight className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">No COD orders to convert</h3>
            <p className="text-sm text-muted-foreground">
              Upload your orders or sync with your store to see COD orders here for conversion.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-accent/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                      Order
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                      Product
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                      Original
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                      Discount
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                      Pay Amount
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                      Reminders
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                      Link Expiry
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order: any) => (
                    <tr
                      key={order.id}
                      className="border-b hover:bg-accent/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-mono font-medium">
                          {order.orderId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.createdAt}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.phone}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm">{order.product}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        ₹{order.originalAmount}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-green-600">
                        -₹{order.discount}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold">
                        ₹{order.finalAmount}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getConversionStatusBadge(order.status)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {order.remindersSent}/3
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                        {order.linkExpiry}
                      </td>
                      <td className="px-4 py-3">
                        {order.status === "pending" && (
                          <Button size="sm" className="text-xs">
                            <Send className="h-3 w-3 mr-1" /> Send Link
                          </Button>
                        )}
                        {order.status === "link_expired" && (
                          <Button size="sm" variant="outline" className="text-xs">
                            <RefreshCw className="h-3 w-3 mr-1" /> Resend
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
