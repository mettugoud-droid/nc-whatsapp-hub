import {
  PaymentProvider,
  PaymentProviderConfig,
  PaymentLinkRequest,
  PaymentLinkResponse,
  PaymentStatus,
  WebhookVerification,
  RefundRequest,
  RefundResponse,
} from "./payment-provider.interface";
import { RazorpayProvider } from "./razorpay-provider";

/**
 * Payment Gateway Service
 * 
 * Factory pattern for managing multiple payment providers.
 * Administrators can switch the active provider without code changes.
 */
export class PaymentGatewayService {
  private providers: Map<string, PaymentProvider> = new Map();
  private activeProvider: string = "razorpay";

  constructor() {
    // Register available providers
    this.providers.set("razorpay", new RazorpayProvider());
    // Future providers:
    // this.providers.set("cashfree", new CashfreeProvider());
    // this.providers.set("phonepe", new PhonePeProvider());
    // this.providers.set("payu", new PayUProvider());
    // this.providers.set("stripe", new StripeProvider());
    // this.providers.set("paytm", new PaytmProvider());
  }

  /**
   * Set the active payment provider
   */
  setActiveProvider(providerName: string): void {
    if (!this.providers.has(providerName)) {
      throw new Error(`Payment provider '${providerName}' is not registered`);
    }
    this.activeProvider = providerName;
  }

  /**
   * Get the currently active provider name
   */
  getActiveProviderName(): string {
    return this.activeProvider;
  }

  /**
   * Get list of all registered providers
   */
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Initialize the active provider with credentials
   */
  initializeProvider(config: PaymentProviderConfig): void {
    const provider = this.getProvider();
    provider.initialize(config);
  }

  /**
   * Test connection for the active provider
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    const provider = this.getProvider();
    return provider.testConnection();
  }

  /**
   * Create a payment link using the active provider
   */
  async createPaymentLink(request: PaymentLinkRequest): Promise<PaymentLinkResponse> {
    const provider = this.getProvider();
    return provider.createPaymentLink(request);
  }

  /**
   * Get payment status from the active provider
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const provider = this.getProvider();
    return provider.getPaymentStatus(paymentId);
  }

  /**
   * Get payment link status from the active provider
   */
  async getPaymentLinkStatus(linkId: string): Promise<PaymentStatus> {
    const provider = this.getProvider();
    return provider.getPaymentLinkStatus(linkId);
  }

  /**
   * Verify webhook signature using the active provider
   */
  verifyWebhook(
    body: string | Buffer,
    signature: string,
    secret: string
  ): WebhookVerification {
    const provider = this.getProvider();
    return provider.verifyWebhook(body, signature, secret);
  }

  /**
   * Process a refund via the active provider
   */
  async refund(request: RefundRequest): Promise<RefundResponse> {
    const provider = this.getProvider();
    return provider.refund(request);
  }

  /**
   * Cancel a payment link via the active provider
   */
  async cancelPaymentLink(linkId: string): Promise<{ success: boolean }> {
    const provider = this.getProvider();
    return provider.cancelPaymentLink(linkId);
  }

  private getProvider(): PaymentProvider {
    const provider = this.providers.get(this.activeProvider);
    if (!provider) {
      throw new Error(`Active provider '${this.activeProvider}' not found`);
    }
    return provider;
  }
}

// Singleton instance
export const paymentGateway = new PaymentGatewayService();
