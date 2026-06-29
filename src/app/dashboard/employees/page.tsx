"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MessageSquare,
  ShoppingCart,
  Clock,
  TrendingUp,
  Search,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Headphones,
  Target,
  BarChart3,
  Loader2,
} from "lucide-react";

const roleColors: Record<string, string> = {
  Admin: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Sales: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Marketing: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  Support: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Operations: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
};

const statusIndicator: Record<string, string> = {
  online: "bg-green-500",
  busy: "bg-yellow-500",
  offline: "bg-gray-400",
};

export default function EmployeesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employees")
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

  const employees: any[] = data?.employees || [];
  const stats = data?.stats || {};

  const totalConversations = employees.reduce((acc: number, e: any) => acc + (e.conversationsHandled || 0), 0);
  const totalOrders = employees.reduce((acc: number, e: any) => acc + (e.ordersHandled || 0), 0);
  const totalCODConversions = employees.reduce((acc: number, e: any) => acc + (e.codConversions || 0), 0);
  const avgResponseTime = employees.length > 0
    ? (employees.reduce((acc: number, e: any) => acc + parseFloat(e.avgResponseTime || "0"), 0) / employees.length).toFixed(1)
    : "0";

  if (employees.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
            <p className="text-muted-foreground">Monitor team performance and productivity</p>
          </div>
          <Button><Users className="h-4 w-4 mr-2" /> Add Employee</Button>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-brand-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No employees added yet</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Add team members to track their performance, active chats, and COD conversions.
          </p>
          <Button className="mt-4"><Users className="h-4 w-4 mr-2" /> Add First Employee</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor team performance and productivity
          </p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" /> Add Employee
        </Button>
      </div>

      {/* Performance Grid Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{totalConversations.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Assigned Conversations</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{totalOrders.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Orders Handled</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{totalCODConversions}</p>
              <p className="text-sm text-muted-foreground">COD Conversions</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-3">{avgResponseTime} min</p>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Employee List Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search employees..." className="pl-9 h-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Performance</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Active Chats</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Conversions Today</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Avg Response</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee: any, index: number) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="border-b last:border-b-0 hover:bg-accent/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-9 w-9 rounded-full bg-brand-primary/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-brand-primary">
                                {employee.avatar || employee.name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                              </span>
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${statusIndicator[employee.status] || "bg-gray-400"}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{employee.name}</p>
                            <p className="text-xs text-muted-foreground">{employee.conversationsHandled || 0} conversations</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleColors[employee.role] || "bg-gray-100 text-gray-800"}`}>
                          {employee.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-accent overflow-hidden">
                            <div className="h-full rounded-full bg-brand-primary transition-all" style={{ width: `${employee.performanceScore || 0}%` }} />
                          </div>
                          <span className="text-sm font-semibold">{employee.performanceScore || 0}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm font-medium">{employee.activeChats || 0}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm font-bold text-brand-primary">{employee.conversionsToday || 0}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm">{employee.avgResponseTime || "—"}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${statusIndicator[employee.status] || "bg-gray-400"}`} />
                          <span className="text-xs capitalize text-muted-foreground">{employee.status || "offline"}</span>
                        </div>
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
