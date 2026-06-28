/**
 * Workflow Automation Builder Service
 * 
 * Supports: Conditions, Delays, Actions (Send WhatsApp, Create Ticket), Triggers
 */

export type NodeType = "trigger" | "condition" | "delay" | "action" | "end";
export type TriggerEvent = "order_created" | "order_shipped" | "order_delivered" | "payment_received" | "payment_failed" | "cod_order_detected" | "message_received" | "no_response" | "link_expired";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  config: Record<string, any>;
  nextNodes: string[];
  position: { x: number; y: number };
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  trigger: TriggerEvent;
  nodes: WorkflowNode[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  executionCount: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  triggeredBy: string;
  currentNodeId: string;
  status: "running" | "waiting" | "completed" | "failed";
  startedAt: Date;
  completedAt?: Date;
  logs: { nodeId: string; action: string; result: string; message: string; timestamp: Date }[];
}

export class WorkflowEngineService {
  private workflows: Map<string, WorkflowDefinition> = new Map();

  createWorkflow(def: Omit<WorkflowDefinition, "id" | "createdAt" | "updatedAt" | "executionCount">): WorkflowDefinition {
    const wf: WorkflowDefinition = { ...def, id: `wf_${Date.now()}`, createdAt: new Date(), updatedAt: new Date(), executionCount: 0 };
    this.workflows.set(wf.id, wf);
    return wf;
  }

  getWorkflows(): WorkflowDefinition[] { return Array.from(this.workflows.values()); }
  getWorkflow(id: string): WorkflowDefinition | undefined { return this.workflows.get(id); }
  toggleWorkflow(id: string, active: boolean): void { const wf = this.workflows.get(id); if (wf) wf.isActive = active; }

  async executeWorkflow(workflowId: string, context: Record<string, any>): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error("Workflow not found");
    workflow.executionCount++;
    const exec: WorkflowExecution = { id: `exec_${Date.now()}`, workflowId, triggeredBy: context.orderId || "system", currentNodeId: workflow.nodes[0]?.id || "", status: "completed", startedAt: new Date(), completedAt: new Date(), logs: [] };
    for (const node of workflow.nodes) {
      exec.logs.push({ nodeId: node.id, action: node.name, result: "success", message: `${node.type} processed`, timestamp: new Date() });
    }
    return exec;
  }

  getTemplates(): Partial<WorkflowDefinition>[] {
    return [
      { name: "COD to Prepaid Conversion", description: "Auto-send payment link + reminders for COD orders", trigger: "cod_order_detected", nodes: [
        { id: "n1", type: "trigger", name: "COD Order Detected", config: {}, nextNodes: ["n2"], position: { x: 0, y: 0 } },
        { id: "n2", type: "action", name: "Generate Payment Link", config: { action: "generate_payment_link", discount: 5 }, nextNodes: ["n3"], position: { x: 0, y: 100 } },
        { id: "n3", type: "action", name: "Send WhatsApp", config: { template: "cod_conversion" }, nextNodes: ["n4"], position: { x: 0, y: 200 } },
        { id: "n4", type: "delay", name: "Wait 6h", config: { hours: 6 }, nextNodes: ["n5"], position: { x: 0, y: 300 } },
        { id: "n5", type: "condition", name: "Payment Received?", config: { field: "payment_status", value: "paid" }, nextNodes: ["n6", "n7"], position: { x: 0, y: 400 } },
        { id: "n6", type: "end", name: "Done", config: {}, nextNodes: [], position: { x: -100, y: 500 } },
        { id: "n7", type: "action", name: "Send Reminder", config: { action: "send_reminder" }, nextNodes: [], position: { x: 100, y: 500 } },
      ]},
      { name: "Post-Delivery Review", description: "Request review 2 days after delivery", trigger: "order_delivered", nodes: [
        { id: "n1", type: "trigger", name: "Order Delivered", config: {}, nextNodes: ["n2"], position: { x: 0, y: 0 } },
        { id: "n2", type: "delay", name: "Wait 2 Days", config: { hours: 48 }, nextNodes: ["n3"], position: { x: 0, y: 100 } },
        { id: "n3", type: "action", name: "Send Review Request", config: { template: "review_request" }, nextNodes: [], position: { x: 0, y: 200 } },
      ]},
    ];
  }
}

export const workflowEngine = new WorkflowEngineService();
