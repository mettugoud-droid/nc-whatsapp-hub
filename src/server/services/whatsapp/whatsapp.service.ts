import { interpolateTemplate } from "../../../lib/utils";

/**
 * WhatsApp Service
 * 
 * Handles sending messages via Meta WhatsApp Cloud API.
 * Supports template-based messages and free-form text messages.
 */

interface SendMessageOptions {
  to: string; // Phone number with country code
  message: string;
  templateVariables?: Record<string, string>;
}

interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class WhatsAppService {
  private apiUrl: string;
  private phoneNumberId: string;
  private accessToken: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || "https://graph.facebook.com/v18.0";
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
  }

  /**
   * Send a text message to a WhatsApp number
   */
  async sendMessage(options: SendMessageOptions): Promise<SendMessageResult> {
    const { to, message, templateVariables } = options;

    // Interpolate template variables if provided
    const finalMessage = templateVariables
      ? interpolateTemplate(message, templateVariables)
      : message;

    // Clean phone number (remove spaces, ensure country code)
    const cleanPhone = this.cleanPhoneNumber(to);

    try {
      const response = await fetch(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: cleanPhone,
            type: "text",
            text: { body: finalMessage },
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.messages?.[0]?.id) {
        return {
          success: true,
          messageId: data.messages[0].id,
        };
      }

      return {
        success: false,
        error: data.error?.message || "Failed to send message",
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Network error",
      };
    }
  }

  /**
   * Send bulk messages with rate limiting
   */
  async sendBulkMessages(
    recipients: Array<{ phone: string; variables: Record<string, string> }>,
    messageTemplate: string,
    delayMs: number = 1000 // 1 second between messages by default
  ): Promise<{
    total: number;
    sent: number;
    failed: number;
    results: SendMessageResult[];
  }> {
    const results: SendMessageResult[] = [];
    let sent = 0;
    let failed = 0;

    for (const recipient of recipients) {
      const result = await this.sendMessage({
        to: recipient.phone,
        message: messageTemplate,
        templateVariables: recipient.variables,
      });

      results.push(result);
      if (result.success) sent++;
      else failed++;

      // Rate limiting
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    return {
      total: recipients.length,
      sent,
      failed,
      results,
    };
  }

  /**
   * Send COD conversion payment link message
   */
  async sendPaymentLinkMessage(
    phone: string,
    variables: {
      customer_name: string;
      order_id: string;
      original_amount: string;
      discount: string;
      final_amount: string;
      payment_link: string;
    },
    templateContent: string
  ): Promise<SendMessageResult> {
    return this.sendMessage({
      to: phone,
      message: templateContent,
      templateVariables: variables,
    });
  }

  /**
   * Clean and validate phone number
   */
  private cleanPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, "");

    // Add India country code if not present
    if (cleaned.length === 10) {
      cleaned = "91" + cleaned;
    }

    // Remove leading + if present in original
    if (cleaned.startsWith("0")) {
      cleaned = "91" + cleaned.substring(1);
    }

    return cleaned;
  }
}

// Singleton instance
export const whatsappService = new WhatsAppService();
