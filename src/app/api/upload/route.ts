import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/upload - Upload and import CSV data
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { records, type } = body; // type: "contacts" | "orders"

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { success: false, error: "Records array is required" },
        { status: 400 }
      );
    }

    let imported = 0;
    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    if (type === "contacts") {
      for (const record of records) {
        try {
          if (!record.name || !record.phone) {
            failed++;
            errors.push(`Row missing name/phone: ${JSON.stringify(record)}`);
            continue;
          }
          const existing = await prisma.contact.findUnique({ where: { phone: record.phone } });
          if (existing) {
            await prisma.contact.update({
              where: { phone: record.phone },
              data: { name: record.name, email: record.email, tags: record.tags || existing.tags },
            });
            updated++;
          } else {
            await prisma.contact.create({
              data: {
                name: record.name,
                phone: record.phone,
                email: record.email || null,
                tags: record.tags || [],
                source: record.source || "CSV Import",
              },
            });
            imported++;
          }
        } catch (e: any) {
          failed++;
          errors.push(e.message);
        }
      }
    } else if (type === "orders") {
      for (const record of records) {
        try {
          if (!record.orderId || !record.phone || !record.amount) {
            failed++;
            errors.push(`Row missing orderId/phone/amount`);
            continue;
          }

          // Find or create contact
          let contact = await prisma.contact.findUnique({ where: { phone: record.phone } });
          if (!contact) {
            contact = await prisma.contact.create({
              data: { name: record.customerName || "Unknown", phone: record.phone, source: record.source || "Order Import" },
            });
          }

          // Upsert order
          const existingOrder = await prisma.order.findUnique({ where: { orderId: record.orderId } });
          if (existingOrder) {
            await prisma.order.update({
              where: { orderId: record.orderId },
              data: {
                status: record.status || existingOrder.status,
                trackingNumber: record.trackingNumber || existingOrder.trackingNumber,
              },
            });
            updated++;
          } else {
            await prisma.order.create({
              data: {
                orderId: record.orderId,
                contactId: contact.id,
                product: record.product || "",
                amount: parseFloat(record.amount),
                discount: parseFloat(record.discount || "0"),
                finalAmount: parseFloat(record.amount) - parseFloat(record.discount || "0"),
                paymentMode: (record.paymentMode || "COD").toUpperCase() === "PREPAID" ? "PREPAID" : "COD",
                status: record.status || "PENDING",
                source: record.source || "CSV Import",
                trackingNumber: record.trackingNumber,
                couponCode: record.couponCode,
              },
            });
            imported++;
          }
        } catch (e: any) {
          failed++;
          errors.push(e.message);
        }
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Type must be 'contacts' or 'orders'" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        total: records.length,
        imported,
        updated,
        failed,
        errors: errors.slice(0, 20),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
