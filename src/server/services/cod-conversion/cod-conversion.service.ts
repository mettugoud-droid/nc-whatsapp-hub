import { paymentGateway } from "../payment/payment-gateway.service";
import { whatsappService } from "../whatsapp/whatsapp.service";

/**
 * COD-to-Prepaid Conversion Engine
 * 
 * Automated workflow:
 * 1. Detect COD orders
 * 2. Apply configured discount (5-7%)
 * 3. Generate Razorpay payment link
 * 4. Send WhatsApp message with payment link
 * 5. Schedule reminders if payment not received
 * 6. Update order status on successful payment
 * 7. Record conversion analytics
 */

interface CODOrder {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  product: string;
  amount: number;
  source?: string;
}

interface ConversionConfig {
  discountPercent: number;
  linkExpiryHours: number;
  autoSendEnabled: boolean;
  reminderSchedule: number[]; // hours after initial send
  businessName: string;
  supportNumber: string;
}

interface ConversionResult {
  success: boolean;
  orderId: string;
  paymentLinkUrl?: string;
  paymentLinkId?: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  expiresAt?: Date;
  messageSent?: boolean;
  error?: string;
}

// Default COD conversion templates
const COD_TEMPLATES = {
  initial: `Hello *{{customer_name}}* 👋

Thank you for shopping with **{{company}}**.

Convert your **Cash on Delivery** order to **Online Payment** and enjoy an **instant {{discount_percent}}% discount**.

Order ID: {{order_id}}
Original Amount: ₹{{original_amount}}
Discount: ₹{{discount}}
Final Amount: ₹{{final_amount}}

Pay securely using the link below:
{{payment_link}}

Once payment is successful, your order will be prioritized for dispatch.

Thank you!`,

  reminder1: `Hi {{customer_name}},

Your order is confirmed. Complete your payment online within the next **24 hours** and receive:

✅ Instant Discount
✅ Faster Dispatch
✅ Priority Packing

Payment Link:
{{payment_link}}

Thank you for choosing {{company}}.`,

  reminder2: `Hi {{customer_name}},

Just a reminder that your payment link is still active.

Complete your payment now and enjoy your prepaid discount.

{{payment_link}}

Need help? Reply to this message.`,

  finalReminder: `Hello {{customer_name}},

Your exclusive prepaid discount will expire soon.

Complete your payment now:
{{payment_link}}

Thank you for shopping with {{company}}.`,

  paymentSuccess: `Hi {{customer_name}},

We have received your payment successfully. ✅

Order ID: {{order_id}}
Amount Paid: ₹{{paid_amount}}

Your order is now being processed and will be dispatched soon.

Thank you for choosing {{company}}.`,
};

export class CodConversionService {
  private defaultConfig: ConversionConfig = {
    discountPercent: 5,
    linkExpiryHours: 48,
    autoSendEnabled: true,
    reminderSchedule: [6, 24, 48], // hours
    businessName: "Nature's Crates",
    supportNumber: "+91 98765 43210",
  };

  /**
   * Process a COD order for conversion
   */
  async processOrder(
    order: CODOrder,
    config?: Partial<ConversionConfig>
  ): Promise<ConversionResult> {
    const convConfig = { ...this.defaultConfig, ...config };

    // Calculate discount
    const discountAmount = Math.round(
      (order.amount * convConfig.discountPercent) / 100
    );
    const finalAmount = order.amount - discountAmount;

    try {
      // Generate payment link
      const paymentLink = await paymentGateway.createPaymentLink({
        orderId: order.orderId,
        amount: finalAmount * 100, // Convert to paise
        currency: "INR",
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        description: `Payment for Order ${order.orderId} - ${order.product} (${convConfig.discountPercent}% prepaid discount applied)`,
        expiryMinutes: convConfig.linkExpiryHours * 60,
        notes: {
          original_amount: order.amount.toString(),
          discount_percent: convConfig.discountPercent.toString(),
          discount_amount: discountAmount.toString(),
          product: order.product,
        },
      });

      if (!paymentLink.success) {
        return {
          success: false,
          orderId: order.orderId,
          originalAmount: order.amount,
          discountAmount,
          finalAmount,
          error: "Failed to generate payment link",
        };
      }

      // Send WhatsApp message if auto-send is enabled
      let messageSent = false;
      if (convConfig.autoSendEnabled) {
        const messageResult = await whatsappService.sendPaymentLinkMessage(
          order.customerPhone,
          {
            customer_name: order.customerName,
            order_id: order.orderId,
            original_amount: order.amount.toString(),
            discount: discountAmount.toString(),
            final_amount: finalAmount.toString(),
            payment_link: paymentLink.linkUrl,
          },
          COD_TEMPLATES.initial
            .replace("{{company}}", convConfig.businessName)
            .replace("{{discount_percent}}", convConfig.discountPercent.toString())
        );
        messageSent = messageResult.success;
      }

      return {
        success: true,
        orderId: order.orderId,
        paymentLinkUrl: paymentLink.linkUrl,
        paymentLinkId: paymentLink.linkId,
        originalAmount: order.amount,
        discountAmount,
        finalAmount,
        expiresAt: paymentLink.expiresAt,
        messageSent,
      };
    } catch (error: any) {
      return {
        success: false,
        orderId: order.orderId,
        originalAmount: order.amount,
        discountAmount,
        finalAmount,
        error: error.message,
      };
    }
  }

  /**
   * Send a reminder for pending conversion
   */
  async sendReminder(
    customerPhone: string,
    reminderNumber: number,
    variables: Record<string, string>,
    config?: Partial<ConversionConfig>
  ) {
    const convConfig = { ...this.defaultConfig, ...config };

    let template: string;
    switch (reminderNumber) {
      case 1:
        template = COD_TEMPLATES.reminder1;
        break;
      case 2:
        template = COD_TEMPLATES.reminder2;
        break;
      case 3:
        template = COD_TEMPLATES.finalReminder;
        break;
      default:
        template = COD_TEMPLATES.reminder2;
    }

    template = template.replace("{{company}}", convConfig.businessName);

    return whatsappService.sendMessage({
      to: customerPhone,
      message: template,
      templateVariables: variables,
    });
  }

  /**
   * Send payment success confirmation
   */
  async sendPaymentConfirmation(
    customerPhone: string,
    variables: Record<string, string>,
    config?: Partial<ConversionConfig>
  ) {
    const convConfig = { ...this.defaultConfig, ...config };
    const template = COD_TEMPLATES.paymentSuccess.replace(
      "{{company}}",
      convConfig.businessName
    );

    return whatsappService.sendMessage({
      to: customerPhone,
      message: template,
      templateVariables: variables,
    });
  }

  /**
   * Handle payment webhook - update conversion status
   */
  async handlePaymentSuccess(orderId: string, paymentId: string, amount: number) {
    // This would be called by the webhook handler
    // 1. Update CodConversion status to PAYMENT_SUCCESSFUL
    // 2. Update Order paymentMode from COD to PREPAID
    // 3. Cancel remaining scheduled reminders
    // 4. Send payment confirmation via WhatsApp
    // 5. Record analytics event
    console.log(
      `[COD Conversion] Payment successful for order ${orderId}: ₹${amount / 100}`
    );
  }

  /**
   * Handle payment link expiry
   */
  async handleLinkExpired(orderId: string, linkId: string) {
    // Update CodConversion status to LINK_EXPIRED
    // Cancel any remaining reminders
    console.log(`[COD Conversion] Link expired for order ${orderId}`);
  }

  /**
   * Get reminder schedule times
   */
  getReminderSchedule(config?: Partial<ConversionConfig>): number[] {
    const convConfig = { ...this.defaultConfig, ...config };
    return convConfig.reminderSchedule;
  }
}

// Singleton instance
export const codConversionService = new CodConversionService();
