import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/contacts/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
      include: { orders: { take: 10, orderBy: { createdAt: "desc" } }, messages: { take: 20, orderBy: { createdAt: "desc" } } },
    });
    if (!contact) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: contact });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/contacts/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const contact = await prisma.contact.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ success: true, data: contact });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/contacts/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.contact.update({ where: { id: params.id }, data: { isActive: false } });
    return NextResponse.json({ success: true, message: "Contact deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
