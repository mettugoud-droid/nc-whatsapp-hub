import { Router, Request, Response } from "express";
import { codConversionService } from "../services/cod-conversion/cod-conversion.service";

export const codConversionRouter = Router();

// GET /api/cod-conversion - List COD conversions
codConversionRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    res.json({
      success: true,
      data: { conversions: [], pagination: { page: Number(page), limit: Number(limit), total: 0 } },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/cod-conversion/process - Process a COD order for conversion
codConversionRouter.post("/process", async (req: Request, res: Response) => {
  try {
    const { orderId, customerName, customerPhone, customerEmail, product, amount } = req.body;

    if (!orderId || !customerName || !customerPhone || !amount) {
      return res.status(400).json({
        success: false,
        error: { message: "Order ID, customer name, phone, and amount are required" },
      });
    }

    const result = await codConversionService.processOrder({
      orderId,
      customerName,
      customerPhone,
      customerEmail,
      product: product || "Order",
      amount,
    });

    res.json({ success: result.success, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/cod-conversion/bulk-process - Process multiple COD orders
codConversionRouter.post("/bulk-process", async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;

    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({
        success: false,
        error: { message: "Orders array is required" },
      });
    }

    const results = [];
    for (const order of orders) {
      const result = await codConversionService.processOrder(order);
      results.push(result);
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    res.json({
      success: true,
      data: { total: orders.length, successful, failed, results },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/cod-conversion/:id/send-reminder - Send reminder for a conversion
codConversionRouter.post("/:id/send-reminder", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reminderNumber, phone, variables } = req.body;

    const result = await codConversionService.sendReminder(
      phone,
      reminderNumber || 1,
      variables
    );

    res.json({ success: result.success, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/cod-conversion/stats - Get conversion statistics
codConversionRouter.get("/stats", async (req: Request, res: Response) => {
  try {
    // In production, aggregate from database
    res.json({
      success: true,
      data: {
        totalCodOrders: 156,
        convertedToPrepaid: 89,
        conversionRate: 57.1,
        revenueCollected: 185400,
        pendingPayments: 45,
        expiredLinks: 12,
        failedPayments: 10,
        totalDiscountGiven: 9250,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/cod-conversion/:id - Get conversion details
codConversionRouter.get("/:id", async (req: Request, res: Response) => {
  res.json({ success: true, data: null });
});
