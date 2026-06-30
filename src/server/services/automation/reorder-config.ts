/**
 * Module 9: Repeat Purchase Configuration
 * Product-specific reorder reminders
 */

import { ReorderConfig } from "./types";

export const REORDER_CONFIGS: ReorderConfig[] = [
  {
    productName: "Blueberries",
    productKeywords: ["blueberry", "blueberries", "blue berry"],
    reorderDays: 20,
    message: "Hi {{customer_name}} 👋\n\nRunning low on Blueberries? 🫐\n\nReorder your favourite fresh blueberries now!\n\n🛒 Order: {{checkout_link}}",
  },
  {
    productName: "Almonds",
    productKeywords: ["almond", "almonds", "badam"],
    reorderDays: 30,
    message: "Hi {{customer_name}} 👋\n\nTime to restock your Almonds! 🥜\n\nFresh, premium quality almonds waiting for you.\n\n🛒 Order: {{checkout_link}}",
  },
  {
    productName: "Cashews",
    productKeywords: ["cashew", "cashews", "kaju"],
    reorderDays: 30,
    message: "Hi {{customer_name}} 👋\n\nRunning low on Cashews? 🥜\n\nGet your fresh batch of premium cashews.\n\n🛒 Order: {{checkout_link}}",
  },
  {
    productName: "Pistachios",
    productKeywords: ["pistachio", "pistachios", "pista"],
    reorderDays: 30,
    message: "Hi {{customer_name}} 👋\n\nTime for more Pistachios! 🌿\n\nOur premium pistachios are freshly packed.\n\n🛒 Order: {{checkout_link}}",
  },
  {
    productName: "Walnuts",
    productKeywords: ["walnut", "walnuts", "akhrot"],
    reorderDays: 30,
    message: "Hi {{customer_name}} 👋\n\nReady for a Walnut refill? 🥜\n\nFresh, crunchy walnuts just for you.\n\n🛒 Order: {{checkout_link}}",
  },
];

/**
 * Check if a product matches a reorder config
 */
export function findReorderConfig(productName: string): ReorderConfig | undefined {
  const lower = productName.toLowerCase();
  return REORDER_CONFIGS.find(config =>
    config.productKeywords.some(kw => lower.includes(kw))
  );
}
