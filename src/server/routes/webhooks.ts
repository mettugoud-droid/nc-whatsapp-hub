import { Router, Request, Response } from "express";
import { paymentGateway } from "../services/payment/payment-gateway.service";
import { codConversionService } from "../services/cod-conversion/cod-conversion.service";

export const webhookRouter = Router();

/**
 * POST /api/webhooks/razorpay
 * 
 * Handles Razorpay webhook events for payment status updates.
 * Verifies webhook signature before processing.
 * 
 * Events handled:
 * - payment_link.paid: Payment link was paid successfully
 * - payment_link.expired: Payment link has expired
 * - payment.captured: Payment was captured successfully
 * - payment.failed: Payment attempt failed
 */
webhookRouter.post("/razorpay", async (req: Request, res: Response) => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

    if (!signature) {
      console.warn("[Webhook] Missing Razorpay signature header");
      return res.status(400).json({ error: "Missing signature" });
    }

    // Verify webhook signature
    const verification = paymentGateway.verifyWebhook(
      JSON.stringify(req.body),
      signature,
      webhookSecret
    );

    if (!verification.isValid) {
      console.warn("[Webhook] Invalid Razorpay signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const { event, payload } = verification;

    console.log(`[Webhook] Razorpay event: ${event}`);

    switch (event) {
      case "payment_link.paid": {
        const linkPayload = payload.payment_link?.entity;
        const orderId = linkPayload?.notes?.order_id;
        const paymentId = linkPayload?.payments?.[0]?.payment_id;
        const amount = linkPayload?.amount;

        if (orderId) {
          await codConversionService.handlePaymentSuccess(orderId, paymentId, amount);
          
          // In production:
          // 1. Update CodConversion status to PAYMENT_SUCCESSFUL
          // 2. Update Order paymentMode from COD to PREPAID
          // 3. Cancel remaining reminders
          // 4. Send WhatsApp confirmation
          // 5. Record in audit log
          // 6. Refresh analytics
        }
        break;
      }

      case "payment_link.expired": {
        const linkPayload = payload.payment_link?.entity;
        const orderId = linkPayload?.notes?.order_id;
        const linkId = linkPayload?.id;

        if (orderId) {
          await codConversionService.handleLinkExpired(orderId, linkId);
          
          // In production:
          // 1. Update CodConversion status to LINK_EXPIRED
          // 2. Cancel scheduled reminders
          // 3. Record in audit log
        }
        break;
      }

      case "payment.captured": {
        const paymentPayload = payload.payment?.entity;
        console.log(`[Webhook] Payment captured: ${paymentPayload?.id} - ₹${paymentPayload?.amount / 100}`);
        
        // In production:
        // 1. Update Payment record status to CAPTURED
        // 2. Record payment method used
        // 3. Audit log
        break;
      }

      case "payment.failed": {
        const paymentPayload = payload.payment?.entity;
        console.log(`[Webhook] Payment failed: ${paymentPayload?.id} - ${paymentPayload?.error_description}`);
        
        // In production:
        // 1. Update Payment record status to FAILED
        // 2. Record failure reason
        // 3. Potentially send a follow-up message
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${event}`);
    }

    // Always respond 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error(`[Webhook] Error processing Razorpay webhook: ${error.message}`);
    // Still return 200 to prevent Razorpay from retrying
    res.status(200).json({ received: true, error: error.message });
  }
});

/**
 * POST /api/webhooks/whatsapp
 * 
 * Handles WhatsApp Cloud API webhook events for message status updates.
 * 
 * Events handled:
 * - message status updates (sent, delivered, read, failed)
 * - incoming messages
 */
webhookRouter.post("/whatsapp", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // WhatsApp webhook verification (GET request handled by verification endpoint)
    if (body.object === "whatsapp_business_account") {
      const entries = body.entry || [];

      for (const entry of entries) {
        const changes = entry.changes || [];

        for (const change of changes) {
          if (change.field === "messages") {
            const value = change.value;

            // Handle message status updates
            if (value.statuses) {
              for (const status of value.statuses) {
                console.log(
                  `[WhatsApp] Message ${status.id} status: ${status.status}`
                );
                // In production:
                // Update message record status in database
                // Update campaign metrics
              }
            }

            // Handle incoming messages
            if (value.messages) {
              for (const message of value.messages) {
                console.log(
                  `[WhatsApp] Incoming message from ${message.from}: ${message.text?.body || message.type}`
                );
                // In production:
                // Store incoming message
                // Update response metrics
                // Trigger automated responses if configured
              }
            }
          }
        }
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (error: any) {
    console.error(`[Webhook] Error processing WhatsApp webhook: ${error.message}`);
    res.status(200).json({ status: "ok" });
  }
});

// GET /api/webhooks/whatsapp - Webhook verification
webhookRouter.get("/whatsapp", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "nature_crates_verify";

  if (mode === "subscribe" && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Forbidden");
  }
});
