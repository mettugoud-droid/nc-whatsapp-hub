"use client";

import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  id: string;
  type: "positive" | "negative" | "info" | "warning";
  message: string;
  metric?: string;
}

const insights: Insight[] = [
  {
    id: "1",
    type: "positive",
    message: "Payment reminder increased prepaid orders by 18%",
    metric: "+18%",
  },
  {
    id: "2",
    type: "negative",
    message: "COD conversion dropped by 12% this week",
    metric: "-12%",
  },
  {
    id: "3",
    type: "positive",
    message: "Review campaign generated 125 new reviews",
    metric: "125",
  },
  {
    id: "4",
    type: "info",
    message: "Customers purchasing Almonds are 2.3x more likely to reorder Cashews",
    metric: "2.3x",
  },
  {
    id: "5",
    type: "positive",
    message: "Best sending time identified: 10 AM - 12 PM (42% higher open rate)",
    metric: "+42%",
  },
  {
    id: "6",
    type: "warning",
    message: "15 payment links expiring in the next 6 hours",
    metric: "15",
  },
];

export function SmartInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-xl border bg-card p-6 card-shadow"
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-brand-secondary" />
        <h3 className="text-lg font-semibold">AI Smart Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border",
              insight.type === "positive" && "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800",
              insight.type === "negative" && "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800",
              insight.type === "info" && "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
              insight.type === "warning" && "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
            )}
          >
            <div className="mt-0.5">
              {insight.type === "positive" && (
                <TrendingUp className="h-4 w-4 text-green-600" />
              )}
              {insight.type === "negative" && (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              {insight.type === "info" && (
                <Lightbulb className="h-4 w-4 text-blue-500" />
              )}
              {insight.type === "warning" && (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm">{insight.message}</p>
            </div>
            {insight.metric && (
              <span
                className={cn(
                  "text-sm font-bold",
                  insight.type === "positive" && "text-green-600",
                  insight.type === "negative" && "text-red-500",
                  insight.type === "info" && "text-blue-600",
                  insight.type === "warning" && "text-yellow-600"
                )}
              >
                {insight.metric}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
