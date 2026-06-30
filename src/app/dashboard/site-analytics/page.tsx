"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, Eye, ShoppingCart, TrendingUp, Globe, ExternalLink,
  BarChart3, Target, Zap, Loader2, RefreshCw,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

export default function SiteAnalyticsPage() {
  const [realtime, setRealtime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchRealtime = () => {
    fetch("/api/marketing/realtime")
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setRealtime(data.data);
          setLastUpdated(new Date().toLocaleTimeString());
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRealtime();
    const interval = setInterval(fetchRealtime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>;
  }

  // Prepare chart data from top pages
  const pageChartData = (realtime?.topPages || [])
    .filter((p: any) => p.page !== "Unknown" && p.page !== "(other)")
    .map((p: any) => ({
      name: p.page.length > 30 ? p.page.substring(0, 30) + "..." : p.page,
      fullName: p.page,
      users: p.users,
    }))
    .slice(0, 8);

  const totalVisitors = (realtime?.topPages || []).reduce((sum: number, p: any) => sum + p.users, 0);

  const PIE_COLORS = ["#608748", "#DFAD35", "#3B82F6", "#8B5CF6", "#EF4444", "#06B6D4", "#F97316", "#EC4899"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            Live Site Visitors
          </h1>
          <p className="text-muted-foreground">
            Real-time data from naturescrates.com • Last updated: {lastUpdated}
          </p>
        </div>
        <Button variant="outline" onClick={fetchRealtime}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Live Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <LiveCard icon={Users} label="Total Visitors (30min)" value={totalVisitors} color="bg-brand-primary/10 text-brand-primary" trend="+live" />
        <LiveCard icon={Eye} label="Page Views" value={realtime?.pageViews || 0} color="bg-blue-100 text-blue-600" trend="30min" />
        <LiveCard icon={Zap} label="Events" value={realtime?.events || 0} color="bg-purple-100 text-purple-600" trend="30min" />
        <LiveCard icon={ShoppingCart} label="Conversions" value={realtime?.conversions || 0} color="bg-green-100 text-green-600" trend="30min" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart - Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Pages by Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            {pageChartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value: number) => [`${value} visitors`, ""]}
                      labelFormatter={(label) => pageChartData.find((p: any) => p.name === label)?.fullName || label}
                      contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--card))" }}
                    />
                    <Bar dataKey="users" fill="#608748" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">No visitor data available</p>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart - Visitor Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visitor Distribution by Page</CardTitle>
          </CardHeader>
          <CardContent>
            {pageChartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pageChartData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={3} dataKey="users" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                      {pageChartData.map((_: any, i: number) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} visitors`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">No data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" /> Pages Being Viewed Right Now
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(realtime?.topPages || []).length > 0 ? (
            <div className="space-y-2">
              {(realtime?.topPages || []).map((page: any, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/30 transition-colors">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}>
                    {page.users}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {page.page === "Unknown" ? "Homepage / Direct" : page.page === "(other)" ? "Other Pages" :
                        page.page.replace(/Natures crates /g, "").replace(/ Price in India.*$/g, "").replace(/ \| .*$/g, "")}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{page.page}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-brand-primary">{page.users}</p>
                    <p className="text-[10px] text-muted-foreground">visitors</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No active visitors right now</p>
          )}
        </CardContent>
      </Card>

      {/* Connected Services */}
      <Card>
        <CardHeader><CardTitle className="text-base">Connected Tracking</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <ServiceBadge name="Facebook Pixel" id="1293510849364763" color="bg-blue-100 text-blue-700" />
            <ServiceBadge name="Google Analytics 4" id="G-WGQRPCPYZK" color="bg-orange-100 text-orange-700" />
            <ServiceBadge name="Google Ads" id="AW-18171486303" color="bg-green-100 text-green-700" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LiveCard({ icon: Icon, label, value, color, trend }: { icon: any; label: string; value: number; color: string; trend: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="text-[10px]">{trend}</Badge>
          </div>
          <p className="text-3xl font-bold mt-3">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ServiceBadge({ name, id, color }: { name: string; id: string; color: string }) {
  return (
    <div className={`p-3 rounded-lg ${color} flex items-center justify-between`}>
      <div>
        <p className="text-xs font-bold">{name}</p>
        <p className="text-[10px] font-mono opacity-75">{id}</p>
      </div>
      <Badge variant="success" className="text-[9px]">Live</Badge>
    </div>
  );
}
