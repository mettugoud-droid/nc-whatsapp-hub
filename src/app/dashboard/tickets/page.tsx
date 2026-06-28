"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Ticket,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Timer,
  User,
  Tag,
} from "lucide-react";

// Sample ticket data
const tickets = [
  {
    id: "TKT-001",
    subject: "Order not delivered after 5 days",
    category: "Delivery",
    priority: "high",
    customer: "Deepika Nair",
    customerPhone: "+91 98765 43210",
    assignedTo: "Vikram Singh",
    status: "open" as const,
    slaTime: "2h 15m remaining",
    slaBreached: false,
    createdAt: "Today, 9:30 AM",
  },
  {
    id: "TKT-002",
    subject: "Wrong product received - Need replacement",
    category: "Product Issue",
    priority: "high",
    customer: "Rahul Sharma",
    customerPhone: "+91 87654 32109",
    assignedTo: "Kavya Menon",
    status: "in_progress" as const,
    slaTime: "45m remaining",
    slaBreached: false,
    createdAt: "Today, 8:15 AM",
  },
  {
    id: "TKT-003",
    subject: "Refund not processed for cancelled order",
    category: "Refund",
    priority: "medium",
    customer: "Neha Singh",
    customerPhone: "+91 76543 21098",
    assignedTo: "Anita Reddy",
    status: "in_progress" as const,
    slaTime: "4h 30m remaining",
    slaBreached: false,
    createdAt: "Yesterday, 4:45 PM",
  },
  {
    id: "TKT-004",
    subject: "COD payment not collected by delivery agent",
    category: "Payment",
    priority: "high",
    customer: "Amit Patel",
    customerPhone: "+91 65432 10987",
    assignedTo: "Suresh Patel",
    status: "open" as const,
    slaTime: "SLA Breached",
    slaBreached: true,
    createdAt: "Yesterday, 2:30 PM",
  },
  {
    id: "TKT-005",
    subject: "Bulk order pricing inquiry",
    category: "Sales",
    priority: "low",
    customer: "Priya Gupta",
    customerPhone: "+91 54321 09876",
    assignedTo: "Amit Kumar",
    status: "open" as const,
    slaTime: "8h remaining",
    slaBreached: false,
    createdAt: "Yesterday, 11:00 AM",
  },
  {
    id: "TKT-006",
    subject: "Product quality complaint - Stale cashews",
    category: "Product Issue",
    priority: "high",
    customer: "Vikram Reddy",
    customerPhone: "+91 43210 98765",
    assignedTo: "Vikram Singh",
    status: "in_progress" as const,
    slaTime: "SLA Breached",
    slaBreached: true,
    createdAt: "2 days ago",
  },
  {
    id: "TKT-007",
    subject: "Update delivery address for upcoming order",
    category: "Order Modification",
    priority: "low",
    customer: "Sanjay Mehta",
    customerPhone: "+91 32109 87654",
    assignedTo: "Kavya Menon",
    status: "resolved" as const,
    slaTime: "Resolved in 1h 20m",
    slaBreached: false,
    createdAt: "2 days ago",
  },
  {
    id: "TKT-008",
    subject: "Subscription cancellation request",
    category: "Account",
    priority: "medium",
    customer: "Meera Joshi",
    customerPhone: "+91 21098 76543",
    assignedTo: "Neha Gupta",
    status: "closed" as const,
    slaTime: "Resolved in 3h 45m",
    slaBreached: false,
    createdAt: "3 days ago",
  },
];

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  resolved: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const categoryColors: Record<string, string> = {
  Delivery: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "Product Issue": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Refund: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Payment: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  Sales: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "Order Modification": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  Account: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
};

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter((t) => t.status === "in_progress").length;
  const slaBreached = tickets.filter((t) => t.slaBreached).length;
  const avgResolutionTime = "2h 35m";

  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ticket Management</h1>
          <p className="text-muted-foreground">
            Track and resolve customer support tickets
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> New Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+3</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{openTickets}</p>
              <p className="text-sm text-muted-foreground">Total Open</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{inProgressTickets}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3 text-red-600">{slaBreached}</p>
              <p className="text-sm text-muted-foreground">SLA Breached</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Timer className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{avgResolutionTime}</p>
              <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Ticket List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Tickets</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    className="pl-9 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ticket</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subject</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Assigned To</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket, index) => (
                    <motion.tr
                      key={ticket.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="border-b last:border-b-0 hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <span className="text-sm font-mono font-semibold text-brand-primary">
                          {ticket.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-medium max-w-[200px] truncate">
                          {ticket.subject}
                        </p>
                        <p className="text-xs text-muted-foreground">{ticket.createdAt}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            categoryColors[ticket.category] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {ticket.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${
                            priorityColors[ticket.priority]
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-brand-primary/10 flex items-center justify-center">
                            <User className="h-3.5 w-3.5 text-brand-primary" />
                          </div>
                          <div>
                            <p className="text-sm">{ticket.customer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-muted-foreground">{ticket.assignedTo}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            statusColors[ticket.status]
                          }`}
                        >
                          {statusLabels[ticket.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`text-xs font-medium ${
                            ticket.slaBreached ? "text-red-600 font-bold" : "text-muted-foreground"
                          }`}
                        >
                          {ticket.slaBreached && (
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                          )}
                          {ticket.slaTime}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
