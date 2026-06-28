import { Router, Request, Response } from "express";
import { workflowEngine } from "../services/workflow/workflow-engine.service";

export const workflowsRouter = Router();

// GET /api/workflows
workflowsRouter.get("/", async (req: Request, res: Response) => {
  res.json({ success: true, data: { workflows: workflowEngine.getWorkflows() } });
});

// GET /api/workflows/templates
workflowsRouter.get("/templates", async (req: Request, res: Response) => {
  res.json({ success: true, data: { templates: workflowEngine.getTemplates() } });
});

// POST /api/workflows
workflowsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const wf = workflowEngine.createWorkflow(req.body);
    res.status(201).json({ success: true, data: wf });
  } catch (error: any) { res.status(500).json({ success: false, error: { message: error.message } }); }
});

// GET /api/workflows/:id
workflowsRouter.get("/:id", async (req: Request, res: Response) => {
  const wf = workflowEngine.getWorkflow(req.params.id);
  if (!wf) return res.status(404).json({ success: false, error: { message: "Not found" } });
  res.json({ success: true, data: wf });
});

// PUT /api/workflows/:id/toggle
workflowsRouter.put("/:id/toggle", async (req: Request, res: Response) => {
  workflowEngine.toggleWorkflow(req.params.id, req.body.active);
  res.json({ success: true, message: "Updated" });
});

// POST /api/workflows/:id/execute
workflowsRouter.post("/:id/execute", async (req: Request, res: Response) => {
  try {
    const result = await workflowEngine.executeWorkflow(req.params.id, req.body.context || {});
    res.json({ success: true, data: result });
  } catch (error: any) { res.status(500).json({ success: false, error: { message: error.message } }); }
});
