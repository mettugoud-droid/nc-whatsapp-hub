"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Users, Search, User, ShoppingCart, IndianRupee, TrendingUp,
  Star, AlertTriangle, Heart, Phone, Mail, MapPin, Clock,
  MessageSquare, Package, CreditCard,
} from "lucide-react";

const customers = [
  { id: "1", name: "Deepika Nair", phone: "+91 21098 76543", email: "deepika@gmail.com", city: "Mumbai", segment: "vip", orders: 22, spend: 45000, aov: 2045, codPct: 18, prepaidPct: 82, rto: 0, ltv: 78000, lastPurchase: "3 days ago", engagement: 95, conversionLikelihood: 92 },
  { id: "2", name: "Rahul Sharma", phone: "+91 98765 43210", email: "rahul@gmail.com", city: "Delhi", segment: "active", orders: 12, spend: 28000, aov: 2333, codPct: 50, prepaidPct: 50, rto: 1, ltv: 45000, lastPurchase: "12 days ago", engagement: 78, conversionLikelihood: 68 },
  { id: "3", name: "Neha Singh", phone: "+91 65432 10987", email: "neha.s@outlook.com", city: "Bangalore", segment: "vip", orders: 15, spend: 38000, aov: 2533, codPct: 25, prepaidPct: 75, rto: 0, ltv: 62000, lastPurchase: "5 days ago", engagement: 88, conversionLikelihood: 85 },
  { id: "4", name: "Amit Patel", phone: "+91 76543 21098", email: "amit.p@gmail.com", city: "Ahmedabad", segment: "active", orders: 8, spend: 15000, aov: 1875, codPct: 75, prepaidPct: 25, rto: 2, ltv: 28000, lastPurchase: "25 days ago", engagement: 55, conversionLikelihood: 45 },
  { id: "5", name: "Priya Gupta", phone: "+91 87654 32109", email: "priya@yahoo.com", city: "Hyderabad", segment: "new", orders: 2, spend: 3500, aov: 1750, codPct: 100, prepaidPct: 0, rto: 0, ltv: 8000, lastPurchase: "8 days ago", engagement: 42, conversionLikelihood: 55 },
  { id: "6", name: "Vikram Reddy", phone: "+91 54321 09876", email: "vikram@gmail.com", city: "Chennai", segment: "at_risk", orders: 5, spend: 12000, aov: 2400, codPct: 60, prepaidPct: 40, rto: 1, ltv: 22000, lastPurchase: "75 days ago", engagement: 28, conversionLikelihood: 35 },
  { id: "7", name: "Suresh Kumar", phone: "+91 32109 87654", email: "suresh.k@yahoo.com", city: "Pune", segment: "lost", orders: 1, spend: 1200, aov: 1200, codPct: 100, prepaidPct: 0, rto: 1, ltv: 3500, lastPurchase: "145 days ago", engagement: 8, conversionLikelihood: 15 },
];

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
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [segmentFilter, setSegmentFilter] = useState<string>("all");

  const filtered = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = segmentFilter === "all" || c.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

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
        <StatCard title="New" value="45" icon={User} iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30" delay={0} />
        <StatCard title="Active" value="312" icon={TrendingUp} iconColor="bg-green-100 text-green-600 dark:bg-green-900/30" delay={0.1} />
        <StatCard title="VIP" value="89" icon={Star} iconColor="bg-purple-100 text-purple-600 dark:bg-purple-900/30" delay={0.2} />
        <StatCard title="At Risk" value="56" icon={AlertTriangle} iconColor="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30" delay={0.3} />
        <StatCard title="Lost" value="128" icon={Heart} iconColor="bg-red-100 text-red-600 dark:bg-red-900/30" delay={0.4} />
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
                    {filtered.map((c) => (
                      <tr key={c.id} onClick={() => setSelectedCustomer(c)}
                        className={`border-b cursor-pointer transition-colors ${selectedCustomer?.id === c.id ? "bg-brand-primary/5" : "hover:bg-accent/20"}`}>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.city} • {c.lastPurchase}</p>
                        </td>
                        <td className="px-4 py-3 text-center">{getSegmentBadge(c.segment)}</td>
                        <td className="px-4 py-3 text-sm text-right">{c.orders}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium">₹{(c.spend/1000).toFixed(1)}K</td>
                        <td className="px-4 py-3 text-sm text-right text-brand-primary font-bold">₹{(c.ltv/1000).toFixed(0)}K</td>
                        <td className="px-4 py-3 text-center">
                          <div className="w-full h-2 bg-accent rounded-full overflow-hidden inline-block max-w-[60px]">
                            <div className="h-full bg-brand-primary rounded-full" style={{ width: `${c.engagement}%` }} />
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
                    <span className="text-lg font-bold text-white">{selectedCustomer.name.split(" ").map(n=>n[0]).join("")}</span>
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
                    <p className="text-lg font-bold">₹{selectedCustomer.aov}</p><p className="text-[10px] text-muted-foreground">AOV</p>
                  </div>
                  <div className="p-2 rounded-lg bg-accent/50 text-center">
                    <p className="text-lg font-bold text-green-600">{selectedCustomer.prepaidPct}%</p><p className="text-[10px] text-muted-foreground">Prepaid</p>
                  </div>
                  <div className="p-2 rounded-lg bg-accent/50 text-center">
                    <p className="text-lg font-bold text-yellow-600">{selectedCustomer.codPct}%</p><p className="text-[10px] text-muted-foreground">COD</p>
                  </div>
                </div>
                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">RTO Count</span><span className="font-medium">{selectedCustomer.rto}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Conversion Likelihood</span><span className="font-medium text-brand-primary">{selectedCustomer.conversionLikelihood}%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Lifetime Value</span><span className="font-bold">₹{selectedCustomer.ltv.toLocaleString()}</span></div>
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
