import { ZoneContextManager } from "@opentelemetry/context-zone";
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Instrumentation, registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  SpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { InspectorConfig } from "./config";
import { createUserResource } from "./createUserResource";
import { HttpHeaderPropagator } from "./HttpHeaderPropagator";
import { getSessionId } from "./SessionManager";

export function initBrowserInspector(config: InspectorConfig): void {
  try {
    console.log("🚀 Starting OpenTelemetry initialization...");


    // 读取采集类型的配置
    const { instrumentations } = config;
    const isNetworkInstrumentationEnabled = instrumentations?.network ?? true;
    const isInteractionInstrumentationEnabled = instrumentations?.interaction ?? false;
    const isEnvironmentRecordingEnabled = instrumentations?.environment ?? false;

    // 读取 trace 和 console 的配置
    const isTraceEnabled = config.enableTrace ?? true;
    const isConsoleEnabled = config.enableConsole ?? false;

    // 构造processor
    const spanProcessors: SpanProcessor[] = [];

    if (isConsoleEnabled) {
      spanProcessors.push(new SimpleSpanProcessor(new ConsoleSpanExporter()));
      console.log("✅ Console exporter enabled.");
    }

    if (isTraceEnabled) {
      const endpointUrl = config.endpoint || "https://o.softprobe.ai";
      const collectorUrl = `${endpointUrl}/v1/traces`;
      spanProcessors.push(new BatchSpanProcessor(new OTLPTraceExporter({ url: collectorUrl })));
      console.log(`✅ Trace exporter enabled, sending data to: ${collectorUrl}`);
    }

    if (!isTraceEnabled && !isConsoleEnabled) {
      console.warn("⚠️ Both trace and console exporters are disabled. No data will be exported.");
    }

    // 构造resource
    const sessionId = getSessionId();
    const resource = createUserResource({
      publicKey: config.publicKey,
      serviceName: config.serviceName,
      sessionId: sessionId,
    });

    // 构造provider
    const provider = new WebTracerProvider({
      resource,
      spanProcessors,
    });
    console.log("✅ WebTracerProvider created");

    // 注册 provider 和 context manager
    provider.register({
      contextManager: new ZoneContextManager(),
      propagator: new CompositePropagator({
        propagators: [
          new W3CBaggagePropagator(),
          new W3CTraceContextPropagator(),
          new HttpHeaderPropagator({
            "x-sp-session-id": sessionId,
          }),
        ],
      }),
    });
    console.log("✅ Provider registered with ZoneContextManager");

    // 注册自动检测
    try {
      const instrumentations: Instrumentation[] = []

      if (isEnvironmentRecordingEnabled) {
        instrumentations.push(new DocumentLoadInstrumentation())
      }

      if (isInteractionInstrumentationEnabled) {
        instrumentations.push(new UserInteractionInstrumentation())
      }

      if (isNetworkInstrumentationEnabled) {
        instrumentations.push(new XMLHttpRequestInstrumentation({
          propagateTraceHeaderCorsUrls: [/.*/],
        }))
        instrumentations.push(new FetchInstrumentation({
          propagateTraceHeaderCorsUrls: [/.*/],
        }))
      }

      registerInstrumentations({
        instrumentations,
      });
      console.log("✅ Auto-instrumentations registered successfully");
    } catch (error) {
      console.error("❌ Failed to register instrumentations:", error);
    }
    console.log("🎯 OpenTelemetry auto-instrumentations initialization completed");
  } catch (error) {
    console.error(
      "❌ An unexpected critical error occurred during inspector initialization:",
      error,
    );
  }
}
