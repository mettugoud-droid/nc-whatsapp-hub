import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/marketing - Get marketing analytics config
export async function GET() {
  try {
    const settings = await prisma.setting.findMany({
      where: { category: "marketing" },
    });
    return NextResponse.json({ success: true, data: { settings } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/marketing - Save marketing credentials
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credentials } = body;

    if (!credentials || typeof credentials !== "object") {
      return NextResponse.json({ success: false, error: "credentials object required" }, { status: 400 });
    }

    const results = [];
    for (const [key, value] of Object.entries(credentials)) {
      if (value) {
        const setting = await prisma.setting.upsert({
          where: { key: `marketing_${key}` },
          update: { value: String(value), category: "marketing" },
          create: { key: `marketing_${key}`, value: String(value), category: "marketing" },
        });
        results.push(setting);
      }
    }

    return NextResponse.json({ success: true, data: { saved: results.length } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
