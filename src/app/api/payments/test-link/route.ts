import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/payments/test-link - Create a test Razorpay payment link
export async function POST(req: NextRequest) {
  try {
    // Get Razorpay credentials from database
    const settings = await prisma.setting.findMany({ where: { category: "payment" } });
    const getVal = (key: string) => settings.find(s => s.key === key)?.value || "";

    const keyId = getVal("razorpay_key_id");
    const keySecret = getVal("razorpay_key_secret");

    if (!keyId || !keySecret) {
      return NextResponse.json({
        success: false,
        error: "Razorpay credentials not configured. Go to Settings → Payment Gateway.",
      }, { status: 400 });
    }

    const body = await req.json();
    const {
      amount = 100, // Default ₹1 test
      customerName = "Test Customer",
      customerPhone = "9876543210",
      description = "Test Payment Link from WhatsApp Hub",
      orderId = "TEST-" + Date.now(),
    } = body;

    // Create payment link via Razorpay API
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const expireBy = Math.floor(Date.now() / 1000) + 48 * 60 * 60; // 48 hours

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/payment_links", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        accept_partial: false,
        description,
        customer: {
          name: customerName,
          contact: `+91${customerPhone.replace(/\D/g, "").slice(-10)}`,
        },
        notify: { sms: false, email: false },
        reminder_enable: false,
        expire_by: expireBy,
        notes: {
          order_id: orderId,
          source: "whatsapp_hub",
        },
      }),
    });

    const data = await razorpayResponse.json();

    if (razorpayResponse.ok) {
      return NextResponse.json({
        success: true,
        data: {
          paymentLinkId: data.id,
          paymentLinkUrl: data.short_url,
          amount: data.amount / 100,
          currency: data.currency,
          status: data.status,
          expiresAt: new Date(expireBy * 1000).toISOString(),
          description: data.description,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        error: data.error?.description || data.message || "Razorpay API error",
        details: data,
      }, { status: razorpayResponse.status });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET /api/payments/test-link - Quick test connection
export async function GET() {
  try {
    const settings = await prisma.setting.findMany({ where: { category: "payment" } });
    const getVal = (key: string) => settings.find(s => s.key === key)?.value || "";
    const keyId = getVal("razorpay_key_id");
    const keySecret = getVal("razorpay_key_secret");

    if (!keyId || !keySecret) {
      return NextResponse.json({ success: false, error: "Razorpay not configured" }, { status: 400 });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/payment_links?count=1", {
      headers: { "Authorization": `Basic ${auth}` },
    });

    if (res.ok) {
      return NextResponse.json({ success: true, message: "Razorpay connection successful ✅", keyId });
    } else {
      const data = await res.json();
      return NextResponse.json({ success: false, error: data.error?.description || "Connection failed", status: res.status });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
