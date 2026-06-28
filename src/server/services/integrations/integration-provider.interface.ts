/**
 * Integration Provider Interface
 * 
 * Modular plugin architecture for external service integrations.
 * New integrations can be added by implementing this interface
 * without any core code changes.
 * 
 * Supported integrations:
 * - Shopdeck, Shopify, Amazon, Flipkart, WooCommerce
 * - Meta WhatsApp Cloud API, Interakt, AiSensy, WATI
 * - Google Sheets, n8n, Zapier
 */

export interface IntegrationConfig {
  id: string;
  name: string;
  type: IntegrationType;
  enabled: boolean;
  credentials: Record<string, string>;
  settings: Record<string, any>;
  lastSyncAt?: Date;
  syncInterval?: string; // cron expression
  webhookUrl?: string;
}

export type IntegrationType =
  | "ecommerce"     // Shopify, WooCommerce, Shopdeck, Amazon, Flipkart
  | "messaging"     // Meta WhatsApp, Interakt, AiSensy, WATI
  | "automation"    // n8n, Zapier
  | "data"          // Google Sheets
  | "payment";      // Razorpay, Cashfree, etc.

export interface SyncResult {
  success: boolean;
  provider: string;
  recordsSynced: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsFailed: number;
  errors: Array<{ record?: string; error: string }>;
  syncDuration: number;
  syncedAt: Date;
}

export interface OrderData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  product: string;
  amount: number;
  discount?: number;
  finalAmount: number;
  paymentMode: "COD" | "PREPAID";
  status: string;
  trackingNumber?: string;
  trackingLink?: string;
  source: string;
  orderDate: Date;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface IntegrationProvider {
  readonly name: string;
  readonly type: IntegrationType;
  readonly version: string;

  /** Initialize with credentials */
  initialize(config: IntegrationConfig): Promise<void>;

  /** Test connection to external service */
  testConnection(): Promise<{ success: boolean; message: string }>;

  /** Sync orders from external platform */
  syncOrders(since?: Date): Promise<SyncResult>;

  /** Push order status update to external platform */
  updateOrderStatus?(orderId: string, status: string): Promise<boolean>;

  /** Get webhook handler for incoming events */
  getWebhookHandler?(): (payload: any) => Promise<void>;

  /** Disconnect and cleanup */
  disconnect(): Promise<void>;
}

/**
 * Integration Registry
 * 
 * Manages all registered integration providers.
 * Providers register themselves on application startup.
 */
export class IntegrationRegistry {
  private providers: Map<string, IntegrationProvider> = new Map();
  private configs: Map<string, IntegrationConfig> = new Map();

  register(provider: IntegrationProvider): void {
    this.providers.set(provider.name, provider);
  }

  getProvider(name: string): IntegrationProvider | undefined {
    return this.providers.get(name);
  }

  getAllProviders(): IntegrationProvider[] {
    return Array.from(this.providers.values());
  }

  getByType(type: IntegrationType): IntegrationProvider[] {
    return this.getAllProviders().filter(p => p.type === type);
  }

  getEnabledProviders(): IntegrationProvider[] {
    return this.getAllProviders().filter(p => {
      const config = this.configs.get(p.name);
      return config?.enabled;
    });
  }

  setConfig(name: string, config: IntegrationConfig): void {
    this.configs.set(name, config);
  }

  getConfig(name: string): IntegrationConfig | undefined {
    return this.configs.get(name);
  }

  async syncAll(): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    for (const provider of this.getEnabledProviders()) {
      try {
        const result = await provider.syncOrders();
        results.push(result);
      } catch (error: any) {
        results.push({
          success: false,
          provider: provider.name,
          recordsSynced: 0,
          recordsCreated: 0,
          recordsUpdated: 0,
          recordsFailed: 0,
          errors: [{ error: error.message }],
          syncDuration: 0,
          syncedAt: new Date(),
        });
      }
    }
    return results;
  }
}

export const integrationRegistry = new IntegrationRegistry();
