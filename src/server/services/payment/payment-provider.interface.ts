/**
 * Payment Gateway Provider Interface
 * 
 * Designed for future-proof extensibility.
 * New payment gateways can be added by implementing this interface
 * without any code changes to the core application.
 * 
 * Supported providers: Razorpay, Cashfree, PhonePe, PayU, Stripe, Paytm
 */

export interface PaymentLinkRequest {
  orderId: string;
  amount: number; // in smallest currency unit (paise for INR)
  currency: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  description: string;
  notes?: Record<string, string>;
  expiryMinutes?: number; // default 24 hours (1440 minutes)
  callbackUrl?: string;
  redirectUrl?: string;
}

export interface PaymentLinkResponse {
  success: boolean;
  linkId: string;
  linkUrl: string;
  amount: number;
  currency: string;
  status: string;
  expiresAt: Date;
  providerData?: Record<string, any>;
}

export interface PaymentStatus {
  paymentId: string;
  linkId: string;
  orderId: string;
  status: "created" | "pending" | "authorized" | "captured" | "failed" | "refunded" | "expired";
  amount: number;
  currency: string;
  method?: string; // upi, card, netbanking, wallet
  paidAt?: Date;
  failureReason?: string;
}

export interface WebhookVerification {
  isValid: boolean;
  event: string;
  payload: Record<string, any>;
}

export interface RefundRequest {
  paymentId: string;
  amount?: number; // partial refund if provided
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId: string;
  amount: number;
  status: string;
}

export interface PaymentProviderConfig {
  keyId: string;
  keySecret: string;
  webhookSecret?: string;
  sandbox: boolean;
  companyName?: string;
  companyLogo?: string;
}

export interface PaymentProvider {
  readonly providerName: string;

  /**
   * Initialize the payment provider with credentials
   */
  initialize(config: PaymentProviderConfig): void;

  /**
   * Test the connection to the payment gateway
   */
  testConnection(): Promise<{ success: boolean; message: string }>;

  /**
   * Create a payment link for COD-to-prepaid conversion
   */
  createPaymentLink(request: PaymentLinkRequest): Promise<PaymentLinkResponse>;

  /**
   * Get the status of a payment
   */
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;

  /**
   * Get the status of a payment link
   */
  getPaymentLinkStatus(linkId: string): Promise<PaymentStatus>;

  /**
   * Verify webhook signature
   */
  verifyWebhook(
    body: string | Buffer,
    signature: string,
    secret: string
  ): WebhookVerification;

  /**
   * Process a refund
   */
  refund(request: RefundRequest): Promise<RefundResponse>;

  /**
   * Cancel/expire a payment link
   */
  cancelPaymentLink(linkId: string): Promise<{ success: boolean }>;
}
