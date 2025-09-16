import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { createUserResource } from "./createUserResource";
import { getSessionId } from "./getSessionId";

// 创建控制台导出器（用于开发环境）
class ConsoleTraceExporter {
  export(spans: any, resultCallback: any) {
    // console.log(`🔍 Exporting ${spans.length} spans`);
    // console.log('👤 Spans:', spans);

    spans.forEach((span: any) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [TRACE] ${span.name}`);
      console.log(`  Span ID: ${span.spanContext().spanId}`);
      console.log(`  Trace ID: ${span.spanContext().traceId}`);
      console.log(`  Duration: ${span.duration?.[0] || 0}ms`);

      // 显示资源属性
      if (span.resource && span.resource.attributes) {
        console.log(
          `  📋 Resource Attributes:`,
          JSON.stringify(span.resource.attributes, null, 2),
        );
      }

      // 显示 span 属性
      if (span.attributes && Object.keys(span.attributes).length > 0) {
        console.log(
          `  🏷️  Span Attributes:`,
          JSON.stringify(span.attributes, null, 2),
        );
      }
    });
    resultCallback({ code: 0 });
  }

  shutdown() {
    return Promise.resolve();
  }
}

type Options = {
  // 业务相关
  apiKey: string;
  userId: string;
  source: string;

  // 配置相关
  /** 是否开启滚动监听, 默认不开启 */
  observeScroll?: boolean;
};
export const initInspector = ({
  apiKey,
  userId,
  source,

  observeScroll,
}: Options): Promise<{
  provider: WebTracerProvider;
}> => {
  return new Promise((resolve, reject) => {
    console.log("🚀 Starting OpenTelemetry initialization...");
    const sessionId = getSessionId(source);

    // 创建导出器
    const exporter = new ConsoleTraceExporter();

    // 创建 WebTracerProvider
    const provider = new WebTracerProvider({
      resource: createUserResource({ apiKey, userId, sessionId }),
      spanProcessors: [new SimpleSpanProcessor(exporter)],
    });
    console.log("✅ WebTracerProvider created");

    // 注册 provider 和 context manager
    provider.register({ contextManager: new ZoneContextManager() });
    console.log("✅ Provider registered with ZoneContextManager");

    // 注册自动检测
    try {
      registerInstrumentations({
        instrumentations: [
          getWebAutoInstrumentations({
            // 启用所有自动检测，使用默认配置
            "@opentelemetry/instrumentation-user-interaction": {
              eventNames: [
                "click",
                "scroll",
                "wheel",
                "submit",
                "keypress",
                "change",
                // "focus",
                "blur",
              ],
            },
            // 自定义 Fetch 检测
            "@opentelemetry/instrumentation-fetch": {
              applyCustomAttributesOnSpan: (
                span: any,
                request: any,
                result: any,
              ) => {
                try {
                  // 记录请求信息
                  if (typeof request === "string") {
                    span.setAttribute("http.request.url", request);
                    span.setAttribute("http.request.method", "GET");
                  } else {
                    span.setAttribute("http.request.url", request.url);
                    span.setAttribute("http.request.method", request.method);

                    // 记录请求头
                    if (request.headers) {
                      const headers = Object.fromEntries(
                        request.headers.entries(),
                      );
                      const importantHeaders = [
                        "content-type",
                        "authorization",
                        "user-agent",
                        "accept",
                        "cache-control",
                      ];
                      importantHeaders.forEach((header) => {
                        const value =
                          headers[header] || headers[header.toLowerCase()];
                        if (value) {
                          span.setAttribute(
                            `http.request.header.${header}`,
                            value,
                          );
                        }
                      });
                      span.setAttribute(
                        "http.request.headers_count",
                        Object.keys(headers).length,
                      );
                    }
                  }

                  // 记录响应信息
                  if (result instanceof Response) {
                    span.setAttribute("http.response.status", result.status);
                    span.setAttribute(
                      "http.response.status_text",
                      result.statusText,
                    );

                    // 记录响应头
                    const responseHeaders = Object.fromEntries(
                      result.headers.entries(),
                    );
                    const importantResponseHeaders = [
                      "content-type",
                      "content-length",
                      "cache-control",
                      "etag",
                      "last-modified",
                    ];
                    importantResponseHeaders.forEach((header) => {
                      const value =
                        responseHeaders[header] ||
                        responseHeaders[header.toLowerCase()];
                      if (value) {
                        span.setAttribute(
                          `http.response.header.${header}`,
                          value,
                        );
                      }
                    });
                    span.setAttribute(
                      "http.response.headers_count",
                      Object.keys(responseHeaders).length,
                    );

                    // 记录响应体大小（不记录内容，避免隐私问题）
                    if (result.headers.get("content-length")) {
                      span.setAttribute(
                        "http.response.body.size",
                        parseInt(result.headers.get("content-length") || "0"),
                      );
                    }
                  }

                  console.log(
                    `🌐 Fetch request recorded: ${span.attributes["http.request.method"]} ${span.attributes["http.request.url"]}`,
                  );
                } catch (error) {
                  console.error(
                    "❌ Failed to apply custom attributes on fetch span:",
                    error,
                  );
                }
              },
            },
          }),
        ],
      });
      console.log("✅ Auto-instrumentations registered successfully");
    } catch (error) {
      console.error("❌ Failed to register instrumentations:", error);
      console.error("🔍 Error details:", error);
      reject(error);
      return;
    }

    console.log(
      "🎯 OpenTelemetry auto-instrumentations initialization completed",
    );

    const loader = () => {
      setTimeout(() => {
        Promise.all([
          // 初始化环境信息
          import("./environment-recorder"),
          // 初始化事件监听器
          import("./event-listeners"),
        ])
          .then(
            ([
              { recordEnvironmentInfo, recordPageLoadInfo },
              { initializeEventListeners },
            ]) => {
              const sessionId = `session_${Date.now()}`;
              recordEnvironmentInfo(sessionId);
              recordPageLoadInfo();
              console.log("🌍 Environment and page load info recorded");

              initializeEventListeners({ observeScroll });
              resolve({ provider });
            },
          )
          .catch((error) => {
            reject(error);
          });
      }, 1000); // 延迟1秒确保所有资源加载完成
    };

    // 自动记录环境信息和初始化事件监听器
    if (typeof window !== "undefined") {
      // 等待页面加载完成后记录环境信息
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          loader();
        });
      } else {
        // 页面已经加载完成
        loader();
      }
    }
    return;
  });
};
