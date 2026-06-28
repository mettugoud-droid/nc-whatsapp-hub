"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const dailyMessages = [
  { date: "Mon", sent: 245, delivered: 230, failed: 15 },
  { date: "Tue", sent: 312, delivered: 298, failed: 14 },
  { date: "Wed", sent: 189, delivered: 180, failed: 9 },
  { date: "Thu", sent: 456, delivered: 440, failed: 16 },
  { date: "Fri", sent: 523, delivered: 510, failed: 13 },
  { date: "Sat", sent: 367, delivered: 355, failed: 12 },
  { date: "Sun", sent: 290, delivered: 278, failed: 12 },
];

const campaignPerformance = [
  { name: "Festival Offer", sent: 1200, conversions: 180, revenue: 45000 },
  { name: "COD Reminder", sent: 800, conversions: 320, revenue: 85000 },
  { name: "Reorder", sent: 560, conversions: 95, revenue: 28000 },
  { name: "Review", sent: 450, conversions: 125, revenue: 0 },
  { name: "Payment", sent: 350, conversions: 210, revenue: 62000 },
];

const deliveryBreakdown = [
  { name: "Delivered", value: 85, color: "#608748" },
  { name: "Read", value: 72, color: "#7aa35e" },
  { name: "Failed", value: 5, color: "#ef4444" },
  { name: "Pending", value: 10, color: "#DFAD35" },
];

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl border bg-card p-6 card-shadow"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
}

export function MessagesChart() {
  return (
    <ChartCard title="Daily Messages" description="Messages sent this week">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyMessages}>
            <defs>
              <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#608748" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#608748" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DFAD35" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#DFAD35" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
              }}
            />
            <Area
              type="monotone"
              dataKey="sent"
              stroke="#608748"
              fillOpacity={1}
              fill="url(#colorSent)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="delivered"
              stroke="#DFAD35"
              fillOpacity={1}
              fill="url(#colorDelivered)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function CampaignPerformanceChart() {
  return (
    <ChartCard
      title="Campaign Performance"
      description="Top campaigns by conversions"
    >
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={campaignPerformance}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
              }}
            />
            <Bar dataKey="conversions" fill="#608748" radius={[6, 6, 0, 0]} />
            <Bar dataKey="sent" fill="#DFAD35" radius={[6, 6, 0, 0]} opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function DeliveryPieChart() {
  return (
    <ChartCard title="Delivery Breakdown" description="Message status distribution">
      <div className="h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={deliveryBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {deliveryBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {deliveryBreakdown.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">
              {item.name} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
