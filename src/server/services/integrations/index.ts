/**
 * Integration Module Entry Point
 * 
 * Registers all available integration providers.
 * Add new providers here without modifying core code.
 */

import { integrationRegistry } from "./integration-provider.interface";
import { ShopifyProvider } from "./shopify-provider";

// Register all available providers
integrationRegistry.register(new ShopifyProvider());

// Future providers (implement IntegrationProvider interface):
// integrationRegistry.register(new ShodeckProvider());
// integrationRegistry.register(new WooCommerceProvider());
// integrationRegistry.register(new AmazonProvider());
// integrationRegistry.register(new FlipkartProvider());
// integrationRegistry.register(new InteraktProvider());
// integrationRegistry.register(new AiSensyProvider());
// integrationRegistry.register(new WATIProvider());
// integrationRegistry.register(new GoogleSheetsProvider());
// integrationRegistry.register(new N8NProvider());
// integrationRegistry.register(new ZapierProvider());

export { integrationRegistry };
export type {
  IntegrationProvider,
  IntegrationConfig,
  IntegrationType,
  SyncResult,
  OrderData,
} from "./integration-provider.interface";
