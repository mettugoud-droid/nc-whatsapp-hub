import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { messagesRouter } from "./routes/messages";
import { campaignsRouter } from "./routes/campaigns";
import { contactsRouter } from "./routes/contacts";
import { templatesRouter } from "./routes/templates";
import { ordersRouter } from "./routes/orders";
import { paymentsRouter } from "./routes/payments";
import { codConversionRouter } from "./routes/cod-conversion";
import { analyticsRouter } from "./routes/analytics";
import { settingsRouter } from "./routes/settings";
import { webhookRouter } from "./routes/webhooks";
import { errorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/request-logger";

const app = express();
const PORT = process.env.API_PORT || 4000;

// Middleware
app.use(cors({ origin: process.env.NEXTAUTH_URL || "http://localhost:3000" }));
app.use(express.json());
app.use(requestLogger);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/campaigns", campaignsRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/cod-conversion", codConversionRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/webhooks", webhookRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Nature's Crates WhatsApp Hub API running on port ${PORT}`);
});

export default app;
