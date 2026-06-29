"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Users, Search, User, ShoppingCart, IndianRupee, TrendingUp,
  Star, AlertTriangle, Heart, Phone, Mail, MapPin, Clock,
  MessageSquare, Package, CreditCard, Loader2,
} from "lucide-react";

function getSegmentBadge(segment: string) {
  switch (segment) {
    case "vip": return <Badge className="bg-purple-100 text-purple-700 border-purple-200">VIP</Badge>;
    case "active": return <Badge variant="success">Active</Badge>;
    case "new": return <Badge variant="info">New</Badge>;
    case "at_risk": return <Badge variant="warning">At Risk</Badge>;
    case "lost": return <Badge variant="destructive">Lost</Badge>;
    default: return <Badge variant="outline">{segment}</Badge>;
  }
}

export default function CRMPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crm")
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

  const customers: any[] = data?.customers || [];
  const stats = data?.stats || {};

  const filtered = customers.filter((c: any) => {
    const matchesSearch = (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone || "").includes(searchQuery) || (c.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = segmentFilter === "all" || c.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  if (customers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer CRM</h1>
          <p className="text-muted-foreground">360-degree customer view with segmentation and predictions</p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-brand-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No customers yet</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Upload your orders to automatically build customer profiles with segmentation, LTV predictions, and engagement scores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer CRM</h1>
          <p className="text-muted-foreground">360-degree customer view with segmentation and predictions</p>
        </div>
      </div>

      {/* Segment Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard title="New" value={stats.newCount?.toString() || "0"} icon={User} iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30" delay={0} />
        <StatCard title="Active" value={stats.activeCount?.toString() || "0"} icon={TrendingUp} iconColor="bg-green-100 text-green-600 dark:bg-green-900/30" delay={0.1} />
        <StatCard title="VIP" value={stats.vipCount?.toString() || "0"} icon={Star} iconColor="bg-purple-100 text-purple-600 dark:bg-purple-900/30" delay={0.2} />
        <StatCard title="At Risk" value={stats.atRiskCount?.toString() || "0"} icon={AlertTriangle} iconColor="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30" delay={0.3} />
        <StatCard title="Lost" value={stats.lostCount?.toString() || "0"} icon={Heart} iconColor="bg-red-100 text-red-600 dark:bg-red-900/30" delay={0.4} />
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-accent/50">
          {["all", "vip", "active", "new", "at_risk", "lost"].map((seg) => (
            <button key={seg} onClick={() => setSegmentFilter(seg)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${segmentFilter === seg ? "bg-brand-primary text-white" : "text-muted-foreground hover:text-foreground"}`}>
              {seg === "all" ? "All" : seg.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer List */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b bg-accent/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Segment</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Orders</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Spend</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">LTV</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Engagement</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map((c: any) => (
                      <tr key={c.id} onClick={() => setSelectedCustomer(c)}
                        className={`border-b cursor-pointer transition-colors ${selectedCustomer?.id === c.id ? "bg-brand-primary/5" : "hover:bg-accent/20"}`}>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.city} • {c.lastPurchase}</p>
                        </td>
                        <td className="px-4 py-3 text-center">{getSegmentBadge(c.segment)}</td>
                        <td className="px-4 py-3 text-sm text-right">{c.orders}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium">₹{((c.spend || 0)/1000).toFixed(1)}K</td>
                        <td className="px-4 py-3 text-sm text-right text-brand-primary font-bold">₹{((c.ltv || 0)/1000).toFixed(0)}K</td>
                        <td className="px-4 py-3 text-center">
                          <div className="w-full h-2 bg-accent rounded-full overflow-hidden inline-block max-w-[60px]">
                            <div className="h-full bg-brand-primary rounded-full" style={{ width: `${c.engagement || 0}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Detail Panel */}
        <Card className="h-fit sticky top-20">
          <CardHeader><CardTitle className="text-base">Customer Profile</CardTitle></CardHeader>
          <CardContent>
            {selectedCustomer ? (
              <div className="space-y-4">
                <div className="text-center pb-4 border-b">
                  <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold text-white">{selectedCustomer.name.split(" ").map((n: string)=>n[0]).join("")}</span>
                  </div>
                  <p className="font-semibold">{selectedCustomer.name}</p>
                  <div className="mt-1">{getSegmentBadge(selectedCustomer.segment)}</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" />{selectedCustomer.phone}</div>
                  <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" />{selectedCustomer.email}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-muted-foreground" />{selectedCustomer.city}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div className="p-2 rounded-lg bg-accent/50 text-center">
                    <p className="text-lg font-bold">{selectedCustomer.orders}</p><p className="text-[10px] text-muted-foreground">Orders</p>
                  </div>
                  <div className="p-2 rounded-lg bg-accent/50 text-center">
                    <p className="text-lg font-bold">₹{selectedCustomer.aov || 0}</p><p className="text-[10px] text-muted-foreground">AOV</p>
                  </div>
                  <div className="p-2 rounded-lg bg-accent/50 text-center">
                    <p className="text-lg font-bold text-green-600">{selectedCustomer.prepaidPct || 0}%</p><p className="text-[10px] text-muted-foreground">Prepaid</p>
                  </div>
                  <div className="p-2 rounded-lg bg-accent/50 text-center">
                    <p className="text-lg font-bold text-yellow-600">{selectedCustomer.codPct || 0}%</p><p className="text-[10px] text-muted-foreground">COD</p>
                  </div>
                </div>
                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">RTO Count</span><span className="font-medium">{selectedCustomer.rto || 0}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Conversion Likelihood</span><span className="font-medium text-brand-primary">{selectedCustomer.conversionLikelihood || 0}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Lifetime Value</span><span className="font-bold">₹{(selectedCustomer.ltv || 0).toLocaleString()}</span></div>
                </div>
                <div className="flex gap-2 pt-3">
                  <Button size="sm" className="flex-1 text-xs"><MessageSquare className="h-3 w-3 mr-1" /> Message</Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs"><Package className="h-3 w-3 mr-1" /> Orders</Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Select a customer to view details</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
