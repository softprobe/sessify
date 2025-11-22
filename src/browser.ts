import { SessifyConfig } from "./config";
import { initSessionManager } from "./SessionManager";
import { SimpleHttpInterceptor } from "./SimpleHttpInterceptor";

export function initBrowserSessify(config: SessifyConfig): void {
  console.log("🚀 Initializing sessify...");

  initSessionManager(config.sessionStorageType);

  // Create a simple HTTP interceptor to inject tracestate headers
  new SimpleHttpInterceptor(config.siteName || 'default-site');

  console.log("🎯 Sessify initialized successfully with SimpleHttpInterceptor");
}