"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  BarChart3,
  Calendar,
  TrendingUp,
} from "lucide-react";

// These are report TYPES (system-defined), not dynamic data
const reports = [
  {
    id: "1",
    name: "COD vs Prepaid Orders",
    description: "Comparison of COD and prepaid payment modes across all orders",
    lastGenerated: "Today, 10:30 AM",
    frequency: "Daily",
    type: "conversion",
  },
  {
    id: "2",
    name: "Prepaid Conversion Rate",
    description: "Weekly COD to prepaid conversion rate with trends",
    lastGenerated: "Today, 09:00 AM",
    frequency: "Weekly",
    type: "conversion",
  },
  {
    id: "3",
    name: "Revenue from Converted Orders",
    description: "Total revenue collected from COD-to-prepaid conversions",
    lastGenerated: "Yesterday, 11:00 PM",
    frequency: "Daily",
    type: "revenue",
  },
  {
    id: "4",
    name: "Campaign Performance Report",
    description: "Detailed performance metrics for all WhatsApp campaigns",
    lastGenerated: "Today, 08:00 AM",
    frequency: "Daily",
    type: "campaign",
  },
  {
    id: "5",
    name: "Discounts & Razorpay Collections",
    description: "Summary of discounts offered and payments collected via Razorpay",
    lastGenerated: "Today, 06:00 AM",
    frequency: "Daily",
    type: "revenue",
  },
  {
    id: "6",
    name: "Payment Failures & Expired Links",
    description: "Report of failed payments and expired payment links",
    lastGenerated: "Yesterday, 10:00 PM",
    frequency: "Daily",
    type: "payments",
  },
  {
    id: "7",
    name: "Campaign-wise Conversion Rate",
    description: "Conversion rates broken down by individual campaigns",
    lastGenerated: "Today, 07:00 AM",
    frequency: "Weekly",
    type: "campaign",
  },
  {
    id: "8",
    name: "ROI of COD Conversion Campaigns",
    description: "Return on investment analysis for COD conversion campaigns",
    lastGenerated: "This week",
    frequency: "Weekly",
    type: "revenue",
  },
  {
    id: "9",
    name: "Customer Lifetime Value",
    description: "CLV analysis with segmentation by purchase frequency",
    lastGenerated: "This month",
    frequency: "Monthly",
    type: "customers",
  },
  {
    id: "10",
    name: "Message Delivery Report",
    description: "Comprehensive delivery, read, and response rates for all messages",
    lastGenerated: "Today, 10:00 AM",
    frequency: "Daily",
    type: "messages",
  },
];

function getTypeBadge(type: string) {
  switch (type) {
    case "conversion":
      return <Badge variant="success">Conversion</Badge>;
    case "revenue":
      return <Badge variant="secondary">Revenue</Badge>;
    case "campaign":
      return <Badge variant="info">Campaign</Badge>;
    case "payments":
      return <Badge variant="warning">Payments</Badge>;
    case "customers":
      return <Badge variant="default">Customers</Badge>;
    case "messages":
      return <Badge variant="outline">Messages</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download business reports
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Custom Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-primary/10">
              <BarChart3 className="h-4 w-4 text-brand-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reports.length}</p>
              <p className="text-xs text-muted-foreground">Available Reports</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">7</p>
              <p className="text-xs text-muted-foreground">Generated Today</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-muted-foreground">Export Formats</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Download className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">CSV, Excel, PDF, PPT</p>
              <p className="text-xs text-muted-foreground">Export Options</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-primary" />
                  <h3 className="font-semibold text-sm">{report.name}</h3>
                </div>
                {getTypeBadge(report.type)}
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {report.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  <span>Last: {report.lastGenerated}</span>
                  <span className="mx-2">&bull;</span>
                  <span>{report.frequency}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    <Download className="h-3 w-3 mr-1" /> CSV
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    <Download className="h-3 w-3 mr-1" /> PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
