import { Router, Request, Response } from "express";
import { ticketService } from "../services/tickets/ticket.service";

export const ticketsRouter = Router();

// GET /api/tickets
ticketsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { status, priority, category, assignedTo, customerId } = req.query;
    const tickets = ticketService.getTickets({
      status: status as any, priority: priority as any,
      category: category as any, assignedTo: assignedTo as string,
      customerId: customerId as string,
    });
    res.json({ success: true, data: { tickets } });
  } catch (error: any) { res.status(500).json({ success: false, error: { message: error.message } }); }
});

// POST /api/tickets
ticketsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const ticket = ticketService.createTicket(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (error: any) { res.status(500).json({ success: false, error: { message: error.message } }); }
});

// POST /api/tickets/auto-detect - Auto-create from message
ticketsRouter.post("/auto-detect", async (req: Request, res: Response) => {
  const { message, customerId, customerName, customerPhone, orderId, conversationId } = req.body;
  const ticket = ticketService.autoCreateFromMessage(message, customerId, customerName, customerPhone, orderId, conversationId);
  if (ticket) res.status(201).json({ success: true, data: ticket });
  else res.json({ success: true, data: null, message: "No ticket needed" });
});

// PUT /api/tickets/:id/status
ticketsRouter.put("/:id/status", async (req: Request, res: Response) => {
  ticketService.updateStatus(req.params.id, req.body.status, req.body.userId);
  res.json({ success: true, message: "Status updated" });
});

// POST /api/tickets/:id/assign
ticketsRouter.post("/:id/assign", async (req: Request, res: Response) => {
  ticketService.assignTicket(req.params.id, req.body.employeeId, req.body.employeeName);
  res.json({ success: true, message: "Assigned" });
});

// POST /api/tickets/:id/note
ticketsRouter.post("/:id/note", async (req: Request, res: Response) => {
  ticketService.addNote(req.params.id, req.body.content, req.body.userId, req.body.userName, req.body.isInternal);
  res.json({ success: true, message: "Note added" });
});

// GET /api/tickets/stats
ticketsRouter.get("/stats", async (req: Request, res: Response) => {
  res.json({ success: true, data: ticketService.getStats() });
});
