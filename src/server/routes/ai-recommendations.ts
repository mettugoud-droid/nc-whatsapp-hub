import { Router, Request, Response } from "express";
import { aiRecommendations } from "../services/ai/ai-recommendations.service";

export const aiRouter = Router();

// GET /api/ai/recommendations - Get AI-generated recommendations
aiRouter.get("/recommendations", async (req: Request, res: Response) => {
  try {
    const recommendations = aiRecommendations.generateRecommendations();
    res.json({ success: true, data: { recommendations } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/ai/best-times - Get optimal sending times
aiRouter.get("/best-times", async (req: Request, res: Response) => {
  try {
    const times = aiRecommendations.analyzeBestSendingTimes();
    res.json({ success: true, data: { timeSlots: times } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/ai/template-performance - Template performance analysis
aiRouter.get("/template-performance", async (req: Request, res: Response) => {
  try {
    const performance = aiRecommendations.analyzeTemplatePerformance();
    res.json({ success: true, data: { templates: performance } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});
