import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/finance - Financial overview
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalRevenue, codRevenue, prepaidRevenue, todayRevenue, totalOrders, refunds] = await Promise.all([
      prisma.order.aggregate({ _sum: { finalAmount: true } }),
      prisma.order.aggregate({ _sum: { finalAmount: true }, where: { paymentMode: "COD" } }),
      prisma.order.aggregate({ _sum: { finalAmount: true }, where: { paymentMode: "PREPAID" } }),
      prisma.order.aggregate({ _sum: { finalAmount: true }, where: { createdAt: { gte: today } } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { discount: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: totalRevenue._sum.finalAmount || 0,
        codCollections: codRevenue._sum.finalAmount || 0,
        prepaidCollections: prepaidRevenue._sum.finalAmount || 0,
        todayCollections: todayRevenue._sum.finalAmount || 0,
        totalOrders,
        totalDiscounts: refunds._sum.discount || 0,
        netRevenue: (totalRevenue._sum.finalAmount || 0) - (refunds._sum.discount || 0),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
