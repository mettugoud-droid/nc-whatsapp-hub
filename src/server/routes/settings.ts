import { Router, Request, Response } from "express";
import { paymentGateway } from "../services/payment/payment-gateway.service";

export const settingsRouter = Router();

// GET /api/settings - Get all settings
settingsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    // In production, fetch from database, decrypt sensitive values
    res.json({
      success: true,
      data: { settings: [] },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// PUT /api/settings/payment - Update payment gateway settings
settingsRouter.put("/payment", async (req: Request, res: Response) => {
  try {
    const { keyId, keySecret, webhookSecret, sandbox, companyName, companyLogo, successUrl, failureUrl } = req.body;

    if (!keyId || !keySecret) {
      return res.status(400).json({
        success: false,
        error: { message: "Key ID and Key Secret are required" },
      });
    }

    // Initialize payment gateway with new credentials
    paymentGateway.initializeProvider({
      keyId,
      keySecret,
      webhookSecret,
      sandbox: sandbox !== false,
      companyName: companyName || "Nature's Crates",
      companyLogo,
    });

    // In production, encrypt and save to database
    res.json({ success: true, message: "Payment settings updated" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// PUT /api/settings/whatsapp - Update WhatsApp API settings
settingsRouter.put("/whatsapp", async (req: Request, res: Response) => {
  try {
    const { phoneNumberId, accessToken, businessAccountId, apiVersion } = req.body;

    if (!phoneNumberId || !accessToken) {
      return res.status(400).json({
        success: false,
        error: { message: "Phone Number ID and Access Token are required" },
      });
    }

    // In production, encrypt and save to database
    res.json({ success: true, message: "WhatsApp settings updated" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// PUT /api/settings/conversion - Update COD conversion settings
settingsRouter.put("/conversion", async (req: Request, res: Response) => {
  try {
    const { discountPercent, linkExpiryHours, autoSendEnabled, reminderSchedule, businessName, supportNumber } = req.body;

    // In production, save to database
    res.json({ success: true, message: "Conversion settings updated" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/settings/payment/test - Test payment gateway connection
settingsRouter.post("/payment/test", async (req: Request, res: Response) => {
  try {
    const result = await paymentGateway.testConnection();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});
