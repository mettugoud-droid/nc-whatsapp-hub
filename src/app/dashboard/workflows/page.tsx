"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Workflow,
  Play,
  Pause,
  Plus,
  ArrowRight,
  MessageSquare,
  Clock,
  CheckCircle2,
  Zap,
  GitBranch,
  Timer,
  BarChart3,
  ShoppingCart,
  Star,
  Send,
  Bell,
  UserCheck,
  Package,
} from "lucide-react";

// Sample workflow data
const workflows = [
  {
    id: "wf-1",
    name: "COD to Prepaid Conversion",
    description: "Automatically sends prepaid incentives to COD customers after order confirmation",
    active: true,
    executionCount: 1245,
    successRate: 57,
    lastRun: "2 min ago",
    trigger: "New COD Order",
    nodes: [
      { id: "n1", type: "trigger", label: "New COD Order", icon: ShoppingCart },
      { id: "n2", type: "delay", label: "Wait 30 min", icon: Clock },
      { id: "n3", type: "message", label: "Send Prepaid Offer (10% off)", icon: Send },
      { id: "n4", type: "condition", label: "Converted?", icon: GitBranch },
      { id: "n5", type: "action", label: "Update Order to Prepaid", icon: CheckCircle2 },
    ],
  },
  {
    id: "wf-2",
    name: "Post-Delivery Review Request",
    description: "Requests product reviews 2 days after successful delivery",
    active: true,
    executionCount: 890,
    successRate: 34,
    lastRun: "15 min ago",
    trigger: "Order Delivered",
    nodes: [
      { id: "n1", type: "trigger", label: "Order Delivered", icon: Package },
      { id: "n2", type: "delay", label: "Wait 2 days", icon: Clock },
      { id: "n3", type: "message", label: "Send Review Request", icon: MessageSquare },
      { id: "n4", type: "condition", label: "Reviewed?", icon: GitBranch },
      { id: "n5", type: "action", label: "Send Thank You + Coupon", icon: Star },
    ],
  },
  {
    id: "wf-3",
    name: "Abandoned Cart Recovery",
    description: "Sends reminder messages when customers abandon their shopping cart",
    active: true,
    executionCount: 2340,
    successRate: 23,
    lastRun: "5 min ago",
    trigger: "Cart Abandoned",
    nodes: [
      { id: "n1", type: "trigger", label: "Cart Abandoned (1hr)", icon: ShoppingCart },
      { id: "n2", type: "message", label: "Gentle Reminder", icon: Send },
      { id: "n3", type: "delay", label: "Wait 4 hours", icon: Clock },
      { id: "n4", type: "condition", label: "Purchased?", icon: GitBranch },
      { id: "n5", type: "message", label: "Send 5% Discount", icon: Zap },
    ],
  },
  {
    id: "wf-4",
    name: "New Customer Welcome",
    description: "Welcome sequence for first-time customers with product recommendations",
    active: false,
    executionCount: 567,
    successRate: 68,
    lastRun: "1 day ago",
    trigger: "New Customer",
    nodes: [
      { id: "n1", type: "trigger", label: "First Purchase", icon: UserCheck },
      { id: "n2", type: "message", label: "Welcome Message", icon: Send },
      { id: "n3", type: "delay", label: "Wait 1 day", icon: Clock },
      { id: "n4", type: "message", label: "Product Guide", icon: MessageSquare },
      { id: "n5", type: "action", label: "Add to Nurture List", icon: Star },
    ],
  },
  {
    id: "wf-5",
    name: "SLA Breach Alert",
    description: "Notifies team leads when tickets are about to breach SLA",
    active: true,
    executionCount: 156,
    successRate: 95,
    lastRun: "30 min ago",
    trigger: "SLA Warning",
    nodes: [
      { id: "n1", type: "trigger", label: "SLA < 30 min", icon: Timer },
      { id: "n2", type: "action", label: "Escalate to Lead", icon: Bell },
      { id: "n3", type: "condition", label: "Resolved?", icon: GitBranch },
      { id: "n4", type: "action", label: "Auto-reassign", icon: UserCheck },
    ],
  },
  {
    id: "wf-6",
    name: "Repeat Purchase Nudge",
    description: "Sends personalized reorder suggestions based on purchase history",
    active: false,
    executionCount: 432,
    successRate: 28,
    lastRun: "3 days ago",
    trigger: "30 Days Since Order",
    nodes: [
      { id: "n1", type: "trigger", label: "30 Days Since Last Order", icon: Clock },
      { id: "n2", type: "action", label: "Check Purchase History", icon: BarChart3 },
      { id: "n3", type: "message", label: "Personalized Reorder Msg", icon: Send },
      { id: "n4", type: "condition", label: "Ordered?", icon: GitBranch },
      { id: "n5", type: "message", label: "Special Offer", icon: Zap },
    ],
  },
];

const nodeTypeColors: Record<string, string> = {
  trigger: "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300",
  message: "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300",
  delay: "bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300",
  condition: "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300",
  action: "bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300",
};

export default function WorkflowsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredWorkflows = workflows.filter((wf) => {
    if (activeFilter === "active") return wf.active;
    if (activeFilter === "inactive") return !wf.active;
    return true;
  });

  const totalExecutions = workflows.reduce((acc, wf) => acc + wf.executionCount, 0);
  const activeWorkflows = workflows.filter((wf) => wf.active).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Automation</h1>
          <p className="text-muted-foreground">
            Automate customer journeys and repetitive tasks
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Workflow className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeWorkflows}/{workflows.length}</p>
                <p className="text-sm text-muted-foreground">Active Workflows</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalExecutions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Executions</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">42%</p>
                <p className="text-sm text-muted-foreground">Avg Success Rate</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        {(["all", "active", "inactive"] as const).map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter)}
            className="capitalize"
          >
            {filter === "all" ? "All Workflows" : filter}
          </Button>
        ))}
      </div>

      {/* Workflow Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredWorkflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className={`${!workflow.active ? "opacity-60" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{workflow.name}</CardTitle>
                      <Badge variant={workflow.active ? "success" : "outline"} className="text-[10px]">
                        {workflow.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {workflow.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${workflow.active ? "text-brand-primary" : "text-muted-foreground"}`}
                  >
                    {workflow.active ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Visual Flow */}
                <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-3 border-b">
                  {workflow.nodes.map((node, nodeIndex) => {
                    const NodeIcon = node.icon;
                    return (
                      <div key={node.id} className="flex items-center">
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium whitespace-nowrap ${
                            nodeTypeColors[node.type]
                          }`}
                        >
                          <NodeIcon className="h-3 w-3" />
                          {node.label}
                        </div>
                        {nodeIndex < workflow.nodes.length - 1 && (
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mx-1 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      <Zap className="h-3.5 w-3.5 inline mr-1" />
                      {workflow.executionCount.toLocaleString()} runs
                    </span>
                    <span className="text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 inline mr-1" />
                      {workflow.successRate}% success
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Last: {workflow.lastRun}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
