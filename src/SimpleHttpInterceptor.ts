import { getSessionId } from "./SessionManager";

export interface CustomTraceState {
  [key: string]: string;
}

/**
 * Simple HTTP request interceptor that directly injects tracestate headers
 */
export class SimpleHttpInterceptor {
  private customTraceState?: CustomTraceState;

  constructor(customTraceState?: CustomTraceState | string) {
    // Handle both string (backward compatibility) and object formats
    if (typeof customTraceState === 'string') {
      this.customTraceState = { 'x-sp-site': customTraceState };
    } else {
      this.customTraceState = customTraceState;
    }
    this.interceptFetch();
  }

  private interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      console.log('SimpleHttpInterceptor: Intercepting fetch request to:', input);
      console.log('SimpleHttpInterceptor: Current customTraceState:', this.customTraceState);
      
      // Get sessionId
      const sessionId = getSessionId();
      console.log('SimpleHttpInterceptor: Current session ID:', sessionId);
      
      // Build tracestate value
      const traceStateParts: string[] = [];
      
      // Add custom key-value pairs
      if (this.customTraceState) {
        console.log('SimpleHttpInterceptor: Processing customTraceState:', this.customTraceState);
        Object.entries(this.customTraceState).forEach(([key, value]) => {
          const traceStatePart = `${key}=${value}`;
          traceStateParts.push(traceStatePart);
          console.log('SimpleHttpInterceptor: Added key-value tracestate:', traceStatePart);
        });
      } else {
        console.log('SimpleHttpInterceptor: No customTraceState configured');
      }
      
      // Always include session ID if available
      if (sessionId) {
        traceStateParts.push(`x-sp-session-id=${sessionId}`);
        console.log('SimpleHttpInterceptor: Added session ID tracestate:', `x-sp-session-id=${sessionId}`);
      } else {
        console.log('SimpleHttpInterceptor: No active session ID found');
      }
      
      // Only set tracestate header if we have any values
      if (traceStateParts.length > 0) {
        const tracestateValue = traceStateParts.join(',');
        console.log('SimpleHttpInterceptor: Final tracestate value:', tracestateValue);
        
        // Prepare request headers
        const headers = new Headers(init?.headers);
        headers.set('tracestate', tracestateValue);
        
        console.log('SimpleHttpInterceptor: Setting tracestate header on request');
        console.log('SimpleHttpInterceptor: Request headers before:', init?.headers);
        console.log('SimpleHttpInterceptor: Request headers after:', headers);
        
        // Create new request configuration
        const newInit: RequestInit = {
          ...init,
          headers: headers
        };
        
        console.log('🔧 SimpleHttpInterceptor: Injected tracestate header:', tracestateValue);
        
        // Use original fetch method
        return originalFetch(input, newInit);
      } else {
        // No tracestate values to add, use original request
        console.log('🔧 SimpleHttpInterceptor: No tracestate values to inject');
        return originalFetch(input, init);
      }
    };
  }
}
