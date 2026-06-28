"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload, FileSpreadsheet, CheckCircle2, XCircle,
  Loader2, Download, Eye, AlertCircle,
} from "lucide-react";

interface ParsedRow { [key: string]: string; }

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"upload" | "preview" | "importing" | "done">("upload");
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [importType, setImportType] = useState<"contacts" | "orders">("orders");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError("");

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) { setError("File must have at least a header and one data row"); return; }

      const hdrs = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
      setHeaders(hdrs);

      const parsed: ParsedRow[] = [];
      for (let i = 1; i < Math.min(lines.length, 1001); i++) {
        const values = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
        const row: ParsedRow = {};
        hdrs.forEach((h, idx) => { row[h] = values[idx] || ""; });
        parsed.push(row);
      }
      setRows(parsed);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setStep("importing");
    try {
      // Map CSV columns to expected format
      const records = rows.map(row => {
        if (importType === "contacts") {
          return {
            name: row["Customer Name"] || row["Name"] || row["customer_name"] || row["name"] || "",
            phone: row["Phone"] || row["Mobile"] || row["Phone Number"] || row["phone"] || row["mobile"] || "",
            email: row["Email"] || row["email"] || "",
            tags: [],
            source: "CSV Import",
          };
        } else {
          return {
            orderId: row["Order ID"] || row["order_id"] || row["OrderID"] || row["Order No"] || "",
            customerName: row["Customer Name"] || row["Name"] || row["customer_name"] || "",
            phone: row["Phone"] || row["Mobile"] || row["Phone Number"] || row["phone"] || "",
            product: row["Product"] || row["product"] || row["Item"] || "",
            amount: row["Amount"] || row["Total"] || row["amount"] || row["Order Amount"] || "0",
            discount: row["Discount"] || row["discount"] || "0",
            paymentMode: row["Payment Mode"] || row["Payment"] || row["payment_mode"] || "COD",
            status: row["Status"] || row["status"] || row["Order Status"] || "PENDING",
            trackingNumber: row["Tracking"] || row["AWB"] || row["tracking_number"] || "",
            couponCode: row["Coupon"] || row["coupon"] || "",
            source: "CSV Import",
          };
        }
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records, type: importType }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setStep("done");
      } else {
        setError(data.error || "Import failed");
        setStep("preview");
      }
    } catch (e: any) {
      setError(e.message || "Network error");
      setStep("preview");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Data</h1>
        <p className="text-muted-foreground">Import contacts and orders from CSV files</p>
      </div>

      {/* Import Type Toggle */}
      <div className="flex gap-2 p-1 rounded-lg bg-accent/50 w-fit">
        <button onClick={() => setImportType("orders")} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${importType === "orders" ? "bg-brand-primary text-white" : "text-muted-foreground"}`}>Import Orders</button>
        <button onClick={() => setImportType("contacts")} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${importType === "contacts" ? "bg-brand-primary text-white" : "text-muted-foreground"}`}>Import Contacts</button>
      </div>

      {/* Upload Step */}
      {step === "upload" && (
        <Card>
          <CardContent className="p-8">
            <div className="border-2 border-dashed rounded-xl p-12 text-center hover:border-brand-primary/50 transition-colors cursor-pointer" onClick={() => fileRef.current?.click()}>
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Drop your CSV file here or click to browse</h3>
              <p className="text-sm text-muted-foreground mb-4">Supports .csv files with headers</p>
              {importType === "orders" ? (
                <p className="text-xs text-muted-foreground">Expected columns: Order ID, Customer Name, Phone, Product, Amount, Payment Mode, Status</p>
              ) : (
                <p className="text-xs text-muted-foreground">Expected columns: Name, Phone, Email (optional), Tags (optional)</p>
              )}
              <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileSelect} />
            </div>
            {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
          </CardContent>
        </Card>
      )}

      {/* Preview Step */}
      {step === "preview" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" /> Preview: {fileName}
                <Badge variant="outline">{rows.length} rows</Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setStep("upload"); setRows([]); setHeaders([]); }}>Back</Button>
                <Button onClick={handleImport}><Upload className="h-4 w-4 mr-2" /> Import {rows.length} Records</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-accent">
                  <tr>{headers.map(h => <th key={h} className="text-left px-3 py-2 text-xs font-medium">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.slice(0, 20).map((row, i) => (
                    <tr key={i} className="border-t">
                      {headers.map(h => <td key={h} className="px-3 py-1.5 text-xs">{row[h] || "—"}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 20 && <p className="text-xs text-muted-foreground mt-2 text-center">Showing first 20 of {rows.length} rows</p>}
            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
          </CardContent>
        </Card>
      )}

      {/* Importing Step */}
      {step === "importing" && (
        <Card><CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-brand-primary mb-4" />
          <h3 className="text-lg font-semibold">Importing {rows.length} records...</h3>
          <p className="text-sm text-muted-foreground">Please wait, this may take a moment</p>
        </CardContent></Card>
      )}

      {/* Done Step */}
      {step === "done" && result && (
        <Card><CardContent className="p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Import Complete!</h3>
          <p className="text-muted-foreground mb-6">{result.total} records processed</p>
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
            <div><p className="text-2xl font-bold text-green-600">{result.imported}</p><p className="text-xs text-muted-foreground">Imported</p></div>
            <div><p className="text-2xl font-bold text-blue-600">{result.updated}</p><p className="text-xs text-muted-foreground">Updated</p></div>
            <div><p className="text-2xl font-bold text-red-600">{result.failed}</p><p className="text-xs text-muted-foreground">Failed</p></div>
            <div><p className="text-2xl font-bold">{result.total}</p><p className="text-xs text-muted-foreground">Total</p></div>
          </div>
          {result.errors?.length > 0 && (
            <div className="text-left max-w-md mx-auto mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-xs font-medium text-red-700 mb-1">Errors ({result.errors.length}):</p>
              {result.errors.slice(0, 5).map((e: string, i: number) => <p key={i} className="text-xs text-red-600 truncate">{e}</p>)}
            </div>
          )}
          <div className="flex justify-center gap-3">
            <Button onClick={() => { setStep("upload"); setRows([]); setResult(null); }}>Upload Another</Button>
            <Button variant="outline" onClick={() => window.location.href = importType === "contacts" ? "/dashboard/contacts" : "/dashboard/analytics"}>View {importType === "contacts" ? "Contacts" : "Orders"}</Button>
          </div>
        </CardContent></Card>
      )}
    </div>
  );
}
