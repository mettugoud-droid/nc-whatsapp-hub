"use client";

import { useState } from "react";
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
} from "lucide-react";

const codOrders = [
  {
    id: "1",
    orderId: "NC-2024-1234",
    customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    product: "Premium Cashews 1kg",
    originalAmount: 1299,
    discount: 65,
    finalAmount: 1234,
    status: "link_sent",
    remindersSent: 1,
    linkExpiry: "22h remaining",
    createdAt: "2024-10-20 09:30",
  },
  {
    id: "2",
    orderId: "NC-2024-1235",
    customer: "Priya Gupta",
    phone: "+91 87654 32109",
    product: "Organic Almonds 500g",
    originalAmount: 899,
    discount: 45,
    finalAmount: 854,
    status: "payment_successful",
    remindersSent: 0,
    linkExpiry: "Paid",
    createdAt: "2024-10-20 08:15",
  },
  {
    id: "3",
    orderId: "NC-2024-1236",
    customer: "Amit Patel",
    phone: "+91 76543 21098",
    product: "Trail Mix Combo",
    originalAmount: 1599,
    discount: 80,
    finalAmount: 1519,
    status: "pending",
    remindersSent: 0,
    linkExpiry: "Not sent",
    createdAt: "2024-10-20 10:00",
  },
  {
    id: "4",
    orderId: "NC-2024-1237",
    customer: "Neha Singh",
    phone: "+91 65432 10987",
    product: "Dried Fruits Gift Box",
    originalAmount: 2499,
    discount: 125,
    finalAmount: 2374,
    status: "link_expired",
    remindersSent: 3,
    linkExpiry: "Expired",
    createdAt: "2024-10-18 14:30",
  },
  {
    id: "5",
    orderId: "NC-2024-1238",
    customer: "Vikram Reddy",
    phone: "+91 54321 09876",
    product: "Walnuts 250g",
    originalAmount: 699,
    discount: 35,
    finalAmount: 664,
    status: "payment_pending",
    remindersSent: 2,
    linkExpiry: "4h remaining",
    createdAt: "2024-10-19 11:45",
  },
];

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

  const filtered = codOrders.filter(
    (o) =>
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase())
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
          value="156"
          icon={ArrowLeftRight}
          delay={0}
        />
        <StatCard
          title="Converted to Prepaid"
          value="89"
          change="+12 today"
          changeType="positive"
          icon={CheckCircle2}
          iconColor="bg-green-100 text-green-600 dark:bg-green-900/30"
          delay={0.1}
        />
        <StatCard
          title="Conversion Rate"
          value="57.1%"
          change="+3.2% this week"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30"
          delay={0.2}
        />
        <StatCard
          title="Revenue Collected"
          value="₹1,85,400"
          change="+₹24,500 today"
          changeType="positive"
          icon={IndianRupee}
          iconColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
          delay={0.3}
        />
        <StatCard
          title="Total Discount Given"
          value="₹9,250"
          change="5% avg discount"
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
                {filtered.map((order) => (
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
    </div>
  );
}
