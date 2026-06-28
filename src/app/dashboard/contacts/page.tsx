"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Search,
  Upload,
  Download,
  Users,
  Phone,
  Mail,
  Tag,
  MoreVertical,
  FileSpreadsheet,
} from "lucide-react";

const contacts = [
  { id: "1", name: "Rahul Sharma", phone: "+91 98765 43210", email: "rahul@gmail.com", tags: ["VIP", "Repeat"], orders: 12, lastMessage: "2h ago", source: "Shopify" },
  { id: "2", name: "Priya Gupta", phone: "+91 87654 32109", email: "priya@yahoo.com", tags: ["New"], orders: 2, lastMessage: "1d ago", source: "CSV" },
  { id: "3", name: "Amit Patel", phone: "+91 76543 21098", email: "amit.p@gmail.com", tags: ["COD", "Active"], orders: 8, lastMessage: "3h ago", source: "WooCommerce" },
  { id: "4", name: "Neha Singh", phone: "+91 65432 10987", email: "neha.s@outlook.com", tags: ["Prepaid", "VIP"], orders: 15, lastMessage: "5m ago", source: "Shopify" },
  { id: "5", name: "Vikram Reddy", phone: "+91 54321 09876", email: "vikram@gmail.com", tags: ["COD"], orders: 3, lastMessage: "2d ago", source: "Shopdeck" },
  { id: "6", name: "Anita Verma", phone: "+91 43210 98765", email: "anita.v@gmail.com", tags: ["Active", "Repeat"], orders: 9, lastMessage: "12h ago", source: "Excel" },
  { id: "7", name: "Suresh Kumar", phone: "+91 32109 87654", email: "suresh.k@yahoo.com", tags: ["Inactive"], orders: 1, lastMessage: "30d ago", source: "Google Sheets" },
  { id: "8", name: "Deepika Nair", phone: "+91 21098 76543", email: "deepika@gmail.com", tags: ["VIP", "Prepaid"], orders: 22, lastMessage: "1h ago", source: "Shopify" },
];

const importOptions = [
  { name: "CSV File", icon: FileSpreadsheet },
  { name: "Excel (.xlsx)", icon: FileSpreadsheet },
  { name: "Google Sheets", icon: FileSpreadsheet },
  { name: "Shopify", icon: FileSpreadsheet },
  { name: "WooCommerce", icon: FileSpreadsheet },
  { name: "Shopdeck", icon: FileSpreadsheet },
];

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showImport, setShowImport] = useState(false);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your customer contact list
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImport(!showImport)}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Import Panel */}
      {showImport && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Import Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {importOptions.map((opt) => (
                  <button
                    key={opt.name}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-brand-primary hover:bg-brand-primary/5 transition-all"
                  >
                    <opt.icon className="h-6 w-6 text-brand-primary" />
                    <span className="text-xs font-medium">{opt.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">
                  Drop your file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Columns: Customer Name, Phone Number, Order ID, Product, Amount, Offer, Status
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-primary/10">
              <Users className="h-4 w-4 text-brand-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{contacts.length}</p>
              <p className="text-xs text-muted-foreground">Total Contacts</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Phone className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">6</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-secondary/10">
              <Tag className="h-4 w-4 text-brand-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">VIP Customers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-muted-foreground">Sources</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Contacts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-accent/30">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Source
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Last Message
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b hover:bg-accent/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-brand-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-brand-primary">
                            {contact.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {contact.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{contact.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={
                              tag === "VIP"
                                ? "secondary"
                                : tag === "COD"
                                ? "warning"
                                : tag === "Inactive"
                                ? "outline"
                                : "success"
                            }
                            className="text-[10px]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{contact.orders}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[10px]">
                        {contact.source}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {contact.lastMessage}
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
