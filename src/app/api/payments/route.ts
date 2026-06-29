import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/payments - List payments
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const where: any = {};
    if (status) where.status = status;

    const [payments, total, totalCollected] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: { order: { include: { contact: { select: { name: true, phone: true } } } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.payment.count({ where }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "CAPTURED" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        payments,
        total,
        totalCollected: totalCollected._sum.amount || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
