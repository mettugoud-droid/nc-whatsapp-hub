"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Send,
  Upload,
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
} from "lucide-react";

const recentMessages = [
  {
    id: "1",
    contact: "Rahul Sharma",
    phone: "+91 98765 43210",
    message: "Your order #NC1234 has been shipped!",
    status: "delivered",
    time: "2 min ago",
  },
  {
    id: "2",
    contact: "Priya Gupta",
    phone: "+91 87654 32109",
    message: "Hi Priya! Your payment link is ready...",
    status: "sent",
    time: "5 min ago",
  },
  {
    id: "3",
    contact: "Amit Patel",
    phone: "+91 76543 21098",
    message: "Thank you for your order! Here's your tracking...",
    status: "failed",
    time: "12 min ago",
  },
  {
    id: "4",
    contact: "Neha Singh",
    phone: "+91 65432 10987",
    message: "Special festival offer just for you!",
    status: "read",
    time: "30 min ago",
  },
];

const placeholders = [
  "{{customer_name}}",
  "{{order_id}}",
  "{{product}}",
  "{{discount}}",
  "{{coupon}}",
  "{{tracking}}",
  "{{payment_link}}",
  "{{company}}",
  "{{support}}",
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<"individual" | "bulk">("individual");
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");

  const insertPlaceholder = (placeholder: string) => {
    setMessage((prev) => prev + placeholder);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Send individual or bulk WhatsApp messages
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 rounded-lg bg-accent/50 w-fit">
        <button
          onClick={() => setActiveTab("individual")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "individual"
              ? "bg-brand-primary text-white shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="h-4 w-4 inline mr-2" />
          Individual
        </button>
        <button
          onClick={() => setActiveTab("bulk")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "bulk"
              ? "bg-brand-primary text-white shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Bulk
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Compose Area */}
        <div className="lg:col-span-2">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === "individual"
                    ? "Send Individual Message"
                    : "Send Bulk Messages"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeTab === "individual" ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Customer Name
                        </label>
                        <Input
                          placeholder="Enter customer name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Mobile Number
                        </label>
                        <Input
                          placeholder="+91 XXXXX XXXXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-brand-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="font-medium">Upload Customer List</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports CSV, Excel (.xlsx), Google Sheets
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Required columns: Customer Name, Phone Number
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Optional: Order ID, Product, Amount, Offer, Status
                    </p>
                    <Button variant="outline" className="mt-4">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                )}

                {/* Message Composer */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Type your message here... Use {{variables}} for personalization"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    {message.length} characters
                  </p>
                </div>

                {/* Placeholders */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Insert Placeholder
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {placeholders.map((ph) => (
                      <button
                        key={ph}
                        onClick={() => insertPlaceholder(ph)}
                        className="px-2.5 py-1 text-xs font-mono bg-accent rounded-md hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
                      >
                        {ph}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Send Options */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </Button>
                  <Button variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-brand-primary">
                    {msg.contact
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">
                      {msg.contact}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {msg.message}
                  </p>
                  <div className="mt-1">
                    {msg.status === "delivered" && (
                      <Badge variant="success" className="text-[10px]">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Delivered
                      </Badge>
                    )}
                    {msg.status === "sent" && (
                      <Badge variant="info" className="text-[10px]">
                        <Send className="h-3 w-3 mr-1" /> Sent
                      </Badge>
                    )}
                    {msg.status === "failed" && (
                      <Badge variant="destructive" className="text-[10px]">
                        <XCircle className="h-3 w-3 mr-1" /> Failed
                      </Badge>
                    )}
                    {msg.status === "read" && (
                      <Badge variant="default" className="text-[10px]">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Read
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
