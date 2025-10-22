import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
  SpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { InspectorConfig } from "./config";
import { createUserResource } from "./createUserResource";
import { CustomConsoleSpanExporter } from "./CustomConsoleSpanExporter";
import { HttpHeaderPropagator } from "./HttpHeaderPropagator";
import { getSessionId } from "./SessionManager";

export function initBrowserInspector(config: InspectorConfig): Promise<{
  provider: WebTracerProvider;
}> {
  return new Promise((resolve, reject) => {
    console.log("🚀 Starting OpenTelemetry initialization...");
    const spSessionId = getSessionId();

    // Construct processor
    const spanProcessors: SpanProcessor[] = [];
    if (config.env === "dev") {
      spanProcessors.push(new SimpleSpanProcessor(new CustomConsoleSpanExporter()));
    }
    if (!!config.collectorEndpoint) {
      spanProcessors.push(
        new BatchSpanProcessor(
          new OTLPTraceExporter({
            url: `${config.collectorEndpoint}/v1/traces`,
          }),
        ),
      );
    }

    // Construct resource
    const resource = createUserResource({
      apiKey: config.apiKey,
      userId: config.userId,
      serviceName: config.serviceName,
      spSessionId: spSessionId,
    });

    // Construct provider
    const provider = new WebTracerProvider({
      resource,
      spanProcessors,
    });
    console.log("✅ WebTracerProvider created");

    // Register provider and context manager
    provider.register({
      contextManager: new ZoneContextManager(),
      propagator: new CompositePropagator({
        propagators: [
          new W3CBaggagePropagator(),
          new W3CTraceContextPropagator(),
          new HttpHeaderPropagator({
            "x-sp-session-id": spSessionId,
          }),
        ],
      }),
    });
    console.log("✅ Provider registered with ZoneContextManager");

    // Register auto-instrumentations
    try {
      registerInstrumentations({
        instrumentations: [
          getWebAutoInstrumentations({
            // Enable all auto-instrumentations with default configurations
            "@opentelemetry/instrumentation-user-interaction": {
              eventNames: [
                "click",
                "scroll",
                "wheel",
                "submit",
                "keypress",
                "change",
                "focus",
                "blur",
              ],
            },
            // Custom Fetch instrumentation
            "@opentelemetry/instrumentation-fetch": {
              propagateTraceHeaderCorsUrls: [/.*/],
              applyCustomAttributesOnSpan: (span: any, request: any, result: any) => {
                try {
                  // Record request information
                  if (typeof request === "string") {
                    span.setAttribute("http.request.url", request);
                    span.setAttribute("http.request.method", "GET");
                  } else {
                    span.setAttribute("http.request.url", request.url);
                    span.setAttribute("http.request.method", request.method);

                    // Record request headers
                    if (request.headers) {
                      const headers =
                        typeof request.headers.entries === "function"
                          ? Object.fromEntries(request.headers.entries())
                          : JSON.parse(JSON.stringify(request.headers));
                      const importantHeaders = [
                        "content-type",
                        "authorization",
                        "user-agent",
                        "accept",
                        "cache-control",
                      ];
                      importantHeaders.forEach((header) => {
                        const value = headers[header] || headers[header.toLowerCase()];
                        if (value) {
                          span.setAttribute(`http.request.header.${header}`, value);
                        }
                      });
                      span.setAttribute("http.request.headers_count", Object.keys(headers).length);
                    }
                  }

                  // Record response information
                  if (result instanceof Response) {
                    span.setAttribute("http.response.status", result.status);
                    span.setAttribute("http.response.status_text", result.statusText);

                    // Record response headers
                    const responseHeaders = Object.fromEntries(result.headers.entries());
                    const importantResponseHeaders = [
                      "content-type",
                      "content-length",
                      "cache-control",
                      "etag",
                      "last-modified",
                    ];
                    importantResponseHeaders.forEach((header) => {
                      const value =
                        responseHeaders[header] || responseHeaders[header.toLowerCase()];
                      if (value) {
                        span.setAttribute(`http.response.header.${header}`, value);
                      }
                    });
                    span.setAttribute(
                      "http.response.headers_count",
                      Object.keys(responseHeaders).length,
                    );

                    // Record response body size (do not record content to avoid privacy issues)
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
                  console.error("❌ Failed to apply custom attributes on fetch span:", error);
                }
              },
            },
            "@opentelemetry/instrumentation-xml-http-request": {
              propagateTraceHeaderCorsUrls: [/.*/],
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

    console.log("🎯 OpenTelemetry auto-instrumentations initialization completed");

    const loader = () => {
      setTimeout(() => {
        Promise.all([
          // Initialize environment information
          import("./environment-recorder"),
          // Initialize event listeners
          import("./event-listeners"),
        ])
          .then(([{ recordEnvironmentInfo, recordPageLoadInfo }, { initializeEventListeners }]) => {
            recordEnvironmentInfo(spSessionId);
            recordPageLoadInfo();
            console.log("🌍 Environment and page load info recorded");

            initializeEventListeners({
              observeScroll: config.observeScroll,
            });
            resolve({ provider });
          })
          .catch((error) => {
            reject(error);
          });
      }, 1000); // Delay for 1 second to ensure all resources are loaded
    };

    // Automatically record environment information and initialize event listeners
    if (typeof window !== "undefined") {
      // Record environment information after the page has loaded
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          loader();
        });
      } else {
        // The page has already loaded
        loader();
      }
    }
    return;
  });
}
