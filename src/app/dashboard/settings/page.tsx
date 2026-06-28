"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  CreditCard,
  MessageSquare,
  Shield,
  Users,
  Bell,
  Key,
  Globe,
  Clock,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const [showSecret, setShowSecret] = useState(false);
  const [activeSection, setActiveSection] = useState("payment");

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
        <p className="text-muted-foreground">
          Configure your WhatsApp Hub preferences and integrations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <Card className="h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? "bg-brand-primary text-white"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === "payment" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-brand-primary" />
                    Razorpay Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Razorpay Key ID
                      </label>
                      <Input placeholder="rzp_live_xxxxxxxxxxxxx" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Razorpay Key Secret
                      </label>
                      <div className="relative">
                        <Input
                          type={showSecret ? "text" : "password"}
                          placeholder="Enter secret key"
                        />
                        <button
                          onClick={() => setShowSecret(!showSecret)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showSecret ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name</label>
                      <Input defaultValue="Nature's Crates" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Webhook Secret
                      </label>
                      <Input type="password" placeholder="Webhook secret" />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Payment Success URL
                      </label>
                      <Input placeholder="https://naturescrates.in/payment/success" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Payment Failure URL
                      </label>
                      <Input placeholder="https://naturescrates.in/payment/failure" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <input type="radio" name="mode" id="sandbox" defaultChecked />
                      <label htmlFor="sandbox" className="text-sm">
                        Sandbox Mode
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="mode" id="production" />
                      <label htmlFor="production" className="text-sm">
                        Production Mode
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t">
                    <Button>Save Configuration</Button>
                    <Button variant="outline">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === "whatsapp" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  WhatsApp Cloud API Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Phone Number ID
                    </label>
                    <Input placeholder="Enter phone number ID" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Access Token</label>
                    <Input type="password" placeholder="Enter access token" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Business Account ID
                    </label>
                    <Input placeholder="Enter business account ID" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">API Version</label>
                    <Input defaultValue="v18.0" />
                  </div>
                </div>
                <Button>Save WhatsApp Settings</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "conversion" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-brand-secondary" />
                  COD Conversion Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Discount Percentage
                    </label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>5%</option>
                      <option>6%</option>
                      <option>7%</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Payment Link Expiry
                    </label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>24 hours</option>
                      <option>48 hours</option>
                      <option>72 hours</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-medium">Reminder Schedule</p>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="p-3 rounded-lg border">
                      <p className="text-xs font-medium mb-1">Reminder 1</p>
                      <p className="text-sm text-muted-foreground">After 6 hours</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-xs font-medium mb-1">Reminder 2</p>
                      <p className="text-sm text-muted-foreground">After 24 hours</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-xs font-medium mb-1">Reminder 3 (Final)</p>
                      <p className="text-sm text-muted-foreground">After 48 hours</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="auto-send" defaultChecked />
                  <label htmlFor="auto-send" className="text-sm">
                    Auto-send enabled (automatically process new COD orders)
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Name</label>
                    <Input defaultValue="Nature's Crates" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Customer Support Number
                    </label>
                    <Input defaultValue="+91 98765 43210" />
                  </div>
                </div>
                <Button>Save Conversion Settings</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "roles" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-brand-primary" />
                  Roles & Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { role: "Admin", permissions: "Full access to all features", users: 1, color: "bg-red-100 text-red-700" },
                  { role: "Marketing", permissions: "Campaigns, Templates, Reports, Analytics", users: 2, color: "bg-blue-100 text-blue-700" },
                  { role: "Sales", permissions: "Contacts, Messages, COD Conversion", users: 3, color: "bg-green-100 text-green-700" },
                  { role: "Customer Support", permissions: "Messages, Contacts (Read-only Reports)", users: 2, color: "bg-yellow-100 text-yellow-700" },
                ].map((item) => (
                  <div
                    key={item.role}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${item.color}`}>
                        {item.role}
                      </span>
                      <div>
                        <p className="text-sm">{item.permissions}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.users} user(s)
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-brand-secondary" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Campaign completed", enabled: true },
                  { label: "Payment received", enabled: true },
                  { label: "Payment link expired", enabled: true },
                  { label: "Message delivery failed", enabled: false },
                  { label: "New COD order detected", enabled: true },
                  { label: "Daily analytics summary", enabled: true },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <span className="text-sm">{item.label}</span>
                    <input type="checkbox" defaultChecked={item.enabled} />
                  </div>
                ))}
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "api" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-brand-primary" />
                  API Keys & Webhooks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/50 border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Production API Key</p>
                    <Badge variant="success" className="text-[10px]">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-background p-2 rounded border font-mono">
                      nc_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    </code>
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created: Oct 1, 2024 &bull; Last used: 2 hours ago
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/50 border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Webhook URL</p>
                    <Badge variant="info" className="text-[10px]">
                      Configured
                    </Badge>
                  </div>
                  <code className="block text-xs bg-background p-2 rounded border font-mono">
                    https://api.naturescrates.in/webhooks/razorpay
                  </code>
                </div>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Key
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Plus(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
