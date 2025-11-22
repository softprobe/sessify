import { SessifyConfig } from "./config";
import { initSessionManager } from "./SessionManager";
import { SimpleHttpInterceptor, CustomTraceState } from "./SimpleHttpInterceptor";

export function initBrowserSessify(config: SessifyConfig): void {
  console.log("🚀 Initializing sessify...");

  initSessionManager(config.sessionStorageType);

  // Create a simple HTTP interceptor to inject tracestate headers
  let customTraceState: CustomTraceState | string | undefined;
  
  if (config.customTraceState) {
    // Use custom key-value pairs if provided
    customTraceState = config.customTraceState;
  } else if (config.siteName) {
    // Fallback to siteName for backward compatibility
    customTraceState = config.siteName;
  }
  
  new SimpleHttpInterceptor(customTraceState);

  console.log("🎯 Sessify initialized successfully with SimpleHttpInterceptor");
}
