"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart, TrendingUp, CheckCircle2, XCircle,
  Pause, Play, Loader2, Zap, MessageSquare,
  IndianRupee, Truck, RotateCcw, Star,
} from "lucide-react";

export default function RecoveryDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/automation?view=metrics")
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (action: string) => {
    await fetch("/api/automation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    // Refresh
    const r = await fetch("/api/automation?view=metrics");
    const d = await r.json();
    if (d.success) setData(d.data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  const m = data || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Recovery & Automation
          </h1>
          <p className="text-muted-foreground">
            WhatsApp automation performance across all 15 modules
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleAction("pause")}>
            <Pause className="h-4 w-4 mr-2" /> Pause All
          </Button>
          <Button onClick={() => handleAction("resume")}>
            <Play className="h-4 w-4 mr-2" /> Resume All
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Zap} title="Active Workflows" value={m.activeWorkflows || 0} color="bg-brand-primary/10 text-brand-primary" />
        <MetricCard icon={MessageSquare} title="Messages Sent" value={m.sentMessages || 0} color="bg-blue-100 text-blue-600" />
        <MetricCard icon={ShoppingCart} title="Buy Now Recoveries" value={m.buyNowRecoveries || 0} color="bg-green-100 text-green-600" />
        <MetricCard icon={RotateCcw} title="Cart Recoveries" value={m.cartRecoveries || 0} color="bg-purple-100 text-purple-600" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={CheckCircle2} title="COD Confirmed" value={m.codConfirmations || 0} color="bg-emerald-100 text-emerald-600" />
        <MetricCard icon={IndianRupee} title="Prepaid Conversions" value={m.prepaidConversions || 0} color="bg-yellow-100 text-yellow-600" />
        <MetricCard icon={Truck} title="NDR Recovered" value={m.ndrRecoveries || 0} color="bg-orange-100 text-orange-600" />
        <MetricCard icon={XCircle} title="Failed Messages" value={m.failedMessages || 0} color="bg-red-100 text-red-600" />
      </div>

      {/* Module Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Automation Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Buy Now Drop Recovery", trigger: "15min → 2hr → 24hr → 48hr", active: true },
              { name: "Cart Abandonment", trigger: "30min → 2hr → 24hr", active: true },
              { name: "COD Confirmation", trigger: "Instant + 4hr + 24hr reminders", active: true },
              { name: "Prepaid Conversion", trigger: "5min after COD order", active: true },
              { name: "Order Lifecycle", trigger: "Confirmed → Shipped → Delivered", active: true },
              { name: "NDR Automation", trigger: "On courier NDR webhook", active: true },
              { name: "RTO Prevention", trigger: "On Out for Delivery", active: true },
              { name: "Delivery Follow-up", trigger: "24hr after delivery", active: true },
              { name: "Repeat Purchase", trigger: "20-30 days after delivery", active: true },
              { name: "Upsell Recommendations", trigger: "72hr after delivery", active: true },
              { name: "AI Customer Support", trigger: "On inbound message", active: true },
              { name: "Quiet Hours", trigger: "9PM - 9AM (no messages)", active: true },
            ].map((mod) => (
              <div key={mod.name} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{mod.name}</p>
                  <p className="text-xs text-muted-foreground">{mod.trigger}</p>
                </div>
                <Badge variant={mod.active ? "success" : "outline"} className="text-[10px]">
                  {mod.active ? "Active" : "Paused"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Workflow Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <StatRow label="Total Workflows" value={m.totalWorkflows || 0} />
            <StatRow label="Active" value={m.activeWorkflows || 0} color="text-green-600" />
            <StatRow label="Completed" value={m.completedWorkflows || 0} color="text-blue-600" />
            <StatRow label="Cancelled (order created)" value={m.cancelledWorkflows || 0} color="text-yellow-600" />
            <StatRow label="Scheduled Messages" value={m.scheduledMessages || 0} color="text-purple-600" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Target Metrics</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <TargetRow label="Buy Now Recovery" current="—" target="10-15%" />
            <TargetRow label="Cart Recovery" current="—" target="15%" />
            <TargetRow label="COD Confirmation" current="—" target="95%" />
            <TargetRow label="Prepaid Conversion" current="—" target="25%" />
            <TargetRow label="NDR Recovery" current="—" target="60%" />
            <TargetRow label="RTO Rate" current="—" target="< 8%" />
            <TargetRow label="WhatsApp Response Rate" current="—" target="35%" />
            <TargetRow label="Repeat Purchase" current="—" target="20%" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, title, value, color }: { icon: any; title: string; value: number; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{title}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatRow({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${color || ""}`}>{value}</span>
    </div>
  );
}

function TargetRow({ label, current, target }: { label: string; current: string; target: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b last:border-0">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold">{current}</span>
        <span className="text-xs text-muted-foreground">Target: {target}</span>
      </div>
    </div>
  );
}
