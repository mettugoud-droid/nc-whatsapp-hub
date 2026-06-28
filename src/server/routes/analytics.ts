import { Router, Request, Response } from "express";

export const analyticsRouter = Router();

// GET /api/analytics/dashboard - Dashboard overview metrics
analyticsRouter.get("/dashboard", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        messagesToday: { sent: 1284, delivered: 1235, failed: 49, pending: 156 },
        campaignsRunning: 5,
        deliveryRate: 96.2,
        responses: 312,
        conversions: 89,
        revenue: 124500,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/analytics/business-intelligence - BI metrics
analyticsRouter.get("/business-intelligence", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        orders: { total: 845, cod: 380, prepaid: 465 },
        revenue: { total: 578000, thisMonth: 578000, lastMonth: 534000 },
        conversion: { codToPrepaid: 57.1, campaignROI: 3.2 },
        customers: { total: 1245, returning: 529, repeatRate: 42.5, avgLTV: 4250 },
        topProducts: [
          { name: "Premium Cashews", revenue: 125000, orders: 234 },
          { name: "Organic Almonds", revenue: 98000, orders: 189 },
          { name: "Trail Mix Combo", revenue: 87000, orders: 165 },
        ],
        couponUsage: { total: 1245, discountGiven: 62000 },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/analytics/messages - Message analytics
analyticsRouter.get("/messages", async (req: Request, res: Response) => {
  try {
    const { period = "7d" } = req.query;
    res.json({
      success: true,
      data: {
        period,
        daily: [
          { date: "2024-10-14", sent: 245, delivered: 230, failed: 15 },
          { date: "2024-10-15", sent: 312, delivered: 298, failed: 14 },
          { date: "2024-10-16", sent: 189, delivered: 180, failed: 9 },
          { date: "2024-10-17", sent: 456, delivered: 440, failed: 16 },
          { date: "2024-10-18", sent: 523, delivered: 510, failed: 13 },
          { date: "2024-10-19", sent: 367, delivered: 355, failed: 12 },
          { date: "2024-10-20", sent: 290, delivered: 278, failed: 12 },
        ],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/analytics/campaigns - Campaign performance analytics
analyticsRouter.get("/campaigns", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        campaigns: [
          { name: "Festival Offer", sent: 1200, conversions: 180, revenue: 45000, deliveryRate: 95.2 },
          { name: "COD Reminder", sent: 800, conversions: 320, revenue: 85000, deliveryRate: 97.5 },
          { name: "Reorder", sent: 560, conversions: 95, revenue: 28000, deliveryRate: 94.8 },
        ],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/analytics/cod-conversion - COD conversion analytics
analyticsRouter.get("/cod-conversion", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        totalCod: 380,
        converted: 217,
        conversionRate: 57.1,
        revenueFromConversions: 485200,
        avgDiscount: 5,
        totalDiscountGiven: 24260,
        bestPerformingTemplate: "5% Discount Offer",
        bestSendingTime: "10:00 AM - 12:00 PM",
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/analytics/smart-insights - AI-generated insights
analyticsRouter.get("/smart-insights", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        insights: [
          { type: "positive", message: "Payment reminder increased prepaid orders by 18%", metric: "+18%" },
          { type: "negative", message: "COD conversion dropped by 12% this week", metric: "-12%" },
          { type: "positive", message: "Review campaign generated 125 new reviews", metric: "125" },
          { type: "info", message: "Customers purchasing Almonds are 2.3x more likely to reorder Cashews", metric: "2.3x" },
          { type: "positive", message: "Best sending time: 10 AM - 12 PM (42% higher open rate)", metric: "+42%" },
        ],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});
