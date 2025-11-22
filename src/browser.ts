import { SessifyConfig } from "./config";
import { initSessionManager } from "./SessionManager";
import { SimpleHttpInterceptor } from "./SimpleHttpInterceptor";

export function initBrowserSessify(config: SessifyConfig): void {
  console.log("🚀 Initializing sessify...");

  initSessionManager(config.sessionStorageType);

  // 创建简单的HTTP拦截器来注入tracestate头
  new SimpleHttpInterceptor(config.siteName || 'default-site');

  console.log("🎯 Sessify initialized successfully with SimpleHttpInterceptor");
}