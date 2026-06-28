"use client";

import { useState } from "react";
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
} from "lucide-react";

const campaigns = [
  {
    id: "1",
    name: "Festival Diwali Offer",
    status: "running",
    type: "BULK",
    template: "Festival Offers",
    totalRecipients: 1200,
    sent: 980,
    delivered: 950,
    failed: 30,
    pending: 220,
    conversions: 125,
    revenue: 45000,
    scheduledAt: "2024-10-20 10:00",
    startedAt: "2024-10-20 10:00",
  },
  {
    id: "2",
    name: "COD to Prepaid - Batch 12",
    status: "running",
    type: "COD_CONVERSION",
    template: "5% Discount Offer",
    totalRecipients: 350,
    sent: 350,
    delivered: 340,
    failed: 10,
    pending: 0,
    conversions: 89,
    revenue: 62000,
    scheduledAt: "2024-10-19 09:00",
    startedAt: "2024-10-19 09:00",
  },
  {
    id: "3",
    name: "Order Review Request",
    status: "completed",
    type: "BULK",
    template: "Review Request",
    totalRecipients: 450,
    sent: 450,
    delivered: 440,
    failed: 10,
    pending: 0,
    conversions: 125,
    revenue: 0,
    scheduledAt: "2024-10-18 14:00",
    startedAt: "2024-10-18 14:00",
  },
  {
    id: "4",
    name: "Reorder Reminder - Cashews",
    status: "scheduled",
    type: "AUTOMATED",
    template: "Reorder Reminder",
    totalRecipients: 280,
    sent: 0,
    delivered: 0,
    failed: 0,
    pending: 280,
    conversions: 0,
    revenue: 0,
    scheduledAt: "2024-10-22 11:00",
    startedAt: null,
  },
  {
    id: "5",
    name: "Payment Reminder Q4",
    status: "paused",
    type: "BULK",
    template: "Payment Reminder",
    totalRecipients: 150,
    sent: 75,
    delivered: 72,
    failed: 3,
    pending: 75,
    conversions: 45,
    revenue: 28000,
    scheduledAt: "2024-10-17 08:00",
    startedAt: "2024-10-17 08:00",
  },
];

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

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <p className="text-2xl font-bold">2</p>
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
              <p className="text-2xl font-bold">1</p>
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
              <p className="text-2xl font-bold">1</p>
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
              <p className="text-2xl font-bold">1</p>
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
        {filteredCampaigns.map((campaign, index) => (
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
                        {campaign.type.replace("_", " ")}
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
                        width: `${(campaign.sent / campaign.totalRecipients) * 100}%`,
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
                      {campaign.conversions > 0
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
