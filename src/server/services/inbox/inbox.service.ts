/**
 * Unified WhatsApp Inbox Service
 * 
 * Manages bidirectional WhatsApp conversations:
 * - Receive & store incoming messages
 * - Conversation management (open, pending, resolved, closed)
 * - Employee assignment
 * - Internal notes
 * - Tags & quick replies
 * - Auto-link to customer profile, order history, payment status
 */

export type ConversationStatus = "open" | "pending" | "resolved" | "closed";
export type MessageType = "text" | "image" | "document" | "voice" | "video" | "location" | "contact";

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  assignedTo?: string;
  assignedName?: string;
  status: ConversationStatus;
  tags: string[];
  priority: "low" | "medium" | "high" | "urgent";
  lastMessage?: string;
  lastMessageAt?: Date;
  lastMessageDirection: "inbound" | "outbound";
  unreadCount: number;
  // Linked data
  customerId?: string;
  orderId?: string;
  ticketId?: string;
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  firstResponseAt?: Date;
  responseTimeMs?: number;
}

export interface InboxMessage {
  id: string;
  conversationId: string;
  direction: "inbound" | "outbound";
  type: MessageType;
  content: string;
  mediaUrl?: string;
  mediaCaption?: string;
  whatsappMessageId?: string;
  status: "sent" | "delivered" | "read" | "failed";
  sentBy?: string; // employee who sent
  isNote: boolean; // internal note (not sent to customer)
  timestamp: Date;
}

export interface QuickReply {
  id: string;
  title: string;
  shortcut: string; // e.g., /tracking
  content: string;
  category: string;
}

export interface CannedResponse {
  id: string;
  title: string;
  content: string;
  variables: string[];
  category: string;
  usageCount: number;
}

export class InboxService {
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, InboxMessage[]> = new Map();
  private quickReplies: QuickReply[] = [];
  private cannedResponses: CannedResponse[] = [];

  constructor() {
    this.seedQuickReplies();
    this.seedCannedResponses();
  }

  /**
   * Handle incoming WhatsApp message
   */
  handleIncomingMessage(
    phone: string,
    contactName: string,
    message: string,
    type: MessageType = "text",
    mediaUrl?: string
  ): { conversation: Conversation; message: InboxMessage } {
    // Find or create conversation
    let conversation = this.findConversationByPhone(phone);
    if (!conversation) {
      conversation = this.createConversation(phone, contactName);
    }

    // Update conversation
    conversation.lastMessage = message;
    conversation.lastMessageAt = new Date();
    conversation.lastMessageDirection = "inbound";
    conversation.unreadCount++;
    conversation.updatedAt = new Date();
    if (conversation.status === "resolved" || conversation.status === "closed") {
      conversation.status = "open"; // Reopen on new message
    }

    // Create message record
    const msg: InboxMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      conversationId: conversation.id,
      direction: "inbound",
      type,
      content: message,
      mediaUrl,
      status: "delivered",
      isNote: false,
      timestamp: new Date(),
    };

    const msgs = this.messages.get(conversation.id) || [];
    msgs.push(msg);
    this.messages.set(conversation.id, msgs);

    return { conversation, message: msg };
  }

  /**
   * Send outbound message in conversation
   */
  sendMessage(
    conversationId: string,
    content: string,
    sentBy: string,
    type: MessageType = "text",
    mediaUrl?: string
  ): InboxMessage {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const msg: InboxMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      conversationId,
      direction: "outbound",
      type,
      content,
      mediaUrl,
      status: "sent",
      sentBy,
      isNote: false,
      timestamp: new Date(),
    };

    conversation.lastMessage = content;
    conversation.lastMessageAt = new Date();
    conversation.lastMessageDirection = "outbound";
    conversation.updatedAt = new Date();

    // Track first response time
    if (!conversation.firstResponseAt && conversation.lastMessageDirection === "outbound") {
      conversation.firstResponseAt = new Date();
      if (conversation.createdAt) {
        conversation.responseTimeMs = msg.timestamp.getTime() - conversation.createdAt.getTime();
      }
    }

    const msgs = this.messages.get(conversationId) || [];
    msgs.push(msg);
    this.messages.set(conversationId, msgs);

    return msg;
  }

  /**
   * Add internal note (not sent to customer)
   */
  addNote(conversationId: string, content: string, userId: string): InboxMessage {
    const msg: InboxMessage = {
      id: `note_${Date.now()}`,
      conversationId,
      direction: "outbound",
      type: "text",
      content,
      status: "delivered",
      sentBy: userId,
      isNote: true,
      timestamp: new Date(),
    };

    const msgs = this.messages.get(conversationId) || [];
    msgs.push(msg);
    this.messages.set(conversationId, msgs);
    return msg;
  }

  /**
   * Assign conversation to employee
   */
  assignConversation(conversationId: string, employeeId: string, employeeName: string): void {
    const conv = this.conversations.get(conversationId);
    if (conv) {
      conv.assignedTo = employeeId;
      conv.assignedName = employeeName;
      conv.status = "pending";
      conv.updatedAt = new Date();
    }
  }

  /**
   * Update conversation status
   */
  updateStatus(conversationId: string, status: ConversationStatus): void {
    const conv = this.conversations.get(conversationId);
    if (conv) {
      conv.status = status;
      conv.updatedAt = new Date();
      if (status === "resolved") conv.resolvedAt = new Date();
    }
  }

  /**
   * Add/remove tags
   */
  addTag(conversationId: string, tag: string): void {
    const conv = this.conversations.get(conversationId);
    if (conv && !conv.tags.includes(tag)) conv.tags.push(tag);
  }

  removeTag(conversationId: string, tag: string): void {
    const conv = this.conversations.get(conversationId);
    if (conv) conv.tags = conv.tags.filter(t => t !== tag);
  }

  /**
   * Get conversations with filters
   */
  getConversations(filters?: {
    status?: ConversationStatus;
    assignedTo?: string;
    tag?: string;
    search?: string;
  }): Conversation[] {
    let convs = Array.from(this.conversations.values());
    if (filters?.status) convs = convs.filter(c => c.status === filters.status);
    if (filters?.assignedTo) convs = convs.filter(c => c.assignedTo === filters.assignedTo);
    if (filters?.tag) convs = convs.filter(c => c.tags.includes(filters.tag!));
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      convs = convs.filter(c =>
        c.contactName.toLowerCase().includes(q) ||
        c.contactPhone.includes(q) ||
        c.lastMessage?.toLowerCase().includes(q)
      );
    }
    return convs.sort((a, b) => (b.lastMessageAt?.getTime() || 0) - (a.lastMessageAt?.getTime() || 0));
  }

  /**
   * Get messages for a conversation
   */
  getMessages(conversationId: string): InboxMessage[] {
    return this.messages.get(conversationId) || [];
  }

  /**
   * Get quick replies
   */
  getQuickReplies(): QuickReply[] {
    return this.quickReplies;
  }

  /**
   * Get canned responses
   */
  getCannedResponses(): CannedResponse[] {
    return this.cannedResponses;
  }

  /**
   * Get inbox stats
   */
  getStats(): {
    totalOpen: number;
    totalPending: number;
    totalResolved: number;
    unassigned: number;
    avgResponseTime: number;
  } {
    const convs = Array.from(this.conversations.values());
    const responseTimes = convs.filter(c => c.responseTimeMs).map(c => c.responseTimeMs!);
    return {
      totalOpen: convs.filter(c => c.status === "open").length,
      totalPending: convs.filter(c => c.status === "pending").length,
      totalResolved: convs.filter(c => c.status === "resolved").length,
      unassigned: convs.filter(c => !c.assignedTo && c.status === "open").length,
      avgResponseTime: responseTimes.length > 0
        ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
        : 0,
    };
  }

  private createConversation(phone: string, name: string): Conversation {
    const conv: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      contactId: "",
      contactName: name,
      contactPhone: phone,
      status: "open",
      tags: [],
      priority: "medium",
      lastMessageDirection: "inbound",
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(conv.id, conv);
    return conv;
  }

  private findConversationByPhone(phone: string): Conversation | undefined {
    return Array.from(this.conversations.values()).find(c => c.contactPhone === phone);
  }

  private seedQuickReplies() {
    this.quickReplies = [
      { id: "qr1", title: "Order Status", shortcut: "/status", content: "Your order is currently {{status}}. Tracking: {{tracking_link}}", category: "orders" },
      { id: "qr2", title: "Payment Link", shortcut: "/pay", content: "Here's your payment link: {{payment_link}}", category: "payments" },
      { id: "qr3", title: "Thank You", shortcut: "/thanks", content: "Thank you for your message! We'll get back to you shortly.", category: "general" },
      { id: "qr4", title: "Support Hours", shortcut: "/hours", content: "Our support hours are Mon-Sat, 9 AM to 7 PM IST.", category: "general" },
      { id: "qr5", title: "Refund Processing", shortcut: "/refund", content: "Your refund has been initiated. It will reflect in 5-7 business days.", category: "payments" },
    ];
  }

  private seedCannedResponses() {
    this.cannedResponses = [
      { id: "cr1", title: "Welcome Message", content: "Hello {{customer_name}}! Thank you for reaching out to Nature's Crates. How can I help you today?", variables: ["customer_name"], category: "greeting", usageCount: 450 },
      { id: "cr2", title: "Order Delayed", content: "Hi {{customer_name}}, we apologize for the delay in your order #{{order_id}}. Our team is working to resolve this. Expected delivery: {{date}}.", variables: ["customer_name", "order_id", "date"], category: "support", usageCount: 120 },
      { id: "cr3", title: "Return Initiated", content: "Your return request for Order #{{order_id}} has been accepted. Our courier will pick up the item within 2-3 business days.", variables: ["order_id"], category: "returns", usageCount: 85 },
    ];
  }
}

export const inboxService = new InboxService();
