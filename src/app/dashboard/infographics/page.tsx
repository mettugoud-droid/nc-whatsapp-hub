"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Image,
  Download,
  Plus,
  Eye,
  Palette,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

// These are infographic TYPES (system templates), not dynamic data
const infographicTemplates = [
  {
    id: "1",
    name: "Campaign Summary",
    description: "Overview of campaign metrics with delivery and conversion rates",
    icon: BarChart3,
    color: "bg-brand-primary/10 text-brand-primary",
    metrics: ["Delivery Rate", "Conversion %", "Revenue", "Top Template"],
  },
  {
    id: "2",
    name: "Customer Response Funnel",
    description: "Funnel visualization from sent to conversion",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    metrics: ["Sent", "Delivered", "Read", "Responded", "Converted"],
  },
  {
    id: "3",
    name: "WhatsApp Campaign Funnel",
    description: "Complete campaign funnel with drop-off analysis",
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-600",
    metrics: ["Recipients", "Sent", "Delivered", "Opened", "Clicked", "Converted"],
  },
  {
    id: "4",
    name: "Revenue Breakdown",
    description: "Revenue distribution by product, campaign, and payment method",
    icon: PieChart,
    color: "bg-emerald-100 text-emerald-600",
    metrics: ["Total Revenue", "By Product", "By Campaign", "By Payment Mode"],
  },
  {
    id: "5",
    name: "Best Sending Time",
    description: "Heatmap of optimal message delivery times",
    icon: Zap,
    color: "bg-yellow-100 text-yellow-600",
    metrics: ["Best Hour", "Best Day", "Open Rate by Time", "Response Rate"],
  },
  {
    id: "6",
    name: "COD Conversion Report",
    description: "Visual report of COD to prepaid conversion performance",
    icon: BarChart3,
    color: "bg-orange-100 text-orange-600",
    metrics: ["Conversion Rate", "Revenue Saved", "Discount Given", "ROI"],
  },
];

const recentInfographics = [
  { id: "1", name: "October Campaign Summary", template: "Campaign Summary", createdAt: "2024-10-20", format: "PNG" },
  { id: "2", name: "Q3 Revenue Breakdown", template: "Revenue Breakdown", createdAt: "2024-10-01", format: "PDF" },
  { id: "3", name: "September Funnel", template: "WhatsApp Campaign Funnel", createdAt: "2024-09-30", format: "SVG" },
];

export default function InfographicsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Infographic Builder
          </h1>
          <p className="text-muted-foreground">
            Generate downloadable marketing assets and visual reports
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Infographic
        </Button>
      </div>

      {/* Export Formats */}
      <div className="flex gap-2">
        <Badge variant="outline" className="px-3 py-1">
          <Image className="h-3 w-3 mr-1" /> PNG
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          <Image className="h-3 w-3 mr-1" /> SVG
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          <Image className="h-3 w-3 mr-1" /> PDF
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          <Image className="h-3 w-3 mr-1" /> PowerPoint
        </Badge>
      </div>

      {/* Templates */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Infographic Templates</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {infographicTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2.5 rounded-lg ${template.color}`}>
                      <template.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{template.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      Included Metrics:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.metrics.map((metric) => (
                        <span
                          key={metric}
                          className="text-[10px] px-1.5 py-0.5 bg-accent rounded"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" className="flex-1 text-xs">
                      <Palette className="h-3 w-3 mr-1" /> Generate
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preview Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-4">
                <Image className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Select a Template to Preview
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose from the templates above to generate a visual infographic
                with your latest campaign data
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" /> Download PNG
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" /> Download PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Infographics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recently Generated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInfographics.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <Image className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.template} &bull; {item.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {item.format}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
