import { Router, Request, Response } from "express";
import { customerCRM } from "../services/crm/customer-crm.service";

export const crmRouter = Router();

// GET /api/crm/customers - List customers with profiles
crmRouter.get("/customers", async (req: Request, res: Response) => {
  try {
    const { segment, search, page = 1, limit = 50 } = req.query;
    // In production: query Prisma with filters and join order/message data
    res.json({
      success: true,
      data: { customers: [], pagination: { page: Number(page), limit: Number(limit), total: 0 } },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/crm/customers/:id/profile - Full customer profile
crmRouter.get("/customers/:id/profile", async (req: Request, res: Response) => {
  try {
    // In production: aggregate all customer data into a full profile
    res.json({ success: true, data: null });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/crm/segments - Get segment breakdown
crmRouter.get("/segments", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        segments: {
          new: { count: 45, revenue: 78000 },
          active: { count: 312, revenue: 850000 },
          vip: { count: 89, revenue: 1250000 },
          at_risk: { count: 56, revenue: 180000 },
          lost: { count: 128, revenue: 0 },
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/crm/customers/:id/note - Add note to customer
crmRouter.post("/customers/:id/note", async (req: Request, res: Response) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ success: false, error: { message: "Note is required" } });
    res.status(201).json({ success: true, message: "Note added" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/crm/customers/:id/orders - Customer order history
crmRouter.get("/customers/:id/orders", async (req: Request, res: Response) => {
  res.json({ success: true, data: { orders: [] } });
});

// GET /api/crm/customers/:id/messages - Customer WhatsApp history
crmRouter.get("/customers/:id/messages", async (req: Request, res: Response) => {
  res.json({ success: true, data: { messages: [] } });
});
