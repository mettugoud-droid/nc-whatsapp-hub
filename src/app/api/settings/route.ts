import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/settings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const where: any = {};
    if (category) where.category = category;
    const settings = await prisma.setting.findMany({ where });
    return NextResponse.json({ success: true, data: { settings } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/settings - Create or update a setting
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value, category, encrypted } = body;
    if (!key || !value || !category) {
      return NextResponse.json({ success: false, error: "key, value, category required" }, { status: 400 });
    }
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value, category, encrypted: encrypted || false },
      create: { key, value, category, encrypted: encrypted || false },
    });
    return NextResponse.json({ success: true, data: setting });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
