import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/employees - List team members
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true, role: true, lastLogin: true, createdAt: true },
    });
    return NextResponse.json({ success: true, data: { employees: users } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/employees - Create team member
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email, password required" }, { status: 400 });
    }
    const bcrypt = await import("bcryptjs");
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || "MARKETING" },
    });
    return NextResponse.json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
