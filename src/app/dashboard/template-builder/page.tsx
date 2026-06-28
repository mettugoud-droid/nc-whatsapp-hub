"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Type, Image, Smile, Bold, Italic, Link2, Paperclip,
  FileText, Smartphone, Eye, Save, Send, Plus,
} from "lucide-react";

const variables = [
  "{{customer_name}}", "{{order_id}}", "{{product_name}}", "{{amount}}",
  "{{discount}}", "{{payment_link}}", "{{tracking_link}}", "{{coupon}}", "{{support}}",
];

const emojis = ["👋", "✅", "🎉", "🛒", "💰", "🚚", "⭐", "❤️", "🔥", "👍", "📦", "🎁", "💯", "⚡", "🌿"];

export default function TemplateBuilderPage() {
  const [templateName, setTemplateName] = useState("");
  const [content, setContent] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [showVars, setShowVars] = useState(false);
  const [category, setCategory] = useState("custom");

  const insertText = (text: string) => {
    setContent((prev) => prev + text);
  };

  // Generate preview with sample data
  const previewContent = content
    .replace("{{customer_name}}", "Rahul")
    .replace("{{order_id}}", "NC-2024-1234")
    .replace("{{product_name}}", "Premium Cashews 1kg")
    .replace("{{amount}}", "₹1,299")
    .replace("{{discount}}", "₹65")
    .replace("{{payment_link}}", "https://rzp.io/abc123")
    .replace("{{tracking_link}}", "https://track.delhivery.com/xyz")
    .replace("{{coupon}}", "DIWALI10")
    .replace("{{support}}", "+91 98765 43210");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Builder</h1>
          <p className="text-muted-foreground">Create rich WhatsApp message templates with live preview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Save className="h-4 w-4 mr-2" /> Save Draft</Button>
          <Button><Send className="h-4 w-4 mr-2" /> Save & Activate</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Template Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template Name</label>
                  <Input placeholder="e.g., Diwali Special Offer" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="cod_conversion">COD Conversion</option>
                    <option value="order_confirmation">Order Confirmation</option>
                    <option value="shipping_update">Shipping Update</option>
                    <option value="delivered">Delivered</option>
                    <option value="review_request">Review Request</option>
                    <option value="payment_reminder">Payment Reminder</option>
                    <option value="festival_offer">Festival Offer</option>
                    <option value="reorder_reminder">Reorder Reminder</option>
                    <option value="abandoned_cart">Abandoned Cart</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Message Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Toolbar */}
              <div className="flex items-center gap-1 p-2 rounded-lg border bg-accent/30 flex-wrap">
                <button className="p-1.5 rounded hover:bg-accent" onClick={() => insertText("*")} title="Bold">
                  <Bold className="h-4 w-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-accent" onClick={() => insertText("_")} title="Italic">
                  <Italic className="h-4 w-4" />
                </button>
                <div className="w-px h-5 bg-border mx-1" />
                <button className={`p-1.5 rounded ${showEmojis ? "bg-brand-primary/10 text-brand-primary" : "hover:bg-accent"}`}
                  onClick={() => { setShowEmojis(!showEmojis); setShowVars(false); }} title="Emoji">
                  <Smile className="h-4 w-4" />
                </button>
                <button className={`p-1.5 rounded ${showVars ? "bg-brand-primary/10 text-brand-primary" : "hover:bg-accent"}`}
                  onClick={() => { setShowVars(!showVars); setShowEmojis(false); }} title="Variables">
                  <Type className="h-4 w-4" />
                </button>
                <div className="w-px h-5 bg-border mx-1" />
                <button className="p-1.5 rounded hover:bg-accent" title="Image">
                  <Image className="h-4 w-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-accent" title="PDF Attachment">
                  <FileText className="h-4 w-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-accent" title="Link">
                  <Link2 className="h-4 w-4" />
                </button>
                <button className="p-1.5 rounded hover:bg-accent" title="Attachment">
                  <Paperclip className="h-4 w-4" />
                </button>
              </div>

              {/* Emoji Picker */}
              {showEmojis && (
                <div className="flex flex-wrap gap-2 p-3 rounded-lg border bg-accent/30">
                  {emojis.map((emoji) => (
                    <button key={emoji} onClick={() => insertText(emoji)}
                      className="text-xl hover:scale-125 transition-transform">{emoji}</button>
                  ))}
                </div>
              )}

              {/* Variables */}
              {showVars && (
                <div className="flex flex-wrap gap-2 p-3 rounded-lg border bg-accent/30">
                  {variables.map((v) => (
                    <button key={v} onClick={() => insertText(v)}
                      className="px-2 py-1 text-xs font-mono bg-background rounded border hover:border-brand-primary hover:text-brand-primary transition-colors">
                      {v}
                    </button>
                  ))}
                </div>
              )}

              {/* Content Editor */}
              <Textarea
                placeholder="Type your message here... Use *bold*, _italic_, and {{variables}} for personalization"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[250px] font-mono text-sm"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{content.length} characters</span>
                <span>{variables.filter(v => content.includes(v)).length} variables used</span>
              </div>

              {/* Button Builder */}
              <div className="pt-3 border-t">
                <p className="text-sm font-medium mb-2">Quick Reply Buttons (optional)</p>
                <div className="flex gap-2">
                  <Input placeholder="Button text (e.g., Pay Now)" className="text-sm" />
                  <Button variant="outline" size="sm"><Plus className="h-3 w-3" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Mobile Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mx-auto max-w-[320px]">
                {/* Phone Frame */}
                <div className="rounded-[2rem] border-4 border-gray-800 dark:border-gray-600 overflow-hidden bg-gray-100 dark:bg-gray-900">
                  {/* Status Bar */}
                  <div className="h-6 bg-gray-800 dark:bg-gray-700 flex items-center justify-center">
                    <div className="w-16 h-1 rounded-full bg-gray-600" />
                  </div>
                  {/* WhatsApp Header */}
                  <div className="bg-[#075e54] px-3 py-2 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">NC</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">Nature&apos;s Crates</p>
                      <p className="text-white/60 text-[10px]">Business Account</p>
                    </div>
                  </div>
                  {/* Chat Area */}
                  <div className="bg-[#e5ddd5] dark:bg-gray-800 min-h-[400px] p-3">
                    {content ? (
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm max-w-[85%] ml-auto">
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {previewContent || "Your message will appear here..."}
                        </p>
                        <p className="text-[10px] text-gray-400 text-right mt-1">10:30 AM ✓✓</p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 text-xs mt-20">
                        <Smartphone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        Start typing to see preview
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variables Used */}
          <Card>
            <CardHeader><CardTitle className="text-base text-sm">Variables Detected</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {variables.filter(v => content.includes(v)).map((v) => (
                  <Badge key={v} variant="success" className="text-[10px] font-mono">{v}</Badge>
                ))}
                {variables.filter(v => content.includes(v)).length === 0 && (
                  <p className="text-xs text-muted-foreground">No variables used yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
