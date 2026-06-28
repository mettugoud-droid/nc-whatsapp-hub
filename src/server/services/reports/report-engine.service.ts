/**
 * Report Engine Service
 * 
 * - Export reports to Excel, CSV, PDF, PowerPoint, PNG
 * - Schedule reports (daily, weekly, monthly)
 * - Email delivery to administrators
 * - Pre-built report templates
 */

export type ReportFormat = "excel" | "csv" | "pdf" | "pptx" | "png";
export type ReportSchedule = "daily" | "weekly" | "monthly" | "on_demand";

export interface ReportConfig {
  id: string;
  name: string;
  type: string;
  description: string;
  format: ReportFormat;
  schedule: ReportSchedule;
  recipients: string[]; // email addresses
  filters?: Record<string, any>;
  lastGeneratedAt?: Date;
  nextScheduledAt?: Date;
  isActive: boolean;
}

export interface GeneratedReport {
  id: string;
  configId: string;
  name: string;
  format: ReportFormat;
  fileSize: number;
  downloadUrl: string;
  generatedAt: Date;
  generatedBy: string;
  parameters?: Record<string, any>;
}

export interface ReportData {
  title: string;
  subtitle?: string;
  generatedAt: Date;
  sections: ReportSection[];
  summary?: Record<string, string | number>;
}

export interface ReportSection {
  title: string;
  type: "table" | "chart" | "summary" | "text";
  data: any;
}

// Pre-built report templates
const REPORT_TEMPLATES: Record<string, { name: string; description: string; type: string }> = {
  cod_vs_prepaid: {
    name: "COD vs Prepaid Orders",
    description: "Comparison of payment modes with conversion trends",
    type: "conversion",
  },
  prepaid_conversion_rate: {
    name: "Prepaid Conversion Rate",
    description: "Weekly COD to prepaid conversion analysis",
    type: "conversion",
  },
  revenue_from_conversions: {
    name: "Revenue from Converted Orders",
    description: "Total revenue collected from COD-to-prepaid conversions",
    type: "revenue",
  },
  campaign_performance: {
    name: "Campaign Performance",
    description: "Detailed metrics for all WhatsApp campaigns",
    type: "campaign",
  },
  razorpay_collections: {
    name: "Razorpay Collections",
    description: "Discounts offered and payments collected",
    type: "payment",
  },
  payment_failures: {
    name: "Payment Failures",
    description: "Failed payments and expired links analysis",
    type: "payment",
  },
  campaign_conversion: {
    name: "Campaign-wise Conversion",
    description: "Conversion rates broken down by campaign",
    type: "campaign",
  },
  cod_conversion_roi: {
    name: "COD Conversion ROI",
    description: "Return on investment for conversion campaigns",
    type: "revenue",
  },
  customer_ltv: {
    name: "Customer Lifetime Value",
    description: "CLV analysis with purchase frequency segmentation",
    type: "customer",
  },
  delivery_report: {
    name: "Message Delivery Report",
    description: "Comprehensive delivery, read, and response rates",
    type: "messaging",
  },
  courier_performance: {
    name: "Courier Performance",
    description: "Delivery success rates by courier partner",
    type: "operations",
  },
  rto_analysis: {
    name: "RTO Analysis",
    description: "Return to origin patterns by city, product, and customer",
    type: "operations",
  },
  top_products: {
    name: "Top Products Report",
    description: "Best-selling products with revenue and repeat rates",
    type: "product",
  },
  top_cities: {
    name: "Top Cities Report",
    description: "Revenue and order analysis by city/region",
    type: "geography",
  },
};

export class ReportEngineService {
  private scheduledReports: ReportConfig[] = [];
  private generatedReports: GeneratedReport[] = [];

  /**
   * Get available report templates
   */
  getTemplates() {
    return REPORT_TEMPLATES;
  }

  /**
   * Generate report data (in production: query database)
   */
  async generateReport(templateId: string, filters?: Record<string, any>): Promise<ReportData> {
    const template = REPORT_TEMPLATES[templateId];
    if (!template) throw new Error(`Report template '${templateId}' not found`);

    return {
      title: template.name,
      subtitle: template.description,
      generatedAt: new Date(),
      sections: [],
      summary: {},
    };
  }

  /**
   * Schedule a report for recurring generation
   */
  scheduleReport(config: Omit<ReportConfig, "id">): ReportConfig {
    const report: ReportConfig = {
      ...config,
      id: `report_${Date.now()}`,
    };
    this.scheduledReports.push(report);
    return report;
  }

  /**
   * Get scheduled reports
   */
  getScheduledReports(): ReportConfig[] {
    return this.scheduledReports;
  }

  /**
   * Get generated report history
   */
  getGeneratedReports(limit: number = 20): GeneratedReport[] {
    return this.generatedReports.slice(0, limit);
  }

  /**
   * Export report in specified format
   */
  async exportReport(reportData: ReportData, format: ReportFormat): Promise<{
    fileName: string;
    mimeType: string;
    content: Buffer | string;
  }> {
    const timestamp = new Date().toISOString().split("T")[0];
    const baseName = reportData.title.replace(/\s+/g, "_").toLowerCase();

    switch (format) {
      case "csv":
        return {
          fileName: `${baseName}_${timestamp}.csv`,
          mimeType: "text/csv",
          content: this.toCSV(reportData),
        };
      case "excel":
        return {
          fileName: `${baseName}_${timestamp}.xlsx`,
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          content: Buffer.from(""), // In production: use xlsx library
        };
      case "pdf":
        return {
          fileName: `${baseName}_${timestamp}.pdf`,
          mimeType: "application/pdf",
          content: Buffer.from(""), // In production: use puppeteer/pdfkit
        };
      case "pptx":
        return {
          fileName: `${baseName}_${timestamp}.pptx`,
          mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          content: Buffer.from(""), // In production: use pptxgenjs
        };
      case "png":
        return {
          fileName: `${baseName}_${timestamp}.png`,
          mimeType: "image/png",
          content: Buffer.from(""), // In production: use html2canvas
        };
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private toCSV(data: ReportData): string {
    // Simple CSV generation
    let csv = `Report: ${data.title}\nGenerated: ${data.generatedAt.toISOString()}\n\n`;
    if (data.summary) {
      csv += Object.entries(data.summary).map(([k, v]) => `${k},${v}`).join("\n");
    }
    return csv;
  }
}

export const reportEngine = new ReportEngineService();
