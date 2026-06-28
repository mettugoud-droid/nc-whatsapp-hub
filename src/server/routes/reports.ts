import { Router, Request, Response } from "express";
import { reportEngine } from "../services/reports/report-engine.service";

export const reportsRouter = Router();

// GET /api/reports/templates - Get available report templates
reportsRouter.get("/templates", async (req: Request, res: Response) => {
  try {
    const templates = reportEngine.getTemplates();
    res.json({ success: true, data: { templates } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/reports/generate - Generate a report
reportsRouter.post("/generate", async (req: Request, res: Response) => {
  try {
    const { templateId, format = "csv", filters } = req.body;
    if (!templateId) {
      return res.status(400).json({ success: false, error: { message: "Template ID required" } });
    }
    const data = await reportEngine.generateReport(templateId, filters);
    const exported = await reportEngine.exportReport(data, format);
    res.json({ success: true, data: { fileName: exported.fileName, report: data } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/reports/schedule - Schedule a report
reportsRouter.post("/schedule", async (req: Request, res: Response) => {
  try {
    const { name, type, format, schedule, recipients, filters } = req.body;
    const config = reportEngine.scheduleReport({
      name, type, description: "", format: format || "excel",
      schedule: schedule || "weekly", recipients: recipients || [],
      filters, isActive: true,
    });
    res.status(201).json({ success: true, data: config });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/reports/scheduled - Get scheduled reports
reportsRouter.get("/scheduled", async (req: Request, res: Response) => {
  try {
    const reports = reportEngine.getScheduledReports();
    res.json({ success: true, data: { reports } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/reports/history - Generated report history
reportsRouter.get("/history", async (req: Request, res: Response) => {
  try {
    const reports = reportEngine.getGeneratedReports();
    res.json({ success: true, data: { reports } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});
