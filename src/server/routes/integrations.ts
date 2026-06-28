import { Router, Request, Response } from "express";
import { integrationRegistry } from "../services/integrations";

export const integrationsRouter = Router();

// GET /api/integrations - List all available integrations
integrationsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const providers = integrationRegistry.getAllProviders().map(p => ({
      name: p.name,
      type: p.type,
      version: p.version,
      enabled: integrationRegistry.getConfig(p.name)?.enabled || false,
      lastSyncAt: integrationRegistry.getConfig(p.name)?.lastSyncAt,
    }));
    res.json({ success: true, data: { integrations: providers } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/integrations/:name/connect - Connect an integration
integrationsRouter.post("/:name/connect", async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { credentials, settings } = req.body;
    const provider = integrationRegistry.getProvider(name);
    if (!provider) return res.status(404).json({ success: false, error: { message: `Integration '${name}' not found` } });

    const config = {
      id: `int_${Date.now()}`, name, type: provider.type,
      enabled: true, credentials: credentials || {}, settings: settings || {},
    };
    await provider.initialize(config);
    integrationRegistry.setConfig(name, config);
    res.json({ success: true, message: `${name} connected` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/integrations/:name/test - Test connection
integrationsRouter.post("/:name/test", async (req: Request, res: Response) => {
  try {
    const provider = integrationRegistry.getProvider(req.params.name);
    if (!provider) return res.status(404).json({ success: false, error: { message: "Not found" } });
    const result = await provider.testConnection();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/integrations/:name/sync - Trigger manual sync
integrationsRouter.post("/:name/sync", async (req: Request, res: Response) => {
  try {
    const provider = integrationRegistry.getProvider(req.params.name);
    if (!provider) return res.status(404).json({ success: false, error: { message: "Not found" } });
    const result = await provider.syncOrders();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// POST /api/integrations/sync-all - Sync all enabled integrations
integrationsRouter.post("/sync-all", async (req: Request, res: Response) => {
  try {
    const results = await integrationRegistry.syncAll();
    res.json({ success: true, data: { results } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

// DELETE /api/integrations/:name - Disconnect
integrationsRouter.delete("/:name", async (req: Request, res: Response) => {
  try {
    const provider = integrationRegistry.getProvider(req.params.name);
    if (!provider) return res.status(404).json({ success: false, error: { message: "Not found" } });
    await provider.disconnect();
    res.json({ success: true, message: "Disconnected" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});
