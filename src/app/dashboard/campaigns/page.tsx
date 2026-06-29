"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Search,
  Play,
  Pause,
  BarChart3,
  Calendar,
  Users,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";

function getStatusBadge(status: string) {
  switch (status) {
    case "running":
      return <Badge variant="success">Running</Badge>;
    case "completed":
      return <Badge variant="default">Completed</Badge>;
    case "scheduled":
      return <Badge variant="info">Scheduled</Badge>;
    case "paused":
      return <Badge variant="warning">Paused</Badge>;
    case "draft":
      return <Badge variant="outline">Draft</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/campaigns")
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

  const campaigns: any[] = data?.campaigns || [];

  if (campaigns.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground">
              Manage and monitor your WhatsApp campaigns
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4">
            <Send className="h-8 w-8 text-brand-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Create your first campaign to start engaging customers via WhatsApp. Set up templates, select audiences, and track performance.
          </p>
          <Button className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create First Campaign
          </Button>
        </div>
      </div>
    );
  }

  const filteredCampaigns = campaigns.filter((c: any) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const runningCount = campaigns.filter((c: any) => c.status === "running").length;
  const scheduledCount = campaigns.filter((c: any) => c.status === "scheduled").length;
  const completedCount = campaigns.filter((c: any) => c.status === "completed").length;
  const pausedCount = campaigns.filter((c: any) => c.status === "paused").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and monitor your WhatsApp campaigns
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Campaign Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Play className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{runningCount}</p>
              <p className="text-xs text-muted-foreground">Running</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{scheduledCount}</p>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-primary/10">
              <CheckCircle2 className="h-4 w-4 text-brand-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Pause className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pausedCount}</p>
              <p className="text-xs text-muted-foreground">Paused</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign: any, index: number) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      {getStatusBadge(campaign.status)}
                      <Badge variant="outline" className="text-xs">
                        {(campaign.type || "").replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Template: {campaign.template} &bull; Scheduled:{" "}
                      {campaign.scheduledAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {campaign.status === "running" && (
                      <Button variant="outline" size="sm">
                        <Pause className="h-3 w-3 mr-1" /> Pause
                      </Button>
                    )}
                    {campaign.status === "paused" && (
                      <Button variant="outline" size="sm">
                        <Play className="h-3 w-3 mr-1" /> Resume
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="h-3 w-3 mr-1" /> Details
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Progress</span>
                    <span>
                      {campaign.sent}/{campaign.totalRecipients} sent
                    </span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full transition-all"
                      style={{
                        width: `${campaign.totalRecipients > 0 ? (campaign.sent / campaign.totalRecipients) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm font-bold">{campaign.totalRecipients}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Recipients</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Send className="h-3 w-3 text-blue-500" />
                      <p className="text-sm font-bold">{campaign.sent}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Sent</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <p className="text-sm font-bold">{campaign.delivered}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Delivered</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <XCircle className="h-3 w-3 text-red-500" />
                      <p className="text-sm font-bold">{campaign.failed}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3 text-yellow-500" />
                      <p className="text-sm font-bold">{campaign.pending}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-brand-primary">
                      {campaign.conversions > 0 && campaign.delivered > 0
                        ? `${((campaign.conversions / campaign.delivered) * 100).toFixed(1)}%`
                        : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">Conversion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
