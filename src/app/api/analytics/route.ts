import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/analytics - Full business intelligence data
export async function GET(req: NextRequest) {
  try {
    const [
      totalOrders, codOrders, prepaidOrders,
      totalRevenue, totalContacts, totalMessages,
      recentOrders, topProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { paymentMode: "COD" } }),
      prisma.order.count({ where: { paymentMode: "PREPAID" } }),
      prisma.order.aggregate({ _sum: { finalAmount: true } }),
      prisma.contact.count({ where: { isActive: true } }),
      prisma.message.count(),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 30, select: { finalAmount: true, paymentMode: true, createdAt: true, status: true } }),
      prisma.order.groupBy({ by: ["product"], _sum: { finalAmount: true }, _count: { id: true }, orderBy: { _sum: { finalAmount: "desc" } }, take: 10 }),
    ]);

    const revenue = totalRevenue._sum.finalAmount || 0;
    const codPct = totalOrders > 0 ? ((codOrders / totalOrders) * 100).toFixed(1) : "0";
    const prepaidPct = totalOrders > 0 ? ((prepaidOrders / totalOrders) * 100).toFixed(1) : "0";
    const avgOrderValue = totalOrders > 0 ? Math.round(revenue / totalOrders) : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalOrders, codOrders, prepaidOrders,
        revenue, totalContacts, totalMessages,
        codPercentage: parseFloat(codPct),
        prepaidPercentage: parseFloat(prepaidPct),
        avgOrderValue,
        topProducts: topProducts.map(p => ({ product: p.product, revenue: p._sum.finalAmount || 0, orders: p._count.id })),
        recentOrders,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
