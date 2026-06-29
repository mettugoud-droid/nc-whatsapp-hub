import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/tickets - List from audit log (ticket-like entries)
export async function GET(req: NextRequest) {
  try {
    // Use audit logs as ticket proxy until full ticket table is added
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ success: true, data: { tickets: logs } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/tickets - Create audit/ticket entry
export async function POST(req: NextRequest) {
  try {
    const { action, resource, resourceId, details } = await req.json();
    const entry = await prisma.auditLog.create({
      data: { action: action || "ticket_created", resource: resource || "ticket", resourceId, details },
    });
    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
