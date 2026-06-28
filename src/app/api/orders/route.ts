import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/orders
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const paymentMode = searchParams.get("paymentMode");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: any = {};
    if (paymentMode) where.paymentMode = paymentMode;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderId: { contains: search, mode: "insensitive" } },
        { product: { contains: search, mode: "insensitive" } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { contact: { select: { name: true, phone: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: { orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/orders
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, contactId, product, amount, discount, paymentMode, status, source } = body;

    if (!orderId || !contactId || !amount) {
      return NextResponse.json(
        { success: false, error: "Order ID, contact ID, and amount are required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        orderId,
        contactId,
        product: product || "",
        amount,
        discount: discount || 0,
        finalAmount: amount - (discount || 0),
        paymentMode: paymentMode || "COD",
        status: status || "PENDING",
        source,
      },
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
