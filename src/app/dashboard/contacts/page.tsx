"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus, Search, Upload, Download, Users, Phone, Mail,
  Tag, MoreVertical, FileSpreadsheet, X, Loader2, CheckCircle2,
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  tags: string[];
  source?: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [total, setTotal] = useState(0);

  // Form fields
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTags, setNewTags] = useState("");

  // Fetch contacts
  const fetchContacts = async (search?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/contacts?${params}`);
      const data = await res.json();
      if (data.success) {
        setContacts(data.data.contacts);
        setTotal(data.data.pagination.total);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  // Search with debounce
  useEffect(() => {
    const timeout = setTimeout(() => fetchContacts(searchQuery), 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Add contact
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          phone: newPhone.startsWith("+") ? newPhone : `+91${newPhone.replace(/\s/g, "")}`,
          email: newEmail || undefined,
          tags: newTags ? newTags.split(",").map(t => t.trim()) : [],
          source: "Manual",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess("Contact added successfully!");
        setNewName(""); setNewPhone(""); setNewEmail(""); setNewTags("");
        fetchContacts();
        setTimeout(() => { setShowAddForm(false); setFormSuccess(""); }, 1500);
      } else {
        setFormError(data.error || "Failed to add contact");
      }
    } catch { setFormError("Network error"); }
    setFormLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            {total} contacts in database
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = "/dashboard/upload"}>
            <Upload className="h-4 w-4 mr-2" /> Import CSV
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" /> Add Contact
          </Button>
        </div>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Add New Contact</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAddForm(false)}><X className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddContact} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input placeholder="Customer name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number *</label>
                    <Input placeholder="9876543210" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input placeholder="email@example.com" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input placeholder="VIP, Repeat, COD" value={newTags} onChange={(e) => setNewTags(e.target.value)} />
                  </div>
                </div>
                {formError && <p className="text-sm text-red-500">{formError}</p>}
                {formSuccess && <p className="text-sm text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" />{formSuccess}</p>}
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Contact"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search contacts..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* Contacts Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" /><p className="text-sm text-muted-foreground">Loading contacts...</p></div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="font-medium">No contacts yet</p>
              <p className="text-sm text-muted-foreground">Add contacts manually or import a CSV file</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b bg-accent/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Tags</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Source</th>
                </tr></thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-accent/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-brand-primary">{c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                          </div>
                          <span className="text-sm font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{c.phone}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{c.email || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {c.tags.map(tag => <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{c.source || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
