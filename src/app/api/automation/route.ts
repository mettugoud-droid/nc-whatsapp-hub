import { NextRequest, NextResponse } from "next/server";
import { automationEngine } from "@/server/services/automation/automation-engine";

// GET /api/automation - Get automation status and metrics
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view"); // metrics, workflows, messages, rules

    if (view === "metrics") {
      return NextResponse.json({ success: true, data: automationEngine.getMetrics() });
    }
    if (view === "workflows") {
      return NextResponse.json({ success: true, data: { workflows: automationEngine.getWorkflowHistory() } });
    }
    if (view === "messages") {
      return NextResponse.json({ success: true, data: { messages: automationEngine.getScheduledMessages() } });
    }
    if (view === "rules") {
      return NextResponse.json({ success: true, data: { rules: automationEngine.getRules() } });
    }

    // Default: return overview
    return NextResponse.json({
      success: true,
      data: {
        metrics: automationEngine.getMetrics(),
        rules: automationEngine.getRules(),
        isPaused: automationEngine.isPaused(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/automation - Trigger an automation event or admin action
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ...params } = body;

    switch (action) {
      case "trigger_event": {
        const { trigger, customerId, customerPhone, customerName, orderId, productName, metadata } = params;
        if (!trigger || !customerPhone) {
          return NextResponse.json({ success: false, error: "trigger and customerPhone required" }, { status: 400 });
        }
        const event = {
          id: `evt_${Date.now()}`,
          trigger,
          customerId: customerId || "",
          customerPhone,
          customerName: customerName || "",
          orderId,
          productName,
          metadata: metadata || {},
          createdAt: new Date(),
          status: "pending" as const,
        };
        const workflow = await automationEngine.processEvent(event);
        return NextResponse.json({ success: true, data: { workflow, event } });
      }

      case "handle_reply": {
        const { phone, message } = params;
        if (!phone || !message) {
          return NextResponse.json({ success: false, error: "phone and message required" }, { status: 400 });
        }
        const result = automationEngine.handleCustomerReply(phone, message);
        return NextResponse.json({ success: true, data: result });
      }

      case "stop_customer": {
        const { phone, reason } = params;
        const stopped = automationEngine.stopWorkflowsForCustomer(phone, reason || "Manual stop");
        return NextResponse.json({ success: true, data: { stopped } });
      }

      case "stop_order": {
        const { orderId, reason } = params;
        const stopped = automationEngine.stopWorkflowsForOrder(orderId, reason || "Order event");
        return NextResponse.json({ success: true, data: { stopped } });
      }

      case "pause": {
        automationEngine.pauseAutomation();
        return NextResponse.json({ success: true, message: "Automation paused" });
      }

      case "resume": {
        automationEngine.resumeAutomation();
        return NextResponse.json({ success: true, message: "Automation resumed" });
      }

      case "blacklist": {
        automationEngine.blacklistCustomer(params.phone);
        return NextResponse.json({ success: true, message: `${params.phone} blacklisted` });
      }

      case "whitelist": {
        automationEngine.whitelistCustomer(params.phone);
        return NextResponse.json({ success: true, message: `${params.phone} whitelisted` });
      }

      case "update_rules": {
        automationEngine.updateRules(params.rules);
        return NextResponse.json({ success: true, message: "Rules updated" });
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
