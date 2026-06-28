import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/messages/send - Send a WhatsApp message
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, message, customerName, contactId, templateId, campaignId } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { success: false, error: "Phone and message are required" },
        { status: 400 }
      );
    }

    // Find or create contact
    let contact = await prisma.contact.findUnique({ where: { phone } });
    if (!contact && customerName) {
      contact = await prisma.contact.create({
        data: { name: customerName, phone, source: "WhatsApp" },
      });
    }

    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact not found. Provide customerName to auto-create." },
        { status: 400 }
      );
    }

    // Store the message in database
    const msg = await prisma.message.create({
      data: {
        contactId: contact.id,
        campaignId,
        templateId,
        direction: "OUTBOUND",
        content: message,
        status: "QUEUED",
      },
    });

    // TODO: In production, call WhatsApp Cloud API here
    // For now, mark as sent
    await prisma.message.update({
      where: { id: msg.id },
      data: { status: "SENT", sentAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: { messageId: msg.id, status: "SENT", contactId: contact.id },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
