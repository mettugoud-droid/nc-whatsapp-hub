"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Send, Upload, MessageSquare, Clock, CheckCircle2,
  XCircle, Loader2, Users,
} from "lucide-react";

const placeholders = [
  "{{customer_name}}", "{{order_id}}", "{{product}}", "{{discount}}",
  "{{coupon}}", "{{tracking}}", "{{payment_link}}", "{{company}}", "{{support}}",
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<"individual" | "bulk">("individual");
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const insertPlaceholder = (ph: string) => setMessage(prev => prev + ph);

  const handleSend = async () => {
    if (!phoneNumber || !message) { setResult({ success: false, message: "Phone and message are required" }); return; }
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber.replace(/\s/g, "")}`,
          message,
          customerName: customerName || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ success: true, message: `Message sent! ID: ${data.data.messageId}` });
        setMessage(""); setPhoneNumber(""); setCustomerName("");
      } else {
        setResult({ success: false, message: data.error || "Failed to send" });
      }
    } catch { setResult({ success: false, message: "Network error" }); }
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Send Message</h1>
        <p className="text-muted-foreground">Send individual or bulk WhatsApp messages</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 rounded-lg bg-accent/50 w-fit">
        <button onClick={() => setActiveTab("individual")} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "individual" ? "bg-brand-primary text-white shadow-md" : "text-muted-foreground"}`}>
          <MessageSquare className="h-4 w-4 inline mr-2" />Individual
        </button>
        <button onClick={() => setActiveTab("bulk")} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "bulk" ? "bg-brand-primary text-white shadow-md" : "text-muted-foreground"}`}>
          <Users className="h-4 w-4 inline mr-2" />Bulk
        </button>
      </div>

      <Card>
        <CardHeader><CardTitle>{activeTab === "individual" ? "Send Individual Message" : "Send Bulk Messages"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {activeTab === "individual" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Name</label>
                <Input placeholder="Enter name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number *</label>
                <Input placeholder="9876543210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-brand-primary/50 transition-colors" onClick={() => window.location.href = "/dashboard/upload"}>
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">Go to Upload Page to import contacts</p>
              <p className="text-sm text-muted-foreground mt-1">Upload CSV with phone numbers, then send bulk messages</p>
            </div>
          )}

          {/* Message Composer */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Message *</label>
            <Textarea placeholder="Type your message..." value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-[150px]" />
            <p className="text-xs text-muted-foreground">{message.length} characters</p>
          </div>

          {/* Placeholders */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Insert Variable</label>
            <div className="flex flex-wrap gap-2">
              {placeholders.map(ph => (
                <button key={ph} onClick={() => insertPlaceholder(ph)} className="px-2.5 py-1 text-xs font-mono bg-accent rounded-md hover:bg-brand-primary/10 hover:text-brand-primary transition-colors">{ph}</button>
              ))}
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${result.success ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"}`}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {result.message}
            </div>
          )}

          {/* Send Button */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSend} disabled={sending || !message || !phoneNumber} className="flex-1">
              {sending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</> : <><Send className="h-4 w-4 mr-2" />Send Now</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
