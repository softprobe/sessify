import { CustomTraceState } from "./SimpleHttpInterceptor";

export type SessifyConfig = {
  
  /**
   * Custom key-value pairs to include in tracestate headers
   */
  customTraceState?: CustomTraceState;
  // --- Session Management ---
  sessionStorageType?: 'session' | 'local';
};
