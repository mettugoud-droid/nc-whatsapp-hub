import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/stats - Real-time dashboard statistics
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalContacts,
      totalOrders,
      codOrders,
      prepaidOrders,
      totalCampaigns,
      activeCampaigns,
      messagesToday,
      messagesDelivered,
      messagesFailed,
      totalTemplates,
      totalRevenue,
    ] = await Promise.all([
      prisma.contact.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { paymentMode: "COD" } }),
      prisma.order.count({ where: { paymentMode: "PREPAID" } }),
      prisma.campaign.count(),
      prisma.campaign.count({ where: { status: "RUNNING" } }),
      prisma.message.count({ where: { createdAt: { gte: today } } }),
      prisma.message.count({ where: { status: "DELIVERED", createdAt: { gte: today } } }),
      prisma.message.count({ where: { status: "FAILED", createdAt: { gte: today } } }),
      prisma.template.count({ where: { isActive: true } }),
      prisma.order.aggregate({ _sum: { finalAmount: true } }),
    ]);

    const deliveryRate = messagesToday > 0
      ? ((messagesDelivered / messagesToday) * 100).toFixed(1)
      : "0";

    const codConversionRate = codOrders + prepaidOrders > 0
      ? ((prepaidOrders / (codOrders + prepaidOrders)) * 100).toFixed(1)
      : "0";

    return NextResponse.json({
      success: true,
      data: {
        totalContacts,
        totalOrders,
        codOrders,
        prepaidOrders,
        totalCampaigns,
        activeCampaigns,
        messagesToday,
        messagesDelivered,
        messagesFailed,
        messagesPending: messagesToday - messagesDelivered - messagesFailed,
        deliveryRate: parseFloat(deliveryRate),
        totalTemplates,
        totalRevenue: totalRevenue._sum.finalAmount || 0,
        codConversionRate: parseFloat(codConversionRate),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
