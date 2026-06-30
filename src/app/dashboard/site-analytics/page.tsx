"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, Eye, MousePointer, ShoppingCart, TrendingUp,
  Globe, Smartphone, Monitor, ArrowUpRight, ExternalLink,
  BarChart3, Target, Zap, Loader2, CheckCircle2,
} from "lucide-react";

// Marketing config (from Shopdeck credentials)
const ANALYTICS_CONFIG = {
  fbPixelId: "1293510849364763",
  fbPageId: "345163898686416",
  fbBusinessId: "1525471298394641",
  gaId: "395216985",
  ga4Id: "G-WGQRPCPYZK",
  ga4Secret: "RumvJj6JQdCYn6lVolsx5A",
  googleTagId: "AW-18171486303",
  merchantId: "5789684067",
  gtmCode: "GTM-KHVNXRKL",
};

export default function SiteAnalyticsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Save credentials to DB on first load
  useEffect(() => {
    fetch("/api/marketing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credentials: ANALYTICS_CONFIG }),
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Analytics</h1>
          <p className="text-muted-foreground">
            Live visitor data from Facebook Pixel & Google Analytics
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`https://analytics.google.com/analytics/web/#/p${ANALYTICS_CONFIG.ga4Id.replace("G-", "")}/reports`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3 w-3 mr-2" /> GA4 Dashboard
            </Button>
          </a>
          <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3 w-3 mr-2" /> FB Events Manager
            </Button>
          </a>
        </div>
      </div>

      {/* Connected Services */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">f</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Facebook Pixel</p>
                <p className="text-xs text-muted-foreground font-mono">{ANALYTICS_CONFIG.fbPixelId}</p>
              </div>
              <Badge variant="success" className="text-[10px]">Connected</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Google Analytics 4</p>
                <p className="text-xs text-muted-foreground font-mono">{ANALYTICS_CONFIG.ga4Id}</p>
              </div>
              <Badge variant="success" className="text-[10px]">Connected</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Google Ads</p>
                <p className="text-xs text-muted-foreground font-mono">{ANALYTICS_CONFIG.googleTagId}</p>
              </div>
              <Badge variant="success" className="text-[10px]">Connected</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tracking Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configured Tracking Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <EventCard icon={Eye} label="Page View" tag="GTM" id={ANALYTICS_CONFIG.gtmCode} color="bg-blue-100 text-blue-600" />
            <EventCard icon={ShoppingCart} label="Add to Cart" tag="GA4 + FB" id="A2C Event" color="bg-green-100 text-green-600" />
            <EventCard icon={MousePointer} label="View Item" tag="Google Ads" id={`Label: 4sEqCOXI77Ac...`} color="bg-purple-100 text-purple-600" />
            <EventCard icon={Zap} label="Purchase" tag="Google Ads" id={`Label: rEGlCN_I77Ac...`} color="bg-orange-100 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics Embed (GA4 Realtime) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Real-Time Analytics
            </CardTitle>
            <Badge variant="outline" className="text-xs">Requires GA4 Data API</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <RealtimeCard icon={Users} label="Active Users Now" value="—" note="Connect GA4 API" />
            <RealtimeCard icon={Eye} label="Page Views (Today)" value="—" note="Connect GA4 API" />
            <RealtimeCard icon={ShoppingCart} label="Add to Carts (Today)" value="—" note="Connect GA4 API" />
            <RealtimeCard icon={Zap} label="Purchases (Today)" value="—" note="Connect GA4 API" />
          </div>

          <div className="p-6 border-2 border-dashed rounded-xl text-center">
            <Globe className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">Live Visitor Dashboard</h3>
            <p className="text-sm text-muted-foreground mb-4">
              To see real-time visitor data here, enable the GA4 Data API.
              Your GA4 Measurement Protocol API secret is already configured.
            </p>
            <div className="flex justify-center gap-3">
              <a href="https://analytics.google.com/analytics/web/#/realtime" target="_blank" rel="noopener noreferrer">
                <Button size="sm"><ExternalLink className="h-3 w-3 mr-2" />View in GA4 (Real-time)</Button>
              </a>
              <a href="https://business.facebook.com/events_manager" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline"><ExternalLink className="h-3 w-3 mr-2" />FB Events Manager</Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Credentials Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Marketing Credentials (Stored)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <CredRow label="FB Pixel ID" value={ANALYTICS_CONFIG.fbPixelId} />
            <CredRow label="FB Page ID" value={ANALYTICS_CONFIG.fbPageId} />
            <CredRow label="FB Business Manager ID" value={ANALYTICS_CONFIG.fbBusinessId} />
            <CredRow label="Google Analytics ID" value={ANALYTICS_CONFIG.gaId} />
            <CredRow label="GA4 ID" value={ANALYTICS_CONFIG.ga4Id} />
            <CredRow label="Google Tag ID (Ads)" value={ANALYTICS_CONFIG.googleTagId} />
            <CredRow label="Google Merchant ID" value={ANALYTICS_CONFIG.merchantId} />
            <CredRow label="GTM Code" value={ANALYTICS_CONFIG.gtmCode} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EventCard({ icon: Icon, label, tag, id, color }: { icon: any; label: string; tag: string; id: string; color: string }) {
  return (
    <div className="p-3 rounded-lg border">
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-7 w-7 rounded-md flex items-center justify-center ${color}`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <Badge variant="outline" className="text-[9px]">{tag}</Badge>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground font-mono truncate">{id}</p>
    </div>
  );
}

function RealtimeCard({ icon: Icon, label, value, note }: { icon: any; label: string; value: string; note: string }) {
  return (
    <div className="text-center p-4 rounded-lg bg-accent/30">
      <Icon className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-[10px] text-muted-foreground mt-1">{note}</p>
    </div>
  );
}

function CredRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-accent/30">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-mono font-medium">{value}</span>
    </div>
  );
}
