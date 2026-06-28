/**
 * Customer CRM Service
 * 
 * Full customer relationship management with:
 * - Customer profiles with complete history
 * - Segmentation (New, Active, VIP, At Risk, Lost)
 * - Lifetime Value calculation
 * - Next purchase prediction
 * - RTO/Return tracking
 * - Payment preference analysis
 */

export type CustomerSegment = "new" | "active" | "vip" | "at_risk" | "lost";

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  // Order metrics
  totalOrders: number;
  totalSpend: number;
  averageOrderValue: number;
  preferredProducts: string[];
  // Payment preferences
  codOrders: number;
  prepaidOrders: number;
  codPercentage: number;
  prepaidPercentage: number;
  // Risk metrics
  rtoCount: number;
  returnCount: number;
  rtoRate: number;
  // Communication
  whatsappMessages: number;
  campaignsReceived: number;
  lastMessageAt?: Date;
  // Lifecycle
  segment: CustomerSegment;
  lifetimeValue: number;
  firstPurchase?: Date;
  lastPurchase?: Date;
  daysSinceLastPurchase: number;
  nextPurchasePrediction?: Date;
  // Scores
  engagementScore: number; // 0-100
  conversionLikelihood: number; // 0-100
  rtoRiskScore: number; // 0-100
}

export interface SegmentCriteria {
  new: { maxOrders: number; maxDays: number };
  active: { minOrders: number; maxDaysSinceLastPurchase: number };
  vip: { minOrders: number; minSpend: number };
  at_risk: { minDaysSinceLastPurchase: number; maxDaysSinceLastPurchase: number };
  lost: { minDaysSinceLastPurchase: number };
}

const DEFAULT_SEGMENT_CRITERIA: SegmentCriteria = {
  new: { maxOrders: 1, maxDays: 30 },
  active: { minOrders: 2, maxDaysSinceLastPurchase: 60 },
  vip: { minOrders: 5, minSpend: 10000 },
  at_risk: { minDaysSinceLastPurchase: 61, maxDaysSinceLastPurchase: 120 },
  lost: { minDaysSinceLastPurchase: 121 },
};

export class CustomerCRMService {
  private criteria: SegmentCriteria = DEFAULT_SEGMENT_CRITERIA;

  /**
   * Calculate customer segment based on behavior
   */
  calculateSegment(profile: Partial<CustomerProfile>): CustomerSegment {
    const orders = profile.totalOrders || 0;
    const spend = profile.totalSpend || 0;
    const daysSince = profile.daysSinceLastPurchase || 999;

    // VIP: High orders + high spend
    if (orders >= this.criteria.vip.minOrders && spend >= this.criteria.vip.minSpend) {
      return "vip";
    }
    // Lost: No activity for 120+ days
    if (daysSince >= this.criteria.lost.minDaysSinceLastPurchase) {
      return "lost";
    }
    // At Risk: 61-120 days since last purchase
    if (daysSince >= this.criteria.at_risk.minDaysSinceLastPurchase) {
      return "at_risk";
    }
    // New: 1 order or less within 30 days
    if (orders <= this.criteria.new.maxOrders) {
      return "new";
    }
    // Active: Regular purchases
    return "active";
  }

  /**
   * Calculate Customer Lifetime Value
   */
  calculateLTV(
    totalSpend: number,
    totalOrders: number,
    daysSinceFirstPurchase: number
  ): number {
    if (daysSinceFirstPurchase === 0 || totalOrders === 0) return totalSpend;
    const avgOrderValue = totalSpend / totalOrders;
    const purchaseFrequency = totalOrders / (daysSinceFirstPurchase / 365);
    // Project 3-year LTV
    return Math.round(avgOrderValue * purchaseFrequency * 3);
  }

  /**
   * Predict next purchase date
   */
  predictNextPurchase(
    orderDates: Date[],
    lastPurchase: Date
  ): Date | undefined {
    if (orderDates.length < 2) return undefined;
    // Calculate average days between purchases
    const intervals: number[] = [];
    const sorted = orderDates.sort((a, b) => a.getTime() - b.getTime());
    for (let i = 1; i < sorted.length; i++) {
      intervals.push(
        (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 60 * 60 * 24)
      );
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const predicted = new Date(lastPurchase.getTime() + avgInterval * 24 * 60 * 60 * 1000);
    return predicted;
  }

  /**
   * Calculate engagement score (0-100)
   */
  calculateEngagementScore(profile: Partial<CustomerProfile>): number {
    let score = 0;
    // Recency (max 30 pts)
    const days = profile.daysSinceLastPurchase || 999;
    if (days <= 7) score += 30;
    else if (days <= 30) score += 25;
    else if (days <= 60) score += 15;
    else if (days <= 90) score += 5;
    // Frequency (max 30 pts)
    const orders = profile.totalOrders || 0;
    score += Math.min(30, orders * 5);
    // Monetary (max 20 pts)
    const spend = profile.totalSpend || 0;
    if (spend >= 20000) score += 20;
    else if (spend >= 10000) score += 15;
    else if (spend >= 5000) score += 10;
    else if (spend >= 2000) score += 5;
    // Communication (max 20 pts)
    const messages = profile.whatsappMessages || 0;
    score += Math.min(20, messages * 2);
    return Math.min(100, score);
  }

  /**
   * Calculate RTO risk score (0-100)
   */
  calculateRTORiskScore(
    rtoCount: number,
    totalOrders: number,
    codPercentage: number
  ): number {
    let score = 0;
    // High COD percentage increases risk
    score += Math.round(codPercentage * 0.3);
    // RTO history
    const rtoRate = totalOrders > 0 ? (rtoCount / totalOrders) * 100 : 0;
    score += Math.min(40, Math.round(rtoRate * 4));
    // Low order count with COD is risky
    if (totalOrders <= 2 && codPercentage > 80) score += 20;
    return Math.min(100, score);
  }

  /**
   * Calculate prepaid conversion likelihood (0-100)
   */
  calculateConversionLikelihood(profile: Partial<CustomerProfile>): number {
    let score = 50; // Base
    // Already has prepaid history
    if ((profile.prepaidPercentage || 0) > 0) score += 20;
    // High engagement
    score += Math.round((profile.engagementScore || 0) * 0.2);
    // Low RTO
    if ((profile.rtoRiskScore || 0) < 30) score += 10;
    // VIP/Active customers more likely
    if (profile.segment === "vip") score += 15;
    else if (profile.segment === "active") score += 10;
    return Math.min(100, Math.max(0, score));
  }
}

export const customerCRM = new CustomerCRMService();
