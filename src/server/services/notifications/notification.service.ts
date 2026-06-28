/**
 * Notification Service
 * 
 * Real-time notifications via: In-app, Email, WhatsApp, Browser Push
 * Events: New Orders, Payment, Failed Payment, WhatsApp Reply,
 * Delivery, Review, Ticket, System Alerts
 */

export type NotificationChannel = "in_app" | "email" | "whatsapp" | "push";
export type NotificationType = "order" | "payment" | "message" | "delivery" | "review" | "ticket" | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  channel: NotificationChannel;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export class NotificationService {
  private notifications: Notification[] = [];

  notify(params: Omit<Notification, "id" | "isRead" | "createdAt">): Notification {
    const notif: Notification = {
      ...params,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      isRead: false,
      createdAt: new Date(),
    };
    this.notifications.unshift(notif);
    if (this.notifications.length > 500) this.notifications.pop();
    return notif;
  }

  getForUser(userId: string, limit: number = 50): Notification[] {
    return this.notifications.filter(n => n.userId === userId).slice(0, limit);
  }

  getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.userId === userId && !n.isRead).length;
  }

  markRead(notificationId: string): void {
    const n = this.notifications.find(n => n.id === notificationId);
    if (n) n.isRead = true;
  }

  markAllRead(userId: string): void {
    this.notifications.filter(n => n.userId === userId).forEach(n => n.isRead = true);
  }
}

export const notificationService = new NotificationService();
