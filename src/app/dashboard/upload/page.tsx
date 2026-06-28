"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload, FileSpreadsheet, CheckCircle2, XCircle, Clock,
  Download, RefreshCw, Eye, Settings, AlertCircle, User,
} from "lucide-react";

const importHistory = [
  { id: "1", fileName: "orders_oct_20.csv", uploadedBy: "Admin", totalRows: 1250, imported: 1180, updated: 45, failed: 25, status: "completed", time: "2.3s", date: "Today, 10:30 AM" },
  { id: "2", fileName: "shopify_export.xlsx", uploadedBy: "Marketing", totalRows: 3400, imported: 3200, updated: 150, failed: 50, status: "completed", time: "8.1s", date: "Today, 09:00 AM" },
  { id: "3", fileName: "shopdeck_orders.csv", uploadedBy: "Sales", totalRows: 890, imported: 870, updated: 12, failed: 8, status: "completed", time: "1.5s", date: "Yesterday, 04:30 PM" },
  { id: "4", fileName: "bulk_contacts.csv", uploadedBy: "Admin", totalRows: 15000, imported: 14850, updated: 0, failed: 150, status: "partial", time: "45.2s", date: "Yesterday, 11:00 AM" },
];


const columnPreview = [
  { source: "Order ID", target: "order_id", confidence: 98 },
  { source: "Customer Name", target: "customer_name", confidence: 95 },
  { source: "Mobile No", target: "phone", confidence: 88 },
  { source: "Product", target: "product", confidence: 92 },
  { source: "Total Amount", target: "amount", confidence: 85 },
  { source: "Payment Type", target: "payment_mode", confidence: 90 },
  { source: "Status", target: "order_status", confidence: 82 },
];

export default function UploadPage() {
  const [step, setStep] = useState<"upload" | "mapping" | "preview" | "processing" | "complete">("upload");
  const [progress, setProgress] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Upload</h1>
          <p className="text-muted-foreground">
            Import orders, contacts, and data from CSV/Excel files
          </p>
        </div>
        <Button variant="outline">
          <Clock className="h-4 w-4 mr-2" />
          Import History
        </Button>
      </div>


      {/* Upload Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-primary/10">
              <Upload className="h-4 w-4 text-brand-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Upload</p>
              <p className="text-sm font-bold">Today, 10:30 AM</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Imported</p>
              <p className="text-sm font-bold">20,100</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <RefreshCw className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Updated Orders</p>
              <p className="text-sm font-bold">207</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Failed Records</p>
              <p className="text-sm font-bold">233</p>
            </div>
          </div>
        </Card>
      </div>


      {/* Upload Zone */}
      {step === "upload" && (
        <Card>
          <CardContent className="p-8">
            <div className="border-2 border-dashed rounded-xl p-12 text-center hover:border-brand-primary/50 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Drop your file here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supports CSV, Excel (.xlsx, .xls) — up to 100,000+ records
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {["CSV", "Excel", "Google Sheets", "Shopify", "WooCommerce", "Shopdeck", "Amazon", "Flipkart"].map((src) => (
                  <Badge key={src} variant="outline" className="text-xs">{src}</Badge>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                <Button onClick={() => setStep("mapping")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Use Saved Mapping
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Required: Order ID, Customer Name, Phone | Optional: Product, Amount, Payment Mode, Status
              </p>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Column Mapping Step */}
      {step === "mapping" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" /> Column Mapping
              <Badge variant="success" className="ml-2 text-[10px]">Auto-detected</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {columnPreview.map((col) => (
                <div key={col.source} className="flex items-center gap-4 p-3 rounded-lg bg-accent/30">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{col.source}</p>
                  </div>
                  <div className="text-muted-foreground text-sm">→</div>
                  <div className="flex-1">
                    <select className="w-full text-sm rounded-md border px-2 py-1.5">
                      <option>{col.target}</option>
                    </select>
                  </div>
                  <Badge variant={col.confidence > 90 ? "success" : "warning"} className="text-[10px]">
                    {col.confidence}%
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep("preview")}>
                <Eye className="h-4 w-4 mr-2" /> Preview Import
              </Button>
              <Button variant="outline" onClick={() => setStep("upload")}>Back</Button>
              <Button variant="ghost">Save as Template</Button>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Preview Step */}
      {step === "preview" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-700 dark:text-green-300">New Records</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">1,180</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300">Updates</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">45</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">Duplicates (Skip)</p>
                <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">25</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/50 mb-4">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm">3 records have invalid phone numbers (will be imported without phone)</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep("complete")}>
                <Upload className="h-4 w-4 mr-2" /> Start Import
              </Button>
              <Button variant="outline" onClick={() => setStep("mapping")}>Back to Mapping</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {step === "complete" && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Import Complete!</h3>
            <p className="text-muted-foreground mb-4">1,250 records processed in 2.3 seconds</p>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
              <div><p className="text-lg font-bold text-green-600">1,180</p><p className="text-xs text-muted-foreground">Imported</p></div>
              <div><p className="text-lg font-bold text-blue-600">45</p><p className="text-xs text-muted-foreground">Updated</p></div>
              <div><p className="text-lg font-bold text-red-600">25</p><p className="text-xs text-muted-foreground">Failed</p></div>
              <div><p className="text-lg font-bold text-yellow-600">0</p><p className="text-xs text-muted-foreground">Duplicates</p></div>
            </div>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setStep("upload")}>Upload Another</Button>
              <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Error Log</Button>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-accent/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">File</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Uploaded By</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Total</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Imported</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Updated</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Failed</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Time</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {importHistory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-accent/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-brand-primary" />
                        <div>
                          <p className="text-sm font-medium">{item.fileName}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.uploadedBy}</td>
                    <td className="px-4 py-3 text-sm text-right">{item.totalRows.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-green-600">{item.imported.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right text-blue-600">{item.updated}</td>
                    <td className="px-4 py-3 text-sm text-right text-red-600">{item.failed}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={item.status === "completed" ? "success" : "warning"} className="text-[10px]">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.time}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Download className="h-3 w-3" />
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
