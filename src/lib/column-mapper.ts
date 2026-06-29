/**
 * Intelligent Column Mapper
 * 
 * Auto-maps CSV headers to internal field names using:
 * - Exact match (case-insensitive)
 * - Alias matching (multiple known names per field)
 * - Fuzzy matching (ignoring spaces, punctuation, case)
 * - Saved mapping profiles (e.g., "Shopdeck Default")
 */

export interface FieldMapping {
  internalField: string;
  csvHeader: string;
  confidence: number; // 0-100
  method: "exact" | "alias" | "fuzzy" | "manual" | "profile";
}

export interface MappingProfile {
  id: string;
  name: string;
  mappings: Record<string, string>; // internalField -> csvHeader
}

// All known aliases for each internal field
// These cover Shopdeck, Shopify, WooCommerce, generic CSV exports
const FIELD_ALIASES: Record<string, string[]> = {
  orderId: [
    "order id", "orderid", "order_id", "order no", "order number",
    "order #", "id", "order no.", "order_no",
  ],
  phone: [
    "customer number", "phone", "mobile", "phone number", "mobile number",
    "contact", "phone no", "cell", "customer mobile", "customer phone",
    "contact number", "mobile no", "mob", "tel", "customer no",
    "cust number", "cust mobile", "buyer mobile", "buyer phone",
  ],
  customerName: [
    "customer name", "name", "buyer name", "full name", "customer",
    "buyer", "customer_name", "cust name",
  ],
  amount: [
    "final selling price", "amount", "total", "order amount", "order value",
    "price", "total amount", "mrp", "selling price", "net amount",
    "payable amount", "invoice amount",
  ],
  discount: [
    "total discount", "discount", "discount amount", "offer", "off",
    "discount value",
  ],
  amountToCollect: [
    "amount to collect", "collect amount", "cod amount", "collectible",
  ],
  paymentMode: [
    "payment mode", "payment method", "payment type", "cod/prepaid",
    "mode", "payment", "pay mode", "pay method",
  ],
  orderStatus: [
    "order status", "status", "delivery status", "order_status",
    "current status",
  ],
  productName: [
    "product name", "product", "item", "item name", "sku name",
    "product_name", "product title",
  ],
  sku: [
    "sku id", "sku", "sku_id", "product sku", "item sku",
    "variant sku",
  ],
  quantity: [
    "quantity", "qty", "units", "count", "order quantity",
  ],
  awb: [
    "awb no.", "awb no", "awb", "awb number", "tracking number",
    "tracking", "tracking no", "waybill",
  ],
  trackingLink: [
    "track link", "tracking link", "tracking url", "track url",
    "tracking_link",
  ],
  courier: [
    "courier partner", "courier", "courier name", "shipping partner",
    "logistics partner", "delivery partner",
  ],
  orderDate: [
    "order date", "date", "created at", "placed on", "order_date",
    "created date",
  ],
  address: [
    "customer address", "address", "delivery address", "shipping address",
    "full address",
  ],
  city: [
    "city", "customer city", "delivery city",
  ],
  state: [
    "state", "customer state", "delivery state",
  ],
  pincode: [
    "pincode", "pin code", "zip", "zipcode", "postal code", "pin",
  ],
  email: [
    "email", "email address", "e-mail", "mail", "customer email",
  ],
  settlementStatus: [
    "settlement status", "settlement", "payout status",
  ],
  settlementDate: [
    "settlement date", "payout date",
  ],
  callStatus: [
    "call status", "call_status",
  ],
  callRemarks: [
    "call remarks", "remarks", "call notes",
  ],
  orderSource: [
    "order source", "source", "channel", "platform", "marketplace",
  ],
  orderType: [
    "order type", "type",
  ],
  weight: [
    "weight", "package weight", "order weight",
  ],
  shippingCharge: [
    "shipping charge", "shipping", "delivery charge", "shipping cost",
  ],
  pickupAddress: [
    "pickup address", "pickup",
  ],
  invoice: [
    "invoice", "invoice link", "invoice url",
  ],
  shippingLabel: [
    "shipping label", "label", "label link",
  ],
  creditNote: [
    "credit note", "credit",
  ],
};

// Built-in profiles
const SHOPDECK_PROFILE: MappingProfile = {
  id: "shopdeck_default",
  name: "Shopdeck Default Mapping",
  mappings: {
    orderId: "Order ID",
    phone: "Customer Number",
    customerName: "Customer Name",
    address: "Customer Address",
    orderDate: "Order Date",
    orderStatus: "Order Status",
    paymentMode: "Payment Mode",
    amount: "Final Selling Price",
    amountToCollect: "Amount to Collect",
    discount: "Total Discount",
    productName: "Product Name",
    sku: "Sku ID",
    quantity: "Quantity",
    awb: "AWB NO.",
    trackingLink: "Track Link",
    courier: "Courier Partner",
    settlementStatus: "Settlement Status",
    settlementDate: "Settlement Date",
    callStatus: "Call Status",
    callRemarks: "Call Remarks",
    orderSource: "Order Source",
    orderType: "Order Type",
    weight: "Weight",
    shippingCharge: "Shipping Charge",
    pickupAddress: "Pickup Address",
    invoice: "Invoice",
    shippingLabel: "Shipping Label",
    creditNote: "Credit Note",
  },
};

/**
 * Normalize a string for comparison:
 * Remove spaces, punctuation, convert to lowercase
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Auto-map CSV headers to internal fields
 */
export function autoMapColumns(headers: string[]): FieldMapping[] {
  const mappings: FieldMapping[] = [];
  const usedHeaders = new Set<string>();

  for (const [internalField, aliases] of Object.entries(FIELD_ALIASES)) {
    let bestMatch: { header: string; confidence: number; method: FieldMapping["method"] } | null = null;

    for (const header of headers) {
      if (usedHeaders.has(header)) continue;

      const normalizedHeader = normalize(header);

      // 1. Exact match (case-insensitive)
      if (normalizedHeader === normalize(internalField)) {
        bestMatch = { header, confidence: 100, method: "exact" };
        break;
      }

      // 2. Alias match
      for (const alias of aliases) {
        if (normalizedHeader === normalize(alias)) {
          bestMatch = { header, confidence: 95, method: "alias" };
          break;
        }
      }
      if (bestMatch && bestMatch.confidence >= 95) break;

      // 3. Fuzzy: check if normalized header contains normalized alias or vice versa
      for (const alias of aliases) {
        const normalizedAlias = normalize(alias);
        if (
          normalizedHeader.includes(normalizedAlias) ||
          normalizedAlias.includes(normalizedHeader)
        ) {
          const score = Math.round(
            (Math.min(normalizedHeader.length, normalizedAlias.length) /
              Math.max(normalizedHeader.length, normalizedAlias.length)) * 85
          );
          if (!bestMatch || score > bestMatch.confidence) {
            bestMatch = { header, confidence: score, method: "fuzzy" };
          }
        }
      }
    }

    if (bestMatch && bestMatch.confidence >= 50) {
      mappings.push({
        internalField,
        csvHeader: bestMatch.header,
        confidence: bestMatch.confidence,
        method: bestMatch.method,
      });
      usedHeaders.add(bestMatch.header);
    }
  }

  return mappings;
}

/**
 * Try to apply a saved profile to the given headers
 */
export function applyProfile(
  headers: string[],
  profile: MappingProfile
): FieldMapping[] {
  const mappings: FieldMapping[] = [];

  for (const [internalField, expectedHeader] of Object.entries(profile.mappings)) {
    // Try exact match first
    const found = headers.find(
      (h) => normalize(h) === normalize(expectedHeader)
    );
    if (found) {
      mappings.push({
        internalField,
        csvHeader: found,
        confidence: 100,
        method: "profile",
      });
    }
  }

  return mappings;
}

/**
 * Detect which profile best matches the given headers
 */
export function detectProfile(headers: string[]): MappingProfile | null {
  const shopdeckMappings = applyProfile(headers, SHOPDECK_PROFILE);
  // If >60% of Shopdeck fields match, use it
  const shopdeckFieldCount = Object.keys(SHOPDECK_PROFILE.mappings).length;
  if (shopdeckMappings.length / shopdeckFieldCount > 0.6) {
    return SHOPDECK_PROFILE;
  }
  return null;
}

/**
 * Map a raw CSV row using field mappings
 */
export function mapRow(
  row: Record<string, string>,
  mappings: FieldMapping[]
): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const mapping of mappings) {
    const value = row[mapping.csvHeader];
    if (value !== undefined && value !== null) {
      mapped[mapping.internalField] = value.trim();
    }
  }
  return mapped;
}

/**
 * Get the Shopdeck default profile
 */
export function getShopdeckProfile(): MappingProfile {
  return SHOPDECK_PROFILE;
}

/**
 * Get all built-in profiles
 */
export function getBuiltInProfiles(): MappingProfile[] {
  return [SHOPDECK_PROFILE];
}

/**
 * Required fields for order import
 */
export const REQUIRED_ORDER_FIELDS = ["orderId", "phone", "amount"];
export const REQUIRED_CONTACT_FIELDS = ["phone"];
