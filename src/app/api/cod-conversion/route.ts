import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cod-conversion - Get COD orders + conversion stats
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Get COD orders with conversion data
    const where: any = { paymentMode: "COD" };
    if (status) where.status = status;

    const [codOrders, totalCod, converted, totalRevenue] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { contact: { select: { name: true, phone: true } }, codConversion: true },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.order.count({ where: { paymentMode: "COD" } }),
      prisma.order.count({ where: { paymentMode: "PREPAID" } }),
      prisma.order.aggregate({ _sum: { finalAmount: true }, where: { paymentMode: "PREPAID" } }),
    ]);

    const conversionRate = totalCod + converted > 0 ? ((converted / (totalCod + converted)) * 100).toFixed(1) : "0";

    return NextResponse.json({
      success: true,
      data: {
        orders: codOrders,
        stats: {
          totalCodOrders: totalCod,
          convertedToPrepaid: converted,
          conversionRate: parseFloat(conversionRate),
          revenueCollected: totalRevenue._sum.finalAmount || 0,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/cod-conversion - Process COD order for conversion
export async function POST(req: NextRequest) {
  try {
    const { orderId, discountPercent } = await req.json();
    if (!orderId) return NextResponse.json({ success: false, error: "Order ID required" }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { orderId }, include: { contact: true } });
    if (!order) return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

    const discount = discountPercent || 5;
    const discountAmount = Math.round((order.amount * discount) / 100);
    const finalAmount = order.amount - discountAmount;

    // Create conversion record
    const conversion = await prisma.codConversion.create({
      data: {
        orderId: order.id,
        originalAmount: order.amount,
        discountPercent: discount,
        discountAmount,
        finalAmount,
        status: "PENDING",
        linkExpiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ success: true, data: { conversion, order } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
