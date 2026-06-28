import { Router, Request, Response } from "express";
import { inboxService } from "../services/inbox/inbox.service";

export const inboxRouter = Router();

// GET /api/inbox/conversations
inboxRouter.get("/conversations", async (req: Request, res: Response) => {
  try {
    const { status, assignedTo, tag, search } = req.query;
    const conversations = inboxService.getConversations({
      status: status as any, assignedTo: assignedTo as string,
      tag: tag as string, search: search as string,
    });
    res.json({ success: true, data: { conversations } });
  } catch (error: any) { res.status(500).json({ success: false, error: { message: error.message } }); }
});

// GET /api/inbox/conversations/:id/messages
inboxRouter.get("/conversations/:id/messages", async (req: Request, res: Response) => {
  const messages = inboxService.getMessages(req.params.id);
  res.json({ success: true, data: { messages } });
});

// POST /api/inbox/conversations/:id/send
inboxRouter.post("/conversations/:id/send", async (req: Request, res: Response) => {
  try {
    const { content, type, sentBy } = req.body;
    const msg = inboxService.sendMessage(req.params.id, content, sentBy || "system", type);
    res.json({ success: true, data: msg });
  } catch (error: any) { res.status(500).json({ success: false, error: { message: error.message } }); }
});

// POST /api/inbox/conversations/:id/note
inboxRouter.post("/conversations/:id/note", async (req: Request, res: Response) => {
  const { content, userId } = req.body;
  const note = inboxService.addNote(req.params.id, content, userId || "system");
  res.json({ success: true, data: note });
});

// POST /api/inbox/conversations/:id/assign
inboxRouter.post("/conversations/:id/assign", async (req: Request, res: Response) => {
  const { employeeId, employeeName } = req.body;
  inboxService.assignConversation(req.params.id, employeeId, employeeName);
  res.json({ success: true, message: "Assigned" });
});

// PUT /api/inbox/conversations/:id/status
inboxRouter.put("/conversations/:id/status", async (req: Request, res: Response) => {
  inboxService.updateStatus(req.params.id, req.body.status);
  res.json({ success: true, message: "Status updated" });
});

// POST /api/inbox/incoming - Handle incoming WhatsApp message
inboxRouter.post("/incoming", async (req: Request, res: Response) => {
  const { phone, name, message, type, mediaUrl } = req.body;
  const result = inboxService.handleIncomingMessage(phone, name, message, type, mediaUrl);
  res.json({ success: true, data: result });
});

// GET /api/inbox/stats
inboxRouter.get("/stats", async (req: Request, res: Response) => {
  res.json({ success: true, data: inboxService.getStats() });
});

// GET /api/inbox/quick-replies
inboxRouter.get("/quick-replies", async (req: Request, res: Response) => {
  res.json({ success: true, data: inboxService.getQuickReplies() });
});

// GET /api/inbox/canned-responses
inboxRouter.get("/canned-responses", async (req: Request, res: Response) => {
  res.json({ success: true, data: inboxService.getCannedResponses() });
});
