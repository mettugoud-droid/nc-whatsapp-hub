"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Image, Download, Eye, Loader2, Users, ShoppingCart,
  IndianRupee, TrendingUp, Package, Globe,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORS = ["#608748", "#DFAD35", "#3B82F6", "#8B5CF6", "#EF4444", "#06B6D4"];

export default function InfographicsPage() {
  const [stats, setStats] = useState<any>(null);
  const [visitors, setVisitors] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then(r => r.json()),
      fetch("/api/marketing/realtime").then(r => r.json()),
    ]).then(([statsData, visitorData]) => {
      if (statsData.success) setStats(statsData.data);
      if (visitorData.success) setVisitors(visitorData.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>;

  const s = stats || {};
  const v = visitors || {};

  // Prepare chart data
  const codPrepaidData = [
    { name: "COD", value: s.codOrders || 0, color: "#DFAD35" },
    { name: "Prepaid", value: s.prepaidOrders || 0, color: "#608748" },
  ];

  const topPages = (v.topPages || [])
    .filter((p: any) => p.page !== "Unknown" && p.page !== "(other)")
    .slice(0, 5)
    .map((p: any) => ({
      name: p.page.replace(/Natures crates /g, "").replace(/ Price in India.*$/g, "").replace(/ \| .*$/g, "").substring(0, 25),
      visitors: p.users,
    }));

  const totalVisitors = (v.topPages || []).reduce((sum: number, p: any) => sum + p.users, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Infographics</h1>
          <p className="text-muted-foreground">Live visual reports from your business data</p>
        </div>
        <Badge variant="success" className="text-xs flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Live Data
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <InfoCard icon={Users} label="Contacts" value={s.totalContacts || 0} color="text-brand-primary" />
        <InfoCard icon={ShoppingCart} label="Orders" value={s.totalOrders || 0} color="text-blue-600" />
        <InfoCard icon={IndianRupee} label="Revenue" value={`₹${Math.round((s.totalRevenue || 0) / 1000)}K`} color="text-emerald-600" />
        <InfoCard icon={Globe} label="Live Visitors" value={totalVisitors} color="text-purple-600" />
        <InfoCard icon={TrendingUp} label="COD→Prepaid %" value={`${s.codConversionRate || 0}%`} color="text-orange-600" />
      </div>

      {/* Visual Infographics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* COD vs Prepaid Pie */}
        <Card>
          <CardHeader><CardTitle className="text-base">Payment Mode Split</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={codPrepaidData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={5} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {codPrepaidData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-[#DFAD35]" /><span className="text-sm">COD ({s.codOrders || 0})</span></div>
              <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-[#608748]" /><span className="text-sm">Prepaid ({s.prepaidOrders || 0})</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Live Product Visitors */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />Live Product Visitors</CardTitle></CardHeader>
          <CardContent>
            {topPages.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPages}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                    <YAxis />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }} />
                    <Bar dataKey="visitors" fill="#608748" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">No visitor data right now</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Business Metrics Visual */}
      <Card>
        <CardHeader><CardTitle className="text-base">Business Overview Infographic</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricBlock label="Total Contacts" value={s.totalContacts || 0} subtext="in database" icon="👥" />
            <MetricBlock label="Total Orders" value={s.totalOrders || 0} subtext={`COD: ${s.codOrders || 0} | Prepaid: ${s.prepaidOrders || 0}`} icon="📦" />
            <MetricBlock label="Revenue" value={`₹${((s.totalRevenue || 0) / 1000).toFixed(1)}K`} subtext="total collected" icon="💰" />
            <MetricBlock label="Templates" value={s.totalTemplates || 0} subtext="active" icon="📝" />
            <MetricBlock label="Messages Today" value={s.messagesToday || 0} subtext={`${s.messagesDelivered || 0} delivered`} icon="💬" />
            <MetricBlock label="Delivery Rate" value={`${s.deliveryRate || 0}%`} subtext="of messages" icon="✅" />
            <MetricBlock label="Campaigns" value={s.totalCampaigns || 0} subtext={`${s.activeCampaigns || 0} active`} icon="📢" />
            <MetricBlock label="Conversion" value={`${s.codConversionRate || 0}%`} subtext="COD to Prepaid" icon="🔄" />
          </div>
        </CardContent>
      </Card>

      {/* Live Top Products */}
      {topPages.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Most Viewed Products (Live)</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(v.topPages || []).filter((p: any) => p.page !== "Unknown" && p.page !== "(other)").slice(0, 6).map((page: any, i: number) => {
                const productName = page.page.replace(/Natures crates /g, "").replace(/ Price in India.*$/g, "").replace(/ \| .*$/g, "");
                const maxUsers = Math.max(...(v.topPages || []).map((p: any) => p.users));
                const pct = maxUsers > 0 ? (page.users / maxUsers) * 100 : 0;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-5">#{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{productName}</p>
                      <div className="h-2 bg-accent rounded-full mt-1 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="h-full bg-brand-primary rounded-full" />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-brand-primary">{page.users}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <Card>
        <CardHeader><CardTitle className="text-base">Export</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-2" />PNG</Button>
            <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-2" />PDF</Button>
            <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-2" />Excel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card><CardContent className="p-4 text-center">
        <Icon className={`h-5 w-5 mx-auto mb-1 ${color}`} />
        <p className="text-xl font-bold">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </CardContent></Card>
    </motion.div>
  );
}

function MetricBlock({ label, value, subtext, icon }: { label: string; value: string | number; subtext: string; icon: string }) {
  return (
    <div className="p-4 rounded-xl border bg-accent/20 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-xl font-bold mt-1">{value}</p>
      <p className="text-xs font-medium">{label}</p>
      <p className="text-[10px] text-muted-foreground">{subtext}</p>
    </div>
  );
}
