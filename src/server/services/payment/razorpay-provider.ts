import Razorpay from "razorpay";
import crypto from "crypto";
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

export class RazorpayProvider implements PaymentProvider {
  readonly providerName = "razorpay";
  private client: Razorpay | null = null;
  private config: PaymentProviderConfig | null = null;

  initialize(config: PaymentProviderConfig): void {
    this.config = config;
    this.client = new Razorpay({
      key_id: config.keyId,
      key_secret: config.keySecret,
    });
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.client) {
      return { success: false, message: "Provider not initialized" };
    }

    try {
      // Test by fetching payment links (limit 1)
      await (this.client as any).paymentLink.all({ count: 1 });
      return { success: true, message: "Razorpay connection successful" };
    } catch (error: any) {
      return {
        success: false,
        message: `Connection failed: ${error.message || "Unknown error"}`,
      };
    }
  }

  async createPaymentLink(request: PaymentLinkRequest): Promise<PaymentLinkResponse> {
    if (!this.client || !this.config) {
      throw new Error("Razorpay provider not initialized");
    }

    const expiryMinutes = request.expiryMinutes || 1440; // Default 24 hours
    const expireBy = Math.floor(Date.now() / 1000) + expiryMinutes * 60;

    const linkOptions: any = {
      amount: request.amount, // Amount in paise
      currency: request.currency || "INR",
      accept_partial: false,
      description: request.description,
      customer: {
        name: request.customerName,
        contact: request.customerPhone,
        ...(request.customerEmail && { email: request.customerEmail }),
      },
      notify: {
        sms: false, // We handle notifications via WhatsApp
        email: false,
      },
      reminder_enable: false, // We handle reminders ourselves
      expire_by: expireBy,
      notes: {
        order_id: request.orderId,
        ...request.notes,
      },
      ...(request.callbackUrl && { callback_url: request.callbackUrl }),
      callback_method: "get",
    };

    try {
      const link = await (this.client as any).paymentLink.create(linkOptions);

      return {
        success: true,
        linkId: link.id,
        linkUrl: link.short_url,
        amount: link.amount,
        currency: link.currency,
        status: link.status,
        expiresAt: new Date(expireBy * 1000),
        providerData: link,
      };
    } catch (error: any) {
      throw new Error(`Razorpay create link failed: ${error.message}`);
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    if (!this.client) {
      throw new Error("Razorpay provider not initialized");
    }

    try {
      const payment = await (this.client as any).payments.fetch(paymentId);

      return {
        paymentId: payment.id,
        linkId: payment.notes?.link_id || "",
        orderId: payment.notes?.order_id || "",
        status: this.mapRazorpayStatus(payment.status),
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        paidAt: payment.captured_at
          ? new Date(payment.captured_at * 1000)
          : undefined,
        failureReason: payment.error_description,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch payment status: ${error.message}`);
    }
  }

  async getPaymentLinkStatus(linkId: string): Promise<PaymentStatus> {
    if (!this.client) {
      throw new Error("Razorpay provider not initialized");
    }

    try {
      const link = await (this.client as any).paymentLink.fetch(linkId);

      return {
        paymentId: link.payments?.[0]?.payment_id || "",
        linkId: link.id,
        orderId: link.notes?.order_id || "",
        status: this.mapLinkStatus(link.status),
        amount: link.amount,
        currency: link.currency,
        paidAt: link.paid_at ? new Date(link.paid_at * 1000) : undefined,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch link status: ${error.message}`);
    }
  }

  verifyWebhook(
    body: string | Buffer,
    signature: string,
    secret: string
  ): WebhookVerification {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(typeof body === "string" ? body : body.toString())
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    let payload: Record<string, any> = {};
    let event = "";

    if (isValid) {
      const parsed = JSON.parse(typeof body === "string" ? body : body.toString());
      event = parsed.event || "";
      payload = parsed.payload || {};
    }

    return { isValid, event, payload };
  }

  async refund(request: RefundRequest): Promise<RefundResponse> {
    if (!this.client) {
      throw new Error("Razorpay provider not initialized");
    }

    try {
      const refundOptions: any = {
        ...(request.amount && { amount: request.amount }),
        ...(request.reason && {
          notes: { reason: request.reason },
        }),
      };

      const refund = await (this.client as any).payments.refund(
        request.paymentId,
        refundOptions
      );

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status,
      };
    } catch (error: any) {
      throw new Error(`Refund failed: ${error.message}`);
    }
  }

  async cancelPaymentLink(linkId: string): Promise<{ success: boolean }> {
    if (!this.client) {
      throw new Error("Razorpay provider not initialized");
    }

    try {
      await (this.client as any).paymentLink.cancel(linkId);
      return { success: true };
    } catch (error: any) {
      throw new Error(`Cancel link failed: ${error.message}`);
    }
  }

  private mapRazorpayStatus(status: string): PaymentStatus["status"] {
    switch (status) {
      case "created":
        return "created";
      case "authorized":
        return "authorized";
      case "captured":
        return "captured";
      case "failed":
        return "failed";
      case "refunded":
        return "refunded";
      default:
        return "pending";
    }
  }

  private mapLinkStatus(status: string): PaymentStatus["status"] {
    switch (status) {
      case "created":
        return "created";
      case "paid":
        return "captured";
      case "expired":
        return "expired";
      case "cancelled":
        return "expired";
      default:
        return "pending";
    }
  }
}
