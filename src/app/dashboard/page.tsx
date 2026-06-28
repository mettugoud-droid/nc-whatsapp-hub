"use client";

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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your WhatsApp campaign overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Messages Sent Today"
          value="1,284"
          change="+12% from yesterday"
          changeType="positive"
          icon={Send}
          delay={0}
        />
        <StatCard
          title="Campaigns Running"
          value="5"
          change="2 scheduled"
          changeType="neutral"
          icon={MessageSquare}
          iconColor="bg-brand-secondary/10 text-brand-secondary"
          delay={0.1}
        />
        <StatCard
          title="Delivery Rate"
          value="96.2%"
          change="+2.1% from last week"
          changeType="positive"
          icon={CheckCircle2}
          iconColor="bg-green-100 text-green-600 dark:bg-green-900/30"
          delay={0.2}
        />
        <StatCard
          title="Failed Messages"
          value="48"
          change="-8% from yesterday"
          changeType="positive"
          icon={XCircle}
          iconColor="bg-red-100 text-red-600 dark:bg-red-900/30"
          delay={0.3}
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Queue"
          value="156"
          change="Processing..."
          changeType="neutral"
          icon={Clock}
          iconColor="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
          delay={0.4}
        />
        <StatCard
          title="Today's Responses"
          value="312"
          change="+23% engagement"
          changeType="positive"
          icon={MessageCircle}
          iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30"
          delay={0.5}
        />
        <StatCard
          title="Conversions"
          value="89"
          change="+15% from last week"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-purple-100 text-purple-600 dark:bg-purple-900/30"
          delay={0.6}
        />
        <StatCard
          title="Revenue Generated"
          value="₹1,24,500"
          change="+28% this month"
          changeType="positive"
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
