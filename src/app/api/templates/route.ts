import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/templates
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = { isActive: true };
    if (category) where.category = category;
    if (search) where.name = { contains: search, mode: "insensitive" };

    const templates = await prisma.template.findMany({
      where,
      orderBy: { usageCount: "desc" },
    });

    return NextResponse.json({ success: true, data: { templates } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/templates
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, content, variables, createdBy } = body;

    if (!name || !category || !content) {
      return NextResponse.json(
        { success: false, error: "Name, category, and content are required" },
        { status: 400 }
      );
    }

    // Auto-extract variables from content
    const extractedVars = (content.match(/\{\{(\w+)\}\}/g) || []).map(
      (m: string) => m.replace(/\{\{|\}\}/g, "")
    );

    const template = await prisma.template.create({
      data: {
        name,
        category,
        content,
        variables: variables || extractedVars,
        createdBy: createdBy || "system",
      },
    });

    return NextResponse.json({ success: true, data: template }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
