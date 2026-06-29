"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";

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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tickets")
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

  const tickets: any[] = data?.tickets || [];
  const stats = data?.stats || {};

  const openTickets = tickets.filter((t: any) => t.status === "open").length;
  const inProgressTickets = tickets.filter((t: any) => t.status === "in_progress").length;
  const slaBreached = tickets.filter((t: any) => t.slaBreached).length;
  const avgResolutionTime = stats.avgResolutionTime || "—";

  const filteredTickets = tickets.filter(
    (t: any) =>
      (t.subject || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.customer || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.id || "").toLowerCase().includes(searchQuery.toLowerCase())
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
              </div>
              <p className="text-2xl font-bold mt-3">{openTickets}</p>
              <p className="text-sm text-muted-foreground">Total Open</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold mt-3">{inProgressTickets}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold mt-3 text-red-600">{slaBreached}</p>
              <p className="text-sm text-muted-foreground">SLA Breached</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Timer className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold mt-3">{avgResolutionTime}</p>
              <p className="text-sm text-muted-foreground">Avg Resolution Time</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Ticket List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Tickets</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search tickets..." className="pl-9 h-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="py-12 text-center">
                <Ticket className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">No tickets yet</h3>
                <p className="text-sm text-muted-foreground">
                  Support tickets will appear here when customers raise issues.
                </p>
              </div>
            ) : (
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
                    {filteredTickets.map((ticket: any, index: number) => (
                      <motion.tr
                        key={ticket.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="border-b last:border-b-0 hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <span className="text-sm font-mono font-semibold text-brand-primary">{ticket.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium max-w-[200px] truncate">{ticket.subject}</p>
                          <p className="text-xs text-muted-foreground">{ticket.createdAt}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${categoryColors[ticket.category] || "bg-gray-100 text-gray-800"}`}>
                            {ticket.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${priorityColors[ticket.priority] || ""}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-brand-primary/10 flex items-center justify-center">
                              <User className="h-3.5 w-3.5 text-brand-primary" />
                            </div>
                            <p className="text-sm">{ticket.customer}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-muted-foreground">{ticket.assignedTo}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColors[ticket.status] || ""}`}>
                            {statusLabels[ticket.status] || ticket.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`text-xs font-medium ${ticket.slaBreached ? "text-red-600 font-bold" : "text-muted-foreground"}`}>
                            {ticket.slaBreached && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                            {ticket.slaTime}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
