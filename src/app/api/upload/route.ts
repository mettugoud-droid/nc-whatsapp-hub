import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  autoMapColumns,
  applyProfile,
  detectProfile,
  mapRow,
  getShopdeckProfile,
  REQUIRED_ORDER_FIELDS,
  REQUIRED_CONTACT_FIELDS,
  type FieldMapping,
} from "@/lib/column-mapper";

interface ValidationError {
  row: number;
  field: string;
  detectedColumn: string;
  reason: string;
}

// POST /api/upload - Smart import with auto-mapping
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { records, type, mappingOverrides } = body;
    // records: raw CSV rows as { [csvHeader]: value }
    // type: "contacts" | "orders"
    // mappingOverrides: optional { internalField: csvHeader }

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { success: false, error: "Records array is required" },
        { status: 400 }
      );
    }

    // Get CSV headers from first record
    const headers = Object.keys(records[0]);

    // Auto-detect mapping profile or use auto-mapping
    let mappings: FieldMapping[];
    let profileUsed: string | null = null;

    const detectedProfile = detectProfile(headers);
    if (detectedProfile) {
      mappings = applyProfile(headers, detectedProfile);
      profileUsed = detectedProfile.name;
    } else {
      mappings = autoMapColumns(headers);
    }

    // Apply manual overrides if provided
    if (mappingOverrides && typeof mappingOverrides === "object") {
      for (const [field, header] of Object.entries(mappingOverrides)) {
        const existing = mappings.findIndex(m => m.internalField === field);
        if (existing >= 0) {
          mappings[existing] = { internalField: field, csvHeader: header as string, confidence: 100, method: "manual" };
        } else {
          mappings.push({ internalField: field, csvHeader: header as string, confidence: 100, method: "manual" });
        }
      }
    }

    // Determine which required fields are mapped
    const requiredFields = type === "orders" ? REQUIRED_ORDER_FIELDS : REQUIRED_CONTACT_FIELDS;
    const mappedFields = new Set(mappings.map(m => m.internalField));
    const missingRequired = requiredFields.filter(f => !mappedFields.has(f));

    if (missingRequired.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Could not map required fields: ${missingRequired.join(", ")}. Available headers: ${headers.join(", ")}`,
        data: {
          detectedMappings: mappings,
          missingRequired,
          headers,
          profileUsed,
        },
      }, { status: 400 });
    }

    // Process records
    let imported = 0;
    let updated = 0;
    let failed = 0;
    const validationErrors: ValidationError[] = [];

    if (type === "contacts") {
      for (let i = 0; i < records.length; i++) {
        try {
          const mapped = mapRow(records[i], mappings);
          const phone = cleanPhone(mapped.phone || mapped.customerNumber || "");

          if (!phone) {
            failed++;
            validationErrors.push({ row: i + 2, field: "phone", detectedColumn: getMappedHeader(mappings, "phone"), reason: "Phone number is empty" });
            continue;
          }

          const name = mapped.customerName || mapped.name || "Unknown";
          const existing = await prisma.contact.findUnique({ where: { phone } });
          if (existing) {
            await prisma.contact.update({ where: { phone }, data: { name } });
            updated++;
          } else {
            await prisma.contact.create({
              data: { name, phone, email: mapped.email || null, tags: [], source: "CSV Import" },
            });
            imported++;
          }
        } catch (e: any) {
          failed++;
          validationErrors.push({ row: i + 2, field: "-", detectedColumn: "-", reason: e.message });
        }
      }
    } else {
      // Orders import
      for (let i = 0; i < records.length; i++) {
        try {
          const mapped = mapRow(records[i], mappings);
          const orderId = (mapped.orderId || "").trim();
          const phone = cleanPhone(mapped.phone || mapped.customerNumber || mapped.customerMobile || "");
          const amountStr = (mapped.amount || mapped.amountToCollect || mapped.finalSellingPrice || "0").replace(/[₹,\s]/g, "");
          const amount = parseFloat(amountStr);

          // Validate required fields (check actual value, not column name)
          if (!orderId) {
            failed++;
            validationErrors.push({ row: i + 2, field: "orderId", detectedColumn: getMappedHeader(mappings, "orderId"), reason: "Order ID value is empty" });
            continue;
          }
          if (!phone) {
            // Phone empty — still import order without phone linkage
            validationErrors.push({ row: i + 2, field: "phone", detectedColumn: getMappedHeader(mappings, "phone"), reason: "Phone number is empty (order still imported)" });
          }
          if (isNaN(amount) || amount <= 0) {
            failed++;
            validationErrors.push({ row: i + 2, field: "amount", detectedColumn: getMappedHeader(mappings, "amount"), reason: `Invalid amount: "${amountStr}"` });
            continue;
          }

          // Find or create contact
          let contact: any = null;
          if (phone) {
            contact = await prisma.contact.findUnique({ where: { phone } });
            if (!contact) {
              contact = await prisma.contact.create({
                data: { name: mapped.customerName || "Unknown", phone, source: mapped.orderSource || "Shopdeck" },
              });
            }
          } else {
            // No phone - create with placeholder phone
            const placeholderPhone = `+91000${String(Date.now()).slice(-7)}${i}`;
            contact = await prisma.contact.create({
              data: { name: mapped.customerName || `Order-${orderId}`, phone: placeholderPhone, source: mapped.orderSource || "Shopdeck (no phone)" },
            });
          }

          // Determine payment mode
          const paymentModeRaw = (mapped.paymentMode || "COD").toUpperCase();
          const paymentMode = paymentModeRaw.includes("PREPAID") || paymentModeRaw.includes("ONLINE") ? "PREPAID" : "COD";

          // Determine order status
          const statusMap: Record<string, any> = {
            "new": "PENDING", "pending": "PENDING", "confirmed": "CONFIRMED",
            "processing": "PROCESSING", "shipped": "SHIPPED", "in transit": "SHIPPED",
            "delivered": "DELIVERED", "cancelled": "CANCELLED", "returned": "RETURNED",
            "rto": "RETURNED",
          };
          const rawStatus = (mapped.orderStatus || "PENDING").toLowerCase();
          const status: any = statusMap[rawStatus] || "PENDING";

          const discountStr = (mapped.discount || "0").replace(/[₹,\s]/g, "");
          const discount = parseFloat(discountStr) || 0;

          // Upsert order
          const existingOrder = await prisma.order.findUnique({ where: { orderId } });
          if (existingOrder) {
            await prisma.order.update({
              where: { orderId },
              data: {
                status,
                trackingNumber: mapped.awb || existingOrder.trackingNumber,
                trackingLink: mapped.trackingLink || existingOrder.trackingLink,
              },
            });
            updated++;
          } else {
            await prisma.order.create({
              data: {
                orderId,
                contactId: contact.id,
                product: mapped.productName || mapped.sku || "",
                amount,
                discount,
                finalAmount: amount - discount,
                paymentMode,
                status,
                source: mapped.orderSource || "Shopdeck",
                trackingNumber: mapped.awb || null,
                trackingLink: mapped.trackingLink || null,
                couponCode: null,
              },
            });
            imported++;
          }
        } catch (e: any) {
          failed++;
          validationErrors.push({ row: i + 2, field: "-", detectedColumn: "-", reason: e.message });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        total: records.length,
        imported,
        updated,
        failed,
        profileUsed,
        mappingsApplied: mappings.map(m => ({
          field: m.internalField,
          column: m.csvHeader,
          confidence: m.confidence,
          method: m.method,
        })),
        validationErrors: validationErrors.slice(0, 50),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET /api/upload/profiles - Get saved mapping profiles
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      profiles: [
        { id: "shopdeck_default", name: "Shopdeck Default Mapping", fields: Object.keys(getShopdeckProfile().mappings).length },
      ],
    },
  });
}

/**
 * Clean and normalize phone number
 */
function cleanPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+91")) cleaned = cleaned;
  else if (cleaned.length === 10) cleaned = "+91" + cleaned;
  else if (cleaned.length === 12 && cleaned.startsWith("91")) cleaned = "+" + cleaned;
  else if (cleaned.length === 13 && cleaned.startsWith("+91")) cleaned = cleaned;
  else if (cleaned.length > 0 && !cleaned.startsWith("+")) cleaned = "+91" + cleaned.slice(-10);
  return cleaned.length >= 12 ? cleaned : "";
}

/**
 * Get the CSV header mapped to an internal field
 */
function getMappedHeader(mappings: FieldMapping[], field: string): string {
  return mappings.find(m => m.internalField === field)?.csvHeader || "(not mapped)";
}
