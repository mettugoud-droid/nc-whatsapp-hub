"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload, FileSpreadsheet, CheckCircle2, XCircle,
  Loader2, Download, Eye, AlertCircle, Settings, ArrowRight,
} from "lucide-react";
import { autoMapColumns, detectProfile, applyProfile, getBuiltInProfiles,
  REQUIRED_ORDER_FIELDS, REQUIRED_CONTACT_FIELDS, type FieldMapping,
} from "@/lib/column-mapper";

interface ParsedRow { [key: string]: string; }
interface ValidationError { row: number; field: string; detectedColumn: string; reason: string; }

/**
 * Proper CSV parser that handles:
 * - Quoted fields with commas inside: "123, MG Road, Mumbai"
 * - Escaped quotes: "He said ""hello"""
 * - Newlines inside quotes
 * - Mixed quoted/unquoted fields
 */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        current += '"';
        i++; // skip escaped quote
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(current);
        current = "";
      } else if (ch === '\n' || (ch === '\r' && next === '\n')) {
        row.push(current);
        current = "";
        if (row.some(cell => cell.trim() !== "")) rows.push(row);
        row = [];
        if (ch === '\r') i++; // skip \n after \r
      } else if (ch === '\r') {
        row.push(current);
        current = "";
        if (row.some(cell => cell.trim() !== "")) rows.push(row);
        row = [];
      } else {
        current += ch;
      }
    }
  }

  // Last field/row
  row.push(current);
  if (row.some(cell => cell.trim() !== "")) rows.push(row);

  return rows;
}

const INTERNAL_FIELDS = [
  "orderId", "phone", "customerName", "amount", "discount", "paymentMode",
  "orderStatus", "productName", "sku", "quantity", "awb", "trackingLink",
  "courier", "orderDate", "address", "email", "amountToCollect",
  "orderSource", "orderType", "weight", "shippingCharge",
  "settlementStatus", "settlementDate", "callStatus", "callRemarks",
];

export default function UploadPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"upload"|"mapping"|"preview"|"importing"|"done">("upload");
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [profileName, setProfileName] = useState<string|null>(null);
  const [importType, setImportType] = useState<"contacts"|"orders">("orders");
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
      const parsedRows = parseCSV(text);
      if (parsedRows.length < 2) { setError("File needs header + data rows"); return; }
      const hdrs = parsedRows[0].map(h => h.trim());
      setHeaders(hdrs);
      const parsed: ParsedRow[] = [];
      for (let i = 1; i < parsedRows.length; i++) {
        const values = parsedRows[i];
        const row: ParsedRow = {};
        hdrs.forEach((h, idx) => { row[h] = (values[idx] || "").trim(); });
        parsed.push(row);
      }
      setRows(parsed);
      // Auto-detect profile
      const profile = detectProfile(hdrs);
      if (profile) {
        setMappings(applyProfile(hdrs, profile));
        setProfileName(profile.name);
      } else {
        setMappings(autoMapColumns(hdrs));
        setProfileName(null);
      }
      setStep("mapping");
    };
    reader.readAsText(file);
  };

  const updateMapping = (internalField: string, csvHeader: string) => {
    setMappings(prev => {
      const filtered = prev.filter(m => m.internalField !== internalField);
      if (csvHeader) {
        filtered.push({ internalField, csvHeader, confidence: 100, method: "manual" });
      }
      return filtered;
    });
  };

  const getMappedHeader = (field: string) => mappings.find(m => m.internalField === field)?.csvHeader || "";

  const requiredFields = importType === "orders" ? REQUIRED_ORDER_FIELDS : REQUIRED_CONTACT_FIELDS;
  const missingRequired = requiredFields.filter(f => !getMappedHeader(f));

  const handleImport = async () => {
    setStep("importing");
    try {
      const mappingOverrides: Record<string, string> = {};
      mappings.forEach(m => { mappingOverrides[m.internalField] = m.csvHeader; });

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: rows, type: importType, mappingOverrides }),
      });
      const data = await res.json();
      if (data.success) { setResult(data.data); setStep("done"); }
      else { setError(data.error || "Import failed"); setStep("mapping"); }
    } catch (e: any) { setError(e.message); setStep("mapping"); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Data</h1>
        <p className="text-muted-foreground">Import orders and contacts from Shopdeck, Shopify, or any CSV</p>
      </div>

      {/* Type Toggle */}
      <div className="flex gap-2 p-1 rounded-lg bg-accent/50 w-fit">
        <button onClick={() => setImportType("orders")} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${importType === "orders" ? "bg-brand-primary text-white" : "text-muted-foreground"}`}>Import Orders</button>
        <button onClick={() => setImportType("contacts")} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${importType === "contacts" ? "bg-brand-primary text-white" : "text-muted-foreground"}`}>Import Contacts</button>
      </div>

      {/* Step 1: Upload */}
      {step === "upload" && (
        <Card><CardContent className="p-8">
          <div className="border-2 border-dashed rounded-xl p-12 text-center hover:border-brand-primary/50 transition-colors cursor-pointer" onClick={() => fileRef.current?.click()}>
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop your CSV/Excel file here</h3>
            <p className="text-sm text-muted-foreground mb-2">Supports Shopdeck, Shopify, WooCommerce exports</p>
            <p className="text-xs text-muted-foreground">Column names are auto-detected — no manual editing needed</p>
            <input ref={fileRef} type="file" accept=".csv,.txt,.xlsx" className="hidden" onChange={handleFileSelect} />
          </div>
          {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
        </CardContent></Card>
      )}

      {/* Step 2: Mapping */}
      {step === "mapping" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4" /> Column Mapping
                {profileName && <Badge variant="success" className="text-[10px]">{profileName}</Badge>}
                {!profileName && <Badge variant="warning" className="text-[10px]">Auto-detected</Badge>}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setStep("upload"); setRows([]); }}>Back</Button>
                <Button size="sm" onClick={handleImport} disabled={missingRequired.length > 0}>
                  <Upload className="h-3 w-3 mr-1" /> Import {rows.length} Records
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground mb-2">
              File: <strong>{fileName}</strong> — {rows.length} rows, {headers.length} columns
            </p>

            {missingRequired.length > 0 && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">Required fields not mapped:</p>
                  <p className="text-xs text-red-600">{missingRequired.join(", ")} — please select columns below</p>
                </div>
              </div>
            )}

            {/* Mapping Table */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {INTERNAL_FIELDS.map(field => {
                const mapping = mappings.find(m => m.internalField === field);
                const isRequired = requiredFields.includes(field);
                return (
                  <div key={field} className={`flex items-center gap-3 p-2.5 rounded-lg border ${isRequired && !mapping ? "border-red-300 bg-red-50/50 dark:bg-red-900/10" : "bg-accent/20"}`}>
                    <div className="w-40 flex items-center gap-1.5">
                      <span className="text-sm font-medium">{field}</span>
                      {isRequired && <span className="text-red-500 text-xs">*</span>}
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <select
                      className="flex-1 h-8 rounded-md border border-input bg-background px-2 text-sm"
                      value={mapping?.csvHeader || ""}
                      onChange={(e) => updateMapping(field, e.target.value)}
                    >
                      <option value="">— Not mapped —</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    {mapping && (
                      <Badge variant={mapping.confidence >= 90 ? "success" : mapping.confidence >= 70 ? "warning" : "outline"} className="text-[10px] w-12 justify-center">
                        {mapping.confidence}%
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Preview first 3 rows */}
            <div className="pt-3 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">Preview (first 3 rows mapped):</p>
              <div className="overflow-x-auto text-xs">
                <table className="w-full border">
                  <thead><tr className="bg-accent">{requiredFields.map(f => <th key={f} className="px-2 py-1 text-left">{f}</th>)}<th className="px-2 py-1 text-left">product</th></tr></thead>
                  <tbody>{rows.slice(0, 3).map((row, i) => {
                    const mapped: Record<string, string> = {};
                    mappings.forEach(m => { mapped[m.internalField] = row[m.csvHeader] || ""; });
                    return (
                      <tr key={i} className="border-t">{requiredFields.map(f => <td key={f} className="px-2 py-1">{mapped[f] || <span className="text-red-400">empty</span>}</td>)}<td className="px-2 py-1">{mapped.productName || "—"}</td></tr>
                    );
                  })}</tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Importing */}
      {step === "importing" && (
        <Card><CardContent className="p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-brand-primary mb-4" />
          <h3 className="text-lg font-semibold">Importing {rows.length} records...</h3>
        </CardContent></Card>
      )}

      {/* Step 4: Done */}
      {step === "done" && result && (
        <Card><CardContent className="p-8">
          <div className="text-center mb-6">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-1">Import Complete!</h3>
            {result.profileUsed && <p className="text-sm text-muted-foreground">Profile: {result.profileUsed}</p>}
          </div>
          <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-6">
            <div className="text-center"><p className="text-2xl font-bold text-green-600">{result.imported}</p><p className="text-xs text-muted-foreground">New</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-blue-600">{result.updated}</p><p className="text-xs text-muted-foreground">Updated</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-red-600">{result.failed}</p><p className="text-xs text-muted-foreground">Failed</p></div>
            <div className="text-center"><p className="text-2xl font-bold">{result.total}</p><p className="text-xs text-muted-foreground">Total</p></div>
          </div>

          {/* Validation Report */}
          {result.validationErrors?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2 flex items-center gap-1"><AlertCircle className="h-4 w-4 text-red-500" /> Validation Report ({result.validationErrors.length} issues)</p>
              <div className="max-h-[200px] overflow-y-auto border rounded-lg">
                <table className="w-full text-xs">
                  <thead className="bg-accent sticky top-0"><tr>
                    <th className="px-3 py-1.5 text-left">Row</th>
                    <th className="px-3 py-1.5 text-left">Field</th>
                    <th className="px-3 py-1.5 text-left">Column</th>
                    <th className="px-3 py-1.5 text-left">Reason</th>
                  </tr></thead>
                  <tbody>{result.validationErrors.map((e: ValidationError, i: number) => (
                    <tr key={i} className="border-t"><td className="px-3 py-1">{e.row}</td><td className="px-3 py-1 font-medium">{e.field}</td><td className="px-3 py-1">{e.detectedColumn}</td><td className="px-3 py-1 text-red-600">{e.reason}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mapping Used */}
          {result.mappingsApplied && (
            <details className="mb-4">
              <summary className="text-xs text-muted-foreground cursor-pointer">View mappings applied ({result.mappingsApplied.length} fields)</summary>
              <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                {result.mappingsApplied.map((m: any) => (
                  <div key={m.field} className="flex items-center gap-1 p-1 rounded bg-accent/30">
                    <span className="font-medium">{m.field}</span><ArrowRight className="h-2 w-2" /><span className="text-muted-foreground">{m.column}</span>
                  </div>
                ))}
              </div>
            </details>
          )}

          <div className="flex justify-center gap-3">
            <Button onClick={() => { setStep("upload"); setRows([]); setResult(null); }}>Upload Another</Button>
            <Button variant="outline" onClick={() => window.location.href = "/dashboard/contacts"}>View Data</Button>
          </div>
        </CardContent></Card>
      )}
    </div>
  );
}
