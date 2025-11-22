import { getSessionId } from "./SessionManager";

/**
 * 简单的HTTP请求拦截器，直接注入tracestate头
 */
export class SimpleHttpInterceptor {
  private siteName?: string;

  constructor(siteName?: string) {
    this.siteName = siteName;
    this.interceptFetch();
  }

  private interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      // 获取sessionId
      const sessionId = getSessionId();
      
      // 构建tracestate值
      const traceStateParts: string[] = [];
      
      if (this.siteName) {
        traceStateParts.push(`x-sp-site=${this.siteName}`);
      }
      
      traceStateParts.push(`x-sp-session-id=${sessionId}`);
      
      const tracestateValue = traceStateParts.join(',');
      
      // 准备请求头
      const headers = new Headers(init?.headers);
      headers.set('tracestate', tracestateValue);
      
      // 创建新的请求配置
      const newInit: RequestInit = {
        ...init,
        headers: headers
      };
      
      console.log('🔧 SimpleHttpInterceptor: Injected tracestate header:', tracestateValue);
      
      // 使用原始的fetch方法
      return originalFetch(input, newInit);
    };
  }
}