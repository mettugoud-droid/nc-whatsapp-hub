/**
 * Database Seed Script
 * 
 * Populates the database with sample data for development and testing.
 * Run with: npm run db:seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@naturescrates.in" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@naturescrates.in",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create marketing user
  const marketingPassword = await bcrypt.hash("marketing123", 12);
  const marketing = await prisma.user.upsert({
    where: { email: "marketing@naturescrates.in" },
    update: {},
    create: {
      name: "Marketing Team",
      email: "marketing@naturescrates.in",
      password: marketingPassword,
      role: "MARKETING",
    },
  });

  console.log("Users created:", { admin: admin.id, marketing: marketing.id });

  // Create sample contacts
  const contacts = await Promise.all([
    prisma.contact.upsert({
      where: { phone: "+919876543210" },
      update: {},
      create: { name: "Rahul Sharma", phone: "+919876543210", email: "rahul@gmail.com", tags: ["VIP", "Repeat"], source: "Shopify" },
    }),
    prisma.contact.upsert({
      where: { phone: "+918765432109" },
      update: {},
      create: { name: "Priya Gupta", phone: "+918765432109", email: "priya@yahoo.com", tags: ["New"], source: "CSV" },
    }),
    prisma.contact.upsert({
      where: { phone: "+917654321098" },
      update: {},
      create: { name: "Amit Patel", phone: "+917654321098", email: "amit.p@gmail.com", tags: ["COD", "Active"], source: "WooCommerce" },
    }),
    prisma.contact.upsert({
      where: { phone: "+916543210987" },
      update: {},
      create: { name: "Neha Singh", phone: "+916543210987", email: "neha.s@outlook.com", tags: ["Prepaid", "VIP"], source: "Shopify" },
    }),
    prisma.contact.upsert({
      where: { phone: "+915432109876" },
      update: {},
      create: { name: "Vikram Reddy", phone: "+915432109876", email: "vikram@gmail.com", tags: ["COD"], source: "Shopdeck" },
    }),
  ]);

  console.log(`${contacts.length} contacts created`);

  // Create templates
  const templates = await Promise.all([
    prisma.template.create({
      data: {
        name: "COD Confirmation",
        category: "COD_CONFIRMATION",
        content: "Hello {{customer_name}}! Your COD order #{{order_id}} for {{product}} worth ₹{{amount}} has been confirmed.",
        variables: ["customer_name", "order_id", "product", "amount"],
        createdBy: admin.id,
      },
    }),
    prisma.template.create({
      data: {
        name: "5% Prepaid Discount",
        category: "COD_CONVERSION",
        content: "Hello {{customer_name}}! Convert your COD order to online payment and get 5% instant discount. Pay only ₹{{final_amount}}. Link: {{payment_link}}",
        variables: ["customer_name", "order_id", "original_amount", "final_amount", "payment_link"],
        createdBy: admin.id,
      },
    }),
    prisma.template.create({
      data: {
        name: "Payment Reminder",
        category: "PAYMENT_REMINDER",
        content: "Hi {{customer_name}}, your payment link is still active. Complete your payment now: {{payment_link}}",
        variables: ["customer_name", "payment_link"],
        createdBy: marketing.id,
      },
    }),
    prisma.template.create({
      data: {
        name: "Festival Offer",
        category: "FESTIVAL_OFFERS",
        content: "Hi {{customer_name}}! This festive season, enjoy {{discount}}% OFF. Use code: {{coupon}}. Shop now!",
        variables: ["customer_name", "discount", "coupon"],
        createdBy: marketing.id,
      },
    }),
    prisma.template.create({
      data: {
        name: "Payment Successful",
        category: "PAYMENT_SUCCESS",
        content: "Hi {{customer_name}}! Payment received for Order #{{order_id}}. Amount: ₹{{amount}}. Your order will be dispatched soon!",
        variables: ["customer_name", "order_id", "amount"],
        createdBy: admin.id,
      },
    }),
  ]);

  console.log(`${templates.length} templates created`);

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderId: "NC-2024-1234",
        contactId: contacts[0].id,
        product: "Premium Cashews 1kg",
        amount: 1299,
        finalAmount: 1299,
        paymentMode: "COD",
        status: "CONFIRMED",
        source: "Shopify",
      },
    }),
    prisma.order.create({
      data: {
        orderId: "NC-2024-1235",
        contactId: contacts[1].id,
        product: "Organic Almonds 500g",
        amount: 899,
        discount: 45,
        finalAmount: 854,
        paymentMode: "PREPAID",
        status: "PROCESSING",
        source: "Shopify",
      },
    }),
    prisma.order.create({
      data: {
        orderId: "NC-2024-1236",
        contactId: contacts[2].id,
        product: "Trail Mix Combo",
        amount: 1599,
        finalAmount: 1599,
        paymentMode: "COD",
        status: "PENDING",
        source: "WooCommerce",
      },
    }),
  ]);

  console.log(`${orders.length} orders created`);

  // Create sample settings
  await prisma.setting.createMany({
    data: [
      { key: "conversion_discount_percent", value: "5", category: "conversion" },
      { key: "conversion_link_expiry_hours", value: "48", category: "conversion" },
      { key: "conversion_auto_send", value: "true", category: "conversion" },
      { key: "conversion_reminder_schedule", value: "[6, 24, 48]", category: "conversion" },
      { key: "business_name", value: "Nature's Crates", category: "general" },
      { key: "support_number", value: "+919876543210", category: "general" },
      { key: "payment_provider", value: "razorpay", category: "payment" },
      { key: "payment_sandbox", value: "true", category: "payment" },
    ],
    skipDuplicates: true,
  });

  console.log("Settings created");
  console.log("Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
