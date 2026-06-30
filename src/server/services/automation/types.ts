/**
 * WhatsApp Automation Engine - Type Definitions
 * 
 * Event-driven, queue-based architecture for all 15 automation modules.
 */

// ==================== EVENTS ====================

export type AutomationTrigger =
  | "buy_now_drop"        // Module 1: Customer clicked Buy Now, no order in 15min
  | "cart_abandoned"      // Module 2: Added to cart, no checkout in 30min
  | "cod_order_created"   // Module 3: New COD order placed
  | "prepaid_offer"       // Module 4: COD order → send prepaid link
  | "order_confirmed"     // Module 5: Order accepted
  | "order_packed"        // Module 5: Packing done
  | "order_shipped"       // Module 5: Dispatched
  | "order_out_for_delivery" // Module 5/7: OFD
  | "order_delivered"     // Module 5: Delivered
  | "ndr_raised"          // Module 6: NDR from courier
  | "delivery_followup"   // Module 8: 24hr post delivery
  | "repeat_purchase"     // Module 9: Product-specific reorder
  | "upsell"              // Module 10: Post-delivery recommendations
  | "customer_message"    // Module 11: Inbound customer message
  | "payment_received"    // Module 4: Razorpay payment successful
  | "payment_link_expired" // Module 4: Link expired
  | "customer_replied_yes" // Module 3/6: Button reply YES
  | "customer_replied_no"  // Module 3/6: Button reply NO
  | "no_response";        // Module 3/6: No response timeout

export type WorkflowStatus = "active" | "paused" | "completed" | "cancelled" | "failed";
export type MessageStatus = "scheduled" | "queued" | "sent" | "delivered" | "read" | "failed" | "cancelled";
export type StepType = "message" | "delay" | "condition" | "action" | "stop";

// ==================== AUTOMATION EVENT ====================

export interface AutomationEvent {
  id: string;
  trigger: AutomationTrigger;
  customerId: string;
  customerPhone: string;
  customerName: string;
  orderId?: string;
  productId?: string;
  productName?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  processedAt?: Date;
  status: "pending" | "processing" | "processed" | "failed";
}

// ==================== WORKFLOW INSTANCE ====================

export interface WorkflowInstance {
  id: string;
  workflowType: AutomationTrigger;
  customerId: string;
  customerPhone: string;
  orderId?: string;
  status: WorkflowStatus;
  currentStep: number;
  totalSteps: number;
  startedAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  metadata: Record<string, any>;
}

// ==================== WORKFLOW STEP ====================

export interface WorkflowStep {
  stepNumber: number;
  type: StepType;
  delayMinutes?: number;     // For delay steps
  messageTemplate?: string;  // For message steps
  messageVariables?: Record<string, string>;
  condition?: {              // For condition steps
    field: string;
    operator: "equals" | "not_equals" | "exists" | "not_exists";
    value?: string;
  };
  action?: {                 // For action steps
    type: "cancel_order" | "create_reattempt" | "update_status" | "assign_task" | "generate_payment_link" | "stop_workflow";
    params?: Record<string, any>;
  };
}

// ==================== SCHEDULED MESSAGE ====================

export interface ScheduledMessage {
  id: string;
  workflowInstanceId: string;
  customerPhone: string;
  customerName: string;
  content: string;
  scheduledAt: Date;
  sentAt?: Date;
  status: MessageStatus;
  retryCount: number;
  maxRetries: number;
  metadata: Record<string, any>;
}

// ==================== AUTOMATION RULES ====================

export interface AutomationRules {
  quietHoursStart: number;  // e.g., 21 (9 PM)
  quietHoursEnd: number;    // e.g., 9 (9 AM)
  maxMessagesPerDay: number;
  deduplicationWindowMinutes: number;
  rateLimitPerSecond: number;
  blacklistedPhones: string[];
  whitelistedPhones: string[];  // VIP - bypass quiet hours
  globalPaused: boolean;
}

// ==================== PRODUCT REORDER CONFIG ====================

export interface ReorderConfig {
  productName: string;
  productKeywords: string[];
  reorderDays: number;
  message: string;
}

// ==================== NDR EVENT ====================

export interface NDREvent {
  orderId: string;
  awb: string;
  reason: string;
  attemptNumber: number;
  courierPartner: string;
  customerPhone: string;
  customerName: string;
  timestamp: Date;
}

// ==================== RECOVERY METRICS ====================

export interface RecoveryMetrics {
  buyNowDrops: number;
  buyNowRecovered: number;
  buyNowRecoveryRate: number;
  cartAbandoned: number;
  cartRecovered: number;
  cartRecoveryRate: number;
  codOrders: number;
  codConfirmed: number;
  codConfirmationRate: number;
  prepaidConverted: number;
  prepaidConversionRate: number;
  ndrRaised: number;
  ndrRecovered: number;
  ndrRecoveryRate: number;
  rtoCount: number;
  rtoRate: number;
  revenueRecovered: number;
  whatsappSent: number;
  whatsappDelivered: number;
  whatsappRead: number;
  whatsappReplied: number;
  responseRate: number;
}
