import { Router, Request, Response } from "express";
import { uploadEngine } from "../services/upload/upload-engine.service";

export const uploadRouter = Router();

// POST /api/upload/preview - Parse and preview file before import
uploadRouter.post("/preview", async (req: Request, res: Response) => {
  try {
    const { content, fileName } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: { message: "File content is required" },
      });
    }

    const preview = await uploadEngine.parseCSVPreview(content);
    const format = uploadEngine.detectFormat(fileName || "data.csv");

    res.json({
      success: true,
      data: { ...preview, format },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/upload/start - Start import job
uploadRouter.post("/start", async (req: Request, res: Response) => {
  try {
    const { fileName, fileSize, data, mappings, options, uploadedBy } = req.body;

    if (!data || !mappings) {
      return res.status(400).json({
        success: false,
        error: { message: "Data and mappings are required" },
      });
    }

    const job = uploadEngine.createJob(
      fileName || "import.csv",
      fileSize || 0,
      data.length,
      uploadedBy || "system"
    );

    // Process in background (non-blocking)
    const result = await uploadEngine.processUpload(job.id, data, mappings, options);

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/upload/job/:id - Get job status
uploadRouter.get("/job/:id", async (req: Request, res: Response) => {
  try {
    const job = uploadEngine.getJobStatus(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: { message: "Job not found" } });
    }
    res.json({ success: true, data: job });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/upload/history - Get import history
uploadRouter.get("/history", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const history = uploadEngine.getImportHistory(limit);
    res.json({ success: true, data: { imports: history } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/upload/job/:id/errors - Download error log
uploadRouter.get("/job/:id/errors", async (req: Request, res: Response) => {
  try {
    const errorLog = uploadEngine.generateErrorLog(req.params.id);
    if (!errorLog) {
      return res.status(404).json({ success: false, error: { message: "Job not found" } });
    }
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=error-log-${req.params.id}.csv`);
    res.send(errorLog);
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/upload/mapping-templates - Save mapping template
uploadRouter.post("/mapping-templates", async (req: Request, res: Response) => {
  try {
    const { name, mappings, source } = req.body;
    const template = uploadEngine.saveMappingTemplate(name, mappings, source || "custom");
    res.status(201).json({ success: true, data: template });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// GET /api/upload/mapping-templates - Get saved templates
uploadRouter.get("/mapping-templates", async (req: Request, res: Response) => {
  try {
    const templates = uploadEngine.getMappingTemplates();
    res.json({ success: true, data: { templates } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});
