/**
 * WhatsApp Campaign Engine
 * 
 * Supports campaign types:
 * - COD to Prepaid (discount-based conversion)
 * - Order Confirmation
 * - Shipping Update
 * - Out for Delivery
 * - Delivered
 * - Review Collection
 * - Repeat Purchase (30/60/90 day triggers)
 * - Festival Campaigns (Diwali, Sankranti, Ugadi, Christmas, New Year)
 */

export type CampaignType =
  | "cod_to_prepaid"
  | "order_confirmation"
  | "shipping_update"
  | "out_for_delivery"
  | "delivered"
  | "review_collection"
  | "repeat_purchase"
  | "festival"
  | "custom";

export interface CampaignConfig {
  type: CampaignType;
  name: string;
  templateId: string;
  targetSegments?: string[];
  filters?: CampaignFilter;
  schedule?: CampaignSchedule;
  discountConfig?: DiscountConfig;
  festivalConfig?: FestivalConfig;
  repeatConfig?: RepeatPurchaseConfig;
}

export interface CampaignFilter {
  minOrders?: number;
  maxOrders?: number;
  paymentMode?: "COD" | "PREPAID" | "ALL";
  orderStatus?: string[];
  daysSinceLastOrder?: { min?: number; max?: number };
  segments?: string[];
  cities?: string[];
  products?: string[];
  minSpend?: number;
  maxSpend?: number;
}

export interface CampaignSchedule {
  sendAt: "now" | "scheduled" | "trigger";
  scheduledTime?: Date;
  triggerEvent?: string;
  repeatInterval?: "daily" | "weekly" | "monthly" | "custom";
  repeatCron?: string;
  endDate?: Date;
}

export interface DiscountConfig {
  percentage: number;
  maxAmount?: number;
  minOrderValue?: number;
  expiryHours: number;
}

export interface FestivalConfig {
  festival: "diwali" | "sankranti" | "ugadi" | "christmas" | "new_year" | "custom";
  startDate: Date;
  endDate: Date;
  couponCode?: string;
  discountPercentage?: number;
}

export interface RepeatPurchaseConfig {
  triggerDays: number[]; // e.g., [30, 60, 90]
  products?: string[];
  offerDiscount?: number;
}

export interface CampaignExecution {
  id: string;
  campaignId: string;
  status: "queued" | "running" | "paused" | "completed" | "failed";
  totalTargeted: number;
  sent: number;
  delivered: number;
  read: number;
  responded: number;
  converted: number;
  failed: number;
  revenue: number;
  startedAt: Date;
  completedAt?: Date;
}

export class CampaignEngineService {
  /**
   * Create and validate a campaign configuration
   */
  createCampaign(config: CampaignConfig): CampaignConfig & { id: string } {
    this.validateConfig(config);
    return {
      ...config,
      id: `campaign_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };
  }

  /**
   * Get target audience based on filters
   */
  async getTargetAudience(filters: CampaignFilter): Promise<{
    count: number;
    sample: Array<{ name: string; phone: string }>;
  }> {
    // In production, query database with filters
    return { count: 0, sample: [] };
  }

  /**
   * Get repeat purchase candidates
   */
  async getRepeatPurchaseCandidates(config: RepeatPurchaseConfig): Promise<{
    candidates: Array<{
      customerId: string;
      name: string;
      phone: string;
      lastProduct: string;
      daysSincePurchase: number;
    }>;
  }> {
    // In production, query customers whose last purchase was N days ago
    return { candidates: [] };
  }

  /**
   * Schedule festival campaign
   */
  scheduleFestivalCampaign(config: FestivalConfig): {
    scheduledDate: Date;
    reminderDates: Date[];
  } {
    const scheduledDate = new Date(config.startDate);
    // Send campaign 1 day before festival starts
    scheduledDate.setDate(scheduledDate.getDate() - 1);

    // Reminder dates during campaign
    const reminderDates: Date[] = [];
    const duration = (config.endDate.getTime() - config.startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (duration > 3) {
      const midDate = new Date(config.startDate.getTime() + (config.endDate.getTime() - config.startDate.getTime()) / 2);
      reminderDates.push(midDate);
    }
    // Last day reminder
    const lastDay = new Date(config.endDate);
    lastDay.setHours(10, 0, 0, 0);
    reminderDates.push(lastDay);

    return { scheduledDate, reminderDates };
  }

  /**
   * Get campaign template for type
   */
  getDefaultTemplate(type: CampaignType): string {
    const templates: Record<CampaignType, string> = {
      cod_to_prepaid: "Hello {{customer_name}}! Convert your COD order to prepaid and get {{discount}}% off. Pay only ₹{{final_amount}}. Link: {{payment_link}}",
      order_confirmation: "Hi {{customer_name}}! Your order #{{order_id}} for {{product_name}} has been confirmed. Amount: ₹{{amount}}. Thank you for shopping with Nature's Crates!",
      shipping_update: "Hi {{customer_name}}! Your order #{{order_id}} has been shipped. Track here: {{tracking_link}}",
      out_for_delivery: "Hi {{customer_name}}! Your order #{{order_id}} is out for delivery today. Please keep ₹{{amount}} ready for COD payment.",
      delivered: "Hi {{customer_name}}! Your order #{{order_id}} has been delivered. We hope you love your {{product_name}}! Rate your experience.",
      review_collection: "Hi {{customer_name}}! How are you enjoying your {{product_name}}? We'd love your honest review. It helps other customers decide!",
      repeat_purchase: "Hi {{customer_name}}! It's been a while since you ordered {{product_name}}. Ready for a refill? Order now and enjoy special returning customer benefits!",
      festival: "Hi {{customer_name}}! Celebrate this festive season with Nature's Crates. Enjoy {{discount}}% OFF with code: {{coupon}}. Valid till {{end_date}}!",
      custom: "{{message}}",
    };
    return templates[type];
  }

  private validateConfig(config: CampaignConfig): void {
    if (!config.name) throw new Error("Campaign name is required");
    if (!config.type) throw new Error("Campaign type is required");
    if (config.type === "cod_to_prepaid" && !config.discountConfig) {
      throw new Error("Discount config required for COD conversion campaigns");
    }
    if (config.type === "festival" && !config.festivalConfig) {
      throw new Error("Festival config required for festival campaigns");
    }
    if (config.type === "repeat_purchase" && !config.repeatConfig) {
      throw new Error("Repeat config required for repeat purchase campaigns");
    }
  }
}

export const campaignEngine = new CampaignEngineService();
