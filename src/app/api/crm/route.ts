import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/crm - Customer profiles with order stats
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const where: any = { isActive: true };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }

    const contacts = await prisma.contact.findMany({
      where,
      include: {
        orders: { select: { finalAmount: true, paymentMode: true, status: true, createdAt: true } },
        messages: { select: { id: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    // Enrich with calculated fields
    const customers = contacts.map(c => {
      const orders = c.orders;
      const totalSpend = orders.reduce((sum, o) => sum + o.finalAmount, 0);
      const codOrders = orders.filter(o => o.paymentMode === "COD").length;
      const prepaidOrders = orders.filter(o => o.paymentMode === "PREPAID").length;
      const totalOrders = orders.length;
      const lastOrder = orders.length > 0 ? orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : null;
      const daysSinceLastPurchase = lastOrder ? Math.floor((Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 999;

      let segment: string = "new";
      if (totalOrders >= 5 && totalSpend >= 10000) segment = "vip";
      else if (daysSinceLastPurchase > 120) segment = "lost";
      else if (daysSinceLastPurchase > 60) segment = "at_risk";
      else if (totalOrders >= 2) segment = "active";

      return {
        id: c.id, name: c.name, phone: c.phone, email: c.email, tags: c.tags,
        totalOrders, totalSpend, avgOrderValue: totalOrders > 0 ? Math.round(totalSpend / totalOrders) : 0,
        codPercentage: totalOrders > 0 ? Math.round((codOrders / totalOrders) * 100) : 0,
        prepaidPercentage: totalOrders > 0 ? Math.round((prepaidOrders / totalOrders) * 100) : 0,
        segment, daysSinceLastPurchase,
        ltv: Math.round(totalSpend * 2.5), // Projected 3-year LTV
        lastPurchase: lastOrder?.createdAt || null,
      };
    });

    const segments = {
      new: customers.filter(c => c.segment === "new").length,
      active: customers.filter(c => c.segment === "active").length,
      vip: customers.filter(c => c.segment === "vip").length,
      at_risk: customers.filter(c => c.segment === "at_risk").length,
      lost: customers.filter(c => c.segment === "lost").length,
    };

    return NextResponse.json({ success: true, data: { customers, segments } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
