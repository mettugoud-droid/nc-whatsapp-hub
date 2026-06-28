/**
 * Ticket Management Service
 * 
 * Auto-creates tickets for:
 * - Damaged product reports
 * - Payment issues
 * - Delivery delays
 * - Return/Refund requests
 * - Wrong product
 * - Replacement requests
 * 
 * Tracks: Priority, SLA, assigned employee, status, resolution time
 */

export type TicketStatus = "open" | "in_progress" | "waiting_customer" | "escalated" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory = "damaged_product" | "payment_issue" | "delivery_delay" | "return_request" | "refund_request" | "wrong_product" | "replacement" | "general";

export interface Ticket {
  id: string;
  ticketNumber: string;
  category: TicketCategory;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  // Relations
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderId?: string;
  conversationId?: string;
  // Assignment
  assignedTo?: string;
  assignedName?: string;
  // SLA
  slaDeadline: Date;
  slaBreached: boolean;
  // Timing
  createdAt: Date;
  updatedAt: Date;
  firstResponseAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  resolutionTimeMs?: number;
  // Activity
  notes: TicketNote[];
  tags: string[];
}

export interface TicketNote {
  id: string;
  content: string;
  createdBy: string;
  createdByName: string;
  isInternal: boolean;
  timestamp: Date;
}

// SLA configuration in hours
const SLA_CONFIG: Record<TicketPriority, number> = {
  urgent: 2,
  high: 4,
  medium: 12,
  low: 24,
};

// Auto-detection keywords for ticket categories
const CATEGORY_KEYWORDS: Record<TicketCategory, string[]> = {
  damaged_product: ["damaged", "broken", "torn", "crushed", "spoiled", "expired"],
  payment_issue: ["payment failed", "deducted", "double charged", "refund pending", "not received payment"],
  delivery_delay: ["not delivered", "delay", "where is my order", "late delivery", "when will i get"],
  return_request: ["return", "send back", "don't want", "cancel order"],
  refund_request: ["refund", "money back", "reimburse"],
  wrong_product: ["wrong product", "wrong item", "different product", "not what i ordered"],
  replacement: ["replace", "replacement", "exchange", "swap"],
  general: [],
};

export class TicketService {
  private tickets: Map<string, Ticket> = new Map();
  private ticketCounter: number = 1000;

  /**
   * Create ticket manually or from automation
   */
  createTicket(params: {
    category: TicketCategory;
    subject: string;
    description: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    orderId?: string;
    conversationId?: string;
    priority?: TicketPriority;
    assignedTo?: string;
    assignedName?: string;
  }): Ticket {
    this.ticketCounter++;
    const priority = params.priority || this.inferPriority(params.category);
    const slaHours = SLA_CONFIG[priority];

    const ticket: Ticket = {
      id: `ticket_${Date.now()}`,
      ticketNumber: `NC-TKT-${this.ticketCounter}`,
      category: params.category,
      subject: params.subject,
      description: params.description,
      status: "open",
      priority,
      customerId: params.customerId,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      orderId: params.orderId,
      conversationId: params.conversationId,
      assignedTo: params.assignedTo,
      assignedName: params.assignedName,
      slaDeadline: new Date(Date.now() + slaHours * 60 * 60 * 1000),
      slaBreached: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: [],
      tags: [],
    };

    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  /**
   * Auto-detect ticket category from message content
   */
  detectCategory(message: string): TicketCategory {
    const lower = message.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (keywords.some(kw => lower.includes(kw))) {
        return category as TicketCategory;
      }
    }
    return "general";
  }

  /**
   * Auto-create ticket from customer message
   */
  autoCreateFromMessage(
    message: string,
    customerId: string,
    customerName: string,
    customerPhone: string,
    orderId?: string,
    conversationId?: string
  ): Ticket | null {
    const category = this.detectCategory(message);
    if (category === "general") return null; // Don't auto-create for general messages

    return this.createTicket({
      category,
      subject: this.generateSubject(category, orderId),
      description: message,
      customerId,
      customerName,
      customerPhone,
      orderId,
      conversationId,
    });
  }

  /**
   * Update ticket status
   */
  updateStatus(ticketId: string, status: TicketStatus, userId?: string): void {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return;

    ticket.status = status;
    ticket.updatedAt = new Date();

    if (status === "resolved") {
      ticket.resolvedAt = new Date();
      ticket.resolutionTimeMs = ticket.resolvedAt.getTime() - ticket.createdAt.getTime();
    }
    if (status === "closed") ticket.closedAt = new Date();
  }

  /**
   * Assign ticket to employee
   */
  assignTicket(ticketId: string, employeeId: string, employeeName: string): void {
    const ticket = this.tickets.get(ticketId);
    if (ticket) {
      ticket.assignedTo = employeeId;
      ticket.assignedName = employeeName;
      ticket.status = "in_progress";
      ticket.updatedAt = new Date();
    }
  }

  /**
   * Add note to ticket
   */
  addNote(ticketId: string, content: string, userId: string, userName: string, isInternal: boolean = false): void {
    const ticket = this.tickets.get(ticketId);
    if (ticket) {
      ticket.notes.push({
        id: `tn_${Date.now()}`,
        content,
        createdBy: userId,
        createdByName: userName,
        isInternal,
        timestamp: new Date(),
      });
      ticket.updatedAt = new Date();
      if (!ticket.firstResponseAt && !isInternal) {
        ticket.firstResponseAt = new Date();
      }
    }
  }

  /**
   * Get tickets with filters
   */
  getTickets(filters?: {
    status?: TicketStatus;
    priority?: TicketPriority;
    category?: TicketCategory;
    assignedTo?: string;
    customerId?: string;
    slaBreached?: boolean;
  }): Ticket[] {
    let tickets = Array.from(this.tickets.values());
    if (filters?.status) tickets = tickets.filter(t => t.status === filters.status);
    if (filters?.priority) tickets = tickets.filter(t => t.priority === filters.priority);
    if (filters?.category) tickets = tickets.filter(t => t.category === filters.category);
    if (filters?.assignedTo) tickets = tickets.filter(t => t.assignedTo === filters.assignedTo);
    if (filters?.customerId) tickets = tickets.filter(t => t.customerId === filters.customerId);
    if (filters?.slaBreached) tickets = tickets.filter(t => t.slaBreached);

    // Check SLA breaches
    const now = Date.now();
    tickets.forEach(t => {
      if (!t.resolvedAt && t.slaDeadline.getTime() < now) t.slaBreached = true;
    });

    return tickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get ticket stats
   */
  getStats(): Record<string, number> {
    const tickets = Array.from(this.tickets.values());
    return {
      totalOpen: tickets.filter(t => t.status === "open").length,
      totalInProgress: tickets.filter(t => t.status === "in_progress").length,
      totalResolved: tickets.filter(t => t.status === "resolved").length,
      totalSLABreached: tickets.filter(t => t.slaBreached).length,
      avgResolutionMs: this.calculateAvgResolution(tickets),
    };
  }

  private inferPriority(category: TicketCategory): TicketPriority {
    switch (category) {
      case "damaged_product": return "high";
      case "wrong_product": return "high";
      case "payment_issue": return "urgent";
      case "refund_request": return "medium";
      case "delivery_delay": return "medium";
      case "return_request": return "medium";
      case "replacement": return "medium";
      default: return "low";
    }
  }

  private generateSubject(category: TicketCategory, orderId?: string): string {
    const orderSuffix = orderId ? ` - Order #${orderId}` : "";
    const subjects: Record<TicketCategory, string> = {
      damaged_product: "Damaged Product Report",
      payment_issue: "Payment Issue",
      delivery_delay: "Delivery Delay",
      return_request: "Return Request",
      refund_request: "Refund Request",
      wrong_product: "Wrong Product Received",
      replacement: "Replacement Request",
      general: "Customer Query",
    };
    return subjects[category] + orderSuffix;
  }

  private calculateAvgResolution(tickets: Ticket[]): number {
    const resolved = tickets.filter(t => t.resolutionTimeMs);
    if (resolved.length === 0) return 0;
    return Math.round(resolved.reduce((a, t) => a + t.resolutionTimeMs!, 0) / resolved.length);
  }
}

export const ticketService = new TicketService();
