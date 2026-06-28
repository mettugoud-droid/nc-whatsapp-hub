"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Edit,
  Copy,
  Trash2,
  FileText,
  MessageSquare,
} from "lucide-react";

const templates = [
  {
    id: "1",
    name: "COD Confirmation",
    category: "COD_CONFIRMATION",
    content:
      "Hello {{customer_name}}! Your COD order #{{order_id}} for {{product}} worth ₹{{amount}} has been confirmed. Expected delivery in 3-5 days. Track: {{tracking_link}}",
    variables: ["customer_name", "order_id", "product", "amount", "tracking_link"],
    usageCount: 1250,
    isActive: true,
  },
  {
    id: "2",
    name: "Order Confirmation",
    category: "ORDER_CONFIRMATION",
    content:
      "Hi {{customer_name}}! Thank you for your order #{{order_id}}. Your {{product}} is being prepared for dispatch. We'll notify you once shipped!",
    variables: ["customer_name", "order_id", "product"],
    usageCount: 2100,
    isActive: true,
  },
  {
    id: "3",
    name: "Shipping Update",
    category: "SHIPPING_UPDATE",
    content:
      "Great news {{customer_name}}! Your order #{{order_id}} has been shipped. Track your delivery here: {{tracking_link}}",
    variables: ["customer_name", "order_id", "tracking_link"],
    usageCount: 1800,
    isActive: true,
  },
  {
    id: "4",
    name: "5% Prepaid Discount",
    category: "COD_CONVERSION",
    content:
      "Hello {{customer_name}}! Convert your COD order #{{order_id}} to online payment and get 5% instant discount. Original: ₹{{original_amount}} | Pay only: ₹{{final_amount}}. Pay here: {{payment_link}}",
    variables: ["customer_name", "order_id", "original_amount", "final_amount", "payment_link"],
    usageCount: 890,
    isActive: true,
  },
  {
    id: "5",
    name: "Payment Reminder",
    category: "PAYMENT_REMINDER",
    content:
      "Hi {{customer_name}}, just a friendly reminder that your payment link is still active. Complete your payment now to enjoy the prepaid discount: {{payment_link}}",
    variables: ["customer_name", "payment_link"],
    usageCount: 650,
    isActive: true,
  },
  {
    id: "6",
    name: "Review Request",
    category: "REVIEW_REQUEST",
    content:
      "Hi {{customer_name}}! We hope you're enjoying your {{product}}. Would you mind leaving a quick review? Your feedback helps us serve you better!",
    variables: ["customer_name", "product"],
    usageCount: 520,
    isActive: true,
  },
  {
    id: "7",
    name: "Festival Offer",
    category: "FESTIVAL_OFFERS",
    content:
      "Hi {{customer_name}}! This festive season, enjoy {{discount}}% OFF on all orders. Use code: {{coupon}}. Shop now and save big! Offer valid till midnight.",
    variables: ["customer_name", "discount", "coupon"],
    usageCount: 3200,
    isActive: true,
  },
  {
    id: "8",
    name: "Reorder Reminder",
    category: "REORDER_REMINDER",
    content:
      "Hi {{customer_name}}! It's been a while since you ordered {{product}}. Ready for a refill? Order now and get free shipping!",
    variables: ["customer_name", "product"],
    usageCount: 410,
    isActive: true,
  },
  {
    id: "9",
    name: "Abandoned Cart",
    category: "ABANDONED_CART",
    content:
      "Hi {{customer_name}}, you left {{product}} in your cart! Complete your order now before it's gone. Cart link: {{payment_link}}",
    variables: ["customer_name", "product", "payment_link"],
    usageCount: 780,
    isActive: true,
  },
  {
    id: "10",
    name: "Payment Successful",
    category: "PAYMENT_SUCCESS",
    content:
      "Hi {{customer_name}}! Payment received successfully for Order #{{order_id}}. Amount: ₹{{amount}}. Your order is now being processed for priority dispatch!",
    variables: ["customer_name", "order_id", "amount"],
    usageCount: 450,
    isActive: true,
  },
];

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    COD_CONFIRMATION: "bg-blue-100 text-blue-700",
    ORDER_CONFIRMATION: "bg-green-100 text-green-700",
    SHIPPING_UPDATE: "bg-purple-100 text-purple-700",
    COD_CONVERSION: "bg-orange-100 text-orange-700",
    PAYMENT_REMINDER: "bg-yellow-100 text-yellow-700",
    REVIEW_REQUEST: "bg-pink-100 text-pink-700",
    FESTIVAL_OFFERS: "bg-red-100 text-red-700",
    REORDER_REMINDER: "bg-teal-100 text-teal-700",
    ABANDONED_CART: "bg-indigo-100 text-indigo-700",
    PAYMENT_SUCCESS: "bg-emerald-100 text-emerald-700",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
}

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">
            Create and manage reusable message templates
          </p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Create Template Form */}
      {showCreate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg">Create New Template</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template Name</label>
                  <Input placeholder="e.g., Welcome Message" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>COD Confirmation</option>
                    <option>Order Confirmation</option>
                    <option>Shipping Update</option>
                    <option>COD Conversion</option>
                    <option>Payment Reminder</option>
                    <option>Festival Offers</option>
                    <option>Reorder Reminder</option>
                    <option>Abandoned Cart</option>
                    <option>Review Request</option>
                    <option>Custom</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Template Content</label>
                <Textarea
                  placeholder="Hi {{customer_name}}, your order..."
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  Use {`{{variable_name}}`} for personalization placeholders
                </p>
              </div>
              <div className="flex gap-2">
                <Button>Save Template</Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full flex flex-col">
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-brand-primary" />
                    <h3 className="font-semibold text-sm">{template.name}</h3>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getCategoryColor(template.category)}`}
                  >
                    {template.category.replace(/_/g, " ")}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground flex-1 line-clamp-3 mb-3">
                  {template.content}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {template.variables.map((v) => (
                    <span
                      key={v}
                      className="text-[10px] px-1.5 py-0.5 bg-accent rounded font-mono"
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    <span>{template.usageCount} uses</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
