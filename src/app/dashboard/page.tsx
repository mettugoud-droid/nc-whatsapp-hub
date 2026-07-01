"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  MessagesChart,
  CampaignPerformanceChart,
  DeliveryPieChart,
} from "@/components/dashboard/analytics-chart";
import { SmartInsights } from "@/components/dashboard/smart-insights";
import {
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  MessageCircle,
  TrendingUp,
  IndianRupee,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardStats {
  totalContacts: number;
  totalOrders: number;
  codOrders: number;
  prepaidOrders: number;
  totalCampaigns: number;
  activeCampaigns: number;
  messagesToday: number;
  messagesDelivered: number;
  messagesFailed: number;
  messagesPending: number;
  deliveryRate: number;
  totalTemplates: number;
  totalRevenue: number;
  codConversionRate: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = () => {
      fetch("/api/dashboard/stats")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setStats(data.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const s = stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your WhatsApp campaign overview.
        </p>
      </div>

      {/* Stats Grid - Live Data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Messages Sent Today"
          value={loading ? "..." : String(s?.messagesToday || 0)}
          change={s ? `${s.deliveryRate}% delivery rate` : ""}
          changeType="positive"
          icon={Send}
          delay={0}
        />
        <StatCard
          title="Campaigns Running"
          value={loading ? "..." : String(s?.activeCampaigns || 0)}
          change={`${s?.totalCampaigns || 0} total`}
          changeType="neutral"
          icon={MessageSquare}
          iconColor="bg-brand-secondary/10 text-brand-secondary"
          delay={0.1}
        />
        <StatCard
          title="Delivery Rate"
          value={loading ? "..." : `${s?.deliveryRate || 0}%`}
          change={`${s?.messagesDelivered || 0} delivered`}
          changeType="positive"
          icon={CheckCircle2}
          iconColor="bg-green-100 text-green-600 dark:bg-green-900/30"
          delay={0.2}
        />
        <StatCard
          title="Failed Messages"
          value={loading ? "..." : String(s?.messagesFailed || 0)}
          change={`${s?.messagesPending || 0} pending`}
          changeType={s?.messagesFailed === 0 ? "positive" : "negative"}
          icon={XCircle}
          iconColor="bg-red-100 text-red-600 dark:bg-red-900/30"
          delay={0.3}
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Contacts"
          value={loading ? "..." : String(s?.totalContacts || 0)}
          icon={Clock}
          iconColor="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
          delay={0.4}
        />
        <StatCard
          title="Total Orders"
          value={loading ? "..." : String(s?.totalOrders || 0)}
          change={`COD: ${s?.codOrders || 0} | Prepaid: ${s?.prepaidOrders || 0}`}
          changeType="neutral"
          icon={MessageCircle}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30"
          delay={0.5}
        />
        <StatCard
          title="COD to Prepaid %"
          value={loading ? "..." : `${s?.codConversionRate || 0}%`}
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-purple-100 text-purple-600 dark:bg-purple-900/30"
          delay={0.6}
        />
        <StatCard
          title="Total Revenue"
          value={loading ? "..." : formatCurrency(s?.totalRevenue || 0)}
          icon={IndianRupee}
          iconColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
          delay={0.7}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MessagesChart />
        <CampaignPerformanceChart />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SmartInsights />
        </div>
        <DeliveryPieChart />
      </div>
    </div>
  );
}
