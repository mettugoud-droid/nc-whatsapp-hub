import { Router, Request, Response } from "express";
import { whatsappService } from "../services/whatsapp/whatsapp.service";

export const messagesRouter = Router();

// POST /api/messages/send - Send individual message
messagesRouter.post("/send", async (req: Request, res: Response) => {
  try {
    const { phone, message, customerName, templateVariables } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        error: { message: "Phone number and message are required" },
      });
    }

    const result = await whatsappService.sendMessage({
      to: phone,
      message,
      templateVariables: {
        customer_name: customerName || "",
        ...templateVariables,
      },
    });

    res.json({
      success: result.success,
      data: {
        messageId: result.messageId,
        status: result.success ? "sent" : "failed",
        error: result.error,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// POST /api/messages/bulk - Send bulk messages
messagesRouter.post("/bulk", async (req: Request, res: Response) => {
  try {
    const { recipients, messageTemplate, delayMs } = req.body;

    if (!recipients || !messageTemplate) {
      return res.status(400).json({
        success: false,
        error: { message: "Recipients and message template are required" },
      });
    }

    const result = await whatsappService.sendBulkMessages(
      recipients,
      messageTemplate,
      delayMs
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// GET /api/messages - List messages
messagesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, status, contactId, campaignId } = req.query;

    // In production, fetch from Prisma with filters
    res.json({
      success: true,
      data: {
        messages: [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: 0,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// GET /api/messages/:id - Get message details
messagesRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // In production, fetch from Prisma
    res.json({
      success: true,
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});
