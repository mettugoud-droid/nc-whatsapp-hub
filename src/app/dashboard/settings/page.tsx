"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Settings, CreditCard, MessageSquare, Shield, Bell, Key,
  CheckCircle2, Eye, EyeOff, Loader2, AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [showSecret, setShowSecret] = useState(false);
  const [activeSection, setActiveSection] = useState("payment");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState("");

  // Payment fields
  const [rzpKeyId, setRzpKeyId] = useState("");
  const [rzpKeySecret, setRzpKeySecret] = useState("");
  const [rzpWebhookSecret, setRzpWebhookSecret] = useState("");
  const [companyName, setCompanyName] = useState("Nature's Crates");
  const [paymentMode, setPaymentMode] = useState("sandbox");

  // WhatsApp fields
  const [waPhoneId, setWaPhoneId] = useState("");
  const [waAccessToken, setWaAccessToken] = useState("");
  const [waBusinessId, setWaBusinessId] = useState("");

  // COD Conversion fields
  const [discountPct, setDiscountPct] = useState("5");
  const [linkExpiry, setLinkExpiry] = useState("48");
  const [autoSend, setAutoSend] = useState(true);

  // Load saved settings on mount
  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const s = data.data.settings;
          const get = (key: string) => s.find((x: any) => x.key === key)?.value || "";
          setRzpKeyId(get("razorpay_key_id"));
          setRzpKeySecret(get("razorpay_key_secret"));
          setRzpWebhookSecret(get("razorpay_webhook_secret"));
          setCompanyName(get("company_name") || "Nature's Crates");
          setPaymentMode(get("payment_mode") || "sandbox");
          setWaPhoneId(get("whatsapp_phone_id"));
          setWaAccessToken(get("whatsapp_access_token"));
          setWaBusinessId(get("whatsapp_business_id"));
          setDiscountPct(get("cod_discount_percent") || "5");
          setLinkExpiry(get("cod_link_expiry_hours") || "48");
          setAutoSend(get("cod_auto_send") !== "false");
        }
      }).catch(() => {});
  }, []);

  // Save settings
  const saveSetting = async (key: string, value: string, category: string) => {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, category, encrypted: category === "payment" }),
    });
    return res.json();
  };

  const handleSavePayment = async () => {
    setSaving(true); setSaveMsg(""); setSaveError("");
    try {
      await Promise.all([
        saveSetting("razorpay_key_id", rzpKeyId, "payment"),
        saveSetting("razorpay_key_secret", rzpKeySecret, "payment"),
        saveSetting("razorpay_webhook_secret", rzpWebhookSecret, "payment"),
        saveSetting("company_name", companyName, "general"),
        saveSetting("payment_mode", paymentMode, "payment"),
      ]);
      setSaveMsg("Payment settings saved successfully!");
    } catch (e: any) { setSaveError(e.message || "Failed to save"); }
    setSaving(false);
  };

  const handleSaveWhatsApp = async () => {
    setSaving(true); setSaveMsg(""); setSaveError("");
    try {
      await Promise.all([
        saveSetting("whatsapp_phone_id", waPhoneId, "whatsapp"),
        saveSetting("whatsapp_access_token", waAccessToken, "whatsapp"),
        saveSetting("whatsapp_business_id", waBusinessId, "whatsapp"),
      ]);
      setSaveMsg("WhatsApp settings saved!");
    } catch (e: any) { setSaveError(e.message || "Failed to save"); }
    setSaving(false);
  };

  const handleSaveConversion = async () => {
    setSaving(true); setSaveMsg(""); setSaveError("");
    try {
      await Promise.all([
        saveSetting("cod_discount_percent", discountPct, "conversion"),
        saveSetting("cod_link_expiry_hours", linkExpiry, "conversion"),
        saveSetting("cod_auto_send", autoSend ? "true" : "false", "conversion"),
      ]);
      setSaveMsg("Conversion settings saved!");
    } catch (e: any) { setSaveError(e.message || "Failed to save"); }
    setSaving(false);
  };

  const sections = [
    { id: "payment", label: "Payment Gateway", icon: CreditCard },
    { id: "whatsapp", label: "WhatsApp API", icon: MessageSquare },
    { id: "conversion", label: "COD Conversion", icon: Settings },
    { id: "roles", label: "Roles & Access", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API Keys", icon: Key },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure integrations and preferences</p>
      </div>

      {/* Feedback */}
      {saveMsg && <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{saveMsg}</div>}
      {saveError && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" />{saveError}</div>}

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <Card className="h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button key={section.id} onClick={() => { setActiveSection(section.id); setSaveMsg(""); setSaveError(""); }}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === section.id ? "bg-brand-primary text-white" : "text-muted-foreground hover:bg-accent"}`}>
                  <section.icon className="h-4 w-4" />{section.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* PAYMENT */}
          {activeSection === "payment" && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-brand-primary" />Razorpay Configuration</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Razorpay Key ID</label>
                    <Input placeholder="rzp_live_xxxxxxxxxxxxx" value={rzpKeyId} onChange={(e) => setRzpKeyId(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Razorpay Key Secret</label>
                    <div className="relative">
                      <Input type={showSecret ? "text" : "password"} placeholder="Enter secret key" value={rzpKeySecret} onChange={(e) => setRzpKeySecret(e.target.value)} />
                      <button onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2">
                        {showSecret ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Webhook Secret</label>
                    <Input type="password" placeholder="Webhook secret" value={rzpWebhookSecret} onChange={(e) => setRzpWebhookSecret(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="mode" checked={paymentMode === "sandbox"} onChange={() => setPaymentMode("sandbox")} />Sandbox Mode
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="mode" checked={paymentMode === "production"} onChange={() => setPaymentMode("production")} />Production Mode
                  </label>
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={handleSavePayment} disabled={saving}>
                    {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save Configuration"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* WHATSAPP */}
          {activeSection === "whatsapp" && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-green-600" />WhatsApp Cloud API</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number ID</label>
                    <Input placeholder="Enter phone number ID" value={waPhoneId} onChange={(e) => setWaPhoneId(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Access Token</label>
                    <Input type="password" placeholder="Enter access token" value={waAccessToken} onChange={(e) => setWaAccessToken(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Account ID</label>
                  <Input placeholder="Enter WABA ID" value={waBusinessId} onChange={(e) => setWaBusinessId(e.target.value)} />
                </div>
                <Button onClick={handleSaveWhatsApp} disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save WhatsApp Settings"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* COD CONVERSION */}
          {activeSection === "conversion" && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-brand-secondary" />COD Conversion Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Discount Percentage</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={discountPct} onChange={(e) => setDiscountPct(e.target.value)}>
                      <option value="5">5%</option><option value="6">6%</option><option value="7">7%</option><option value="10">10%</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Link Expiry</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={linkExpiry} onChange={(e) => setLinkExpiry(e.target.value)}>
                      <option value="24">24 hours</option><option value="48">48 hours</option><option value="72">72 hours</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={autoSend} onChange={(e) => setAutoSend(e.target.checked)} className="rounded" />
                  <span className="text-sm">Auto-send enabled (automatically process new COD orders)</span>
                </label>
                <Button onClick={handleSaveConversion} disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save Conversion Settings"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ROLES */}
          {activeSection === "roles" && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Roles & Access</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[{ role: "Admin", perms: "Full access", users: 1, color: "bg-red-100 text-red-700" },
                  { role: "Marketing", perms: "Campaigns, Templates, Reports", users: 1, color: "bg-blue-100 text-blue-700" },
                  { role: "Sales", perms: "Contacts, Messages, COD Conversion", users: 0, color: "bg-green-100 text-green-700" },
                  { role: "Support", perms: "Messages, Contacts (Read-only)", users: 0, color: "bg-yellow-100 text-yellow-700" },
                ].map(r => (
                  <div key={r.role} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${r.color}`}>{r.role}</span>
                      <div><p className="text-sm">{r.perms}</p><p className="text-xs text-muted-foreground">{r.users} user(s)</p></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {["Campaign completed", "Payment received", "Payment link expired", "New COD order", "NDR raised", "Daily analytics summary"].map(n => (
                  <div key={n} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm">{n}</span><input type="checkbox" defaultChecked className="rounded" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* API KEYS */}
          {activeSection === "api" && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" />API Keys & Webhooks</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/50 border">
                  <p className="text-sm font-medium mb-2">Webhook Endpoints</p>
                  <div className="space-y-2 text-xs font-mono">
                    <p>Razorpay: <code className="bg-background p-1 rounded">https://nc-whatsapp-hub.vercel.app/api/webhooks/razorpay</code></p>
                    <p>WhatsApp: <code className="bg-background p-1 rounded">https://nc-whatsapp-hub.vercel.app/api/webhooks/whatsapp</code></p>
                    <p>Automation: <code className="bg-background p-1 rounded">https://nc-whatsapp-hub.vercel.app/api/automation</code></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
