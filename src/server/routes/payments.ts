import { Router, Request, Response } from "express";
import { paymentGateway } from "../services/payment/payment-gateway.service";

export const paymentsRouter = Router();

// GET /api/payments - List payments
paymentsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, status, provider } = req.query;
    res.json({
      success: true,
      data: { payments: [], pagination: { page: Number(page), limit: Number(limit), total: 0 } },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/payments/create-link - Create payment link
paymentsRouter.post("/create-link", async (req: Request, res: Response) => {
  try {
    const { orderId, amount, customerName, customerPhone, customerEmail, description, expiryMinutes } = req.body;

    if (!orderId || !amount || !customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        error: { message: "Order ID, amount, customer name, and phone are required" },
      });
    }

    const result = await paymentGateway.createPaymentLink({
      orderId,
      amount: amount * 100, // Convert to paise
      currency: "INR",
      customerName,
      customerPhone,
      customerEmail,
      description: description || `Payment for Order ${orderId}`,
      expiryMinutes: expiryMinutes || 1440,
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/payments/link/:linkId/status - Get payment link status
paymentsRouter.get("/link/:linkId/status", async (req: Request, res: Response) => {
  try {
    const { linkId } = req.params;
    const status = await paymentGateway.getPaymentLinkStatus(linkId);
    res.json({ success: true, data: status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/payments/test-connection - Test gateway connection
paymentsRouter.post("/test-connection", async (req: Request, res: Response) => {
  try {
    const result = await paymentGateway.testConnection();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/payments/providers - List available providers
paymentsRouter.get("/providers", async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      active: paymentGateway.getActiveProviderName(),
      available: paymentGateway.getAvailableProviders(),
    },
  });
});

// POST /api/payments/provider/switch - Switch active provider
paymentsRouter.post("/provider/switch", async (req: Request, res: Response) => {
  try {
    const { provider } = req.body;
    paymentGateway.setActiveProvider(provider);
    res.json({ success: true, message: `Switched to ${provider}` });
  } catch (error: any) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/payments/refund - Process refund
paymentsRouter.post("/refund", async (req: Request, res: Response) => {
  try {
    const { paymentId, amount, reason } = req.body;
    const result = await paymentGateway.refund({ paymentId, amount, reason });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});
