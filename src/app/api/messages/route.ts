import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/messages - List messages
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");
    const contactId = searchParams.get("contactId");

    const where: any = {};
    if (status) where.status = status;
    if (contactId) where.contactId = contactId;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: { contact: { select: { name: true, phone: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.message.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: { messages, pagination: { page, limit, total } },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
