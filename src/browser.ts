import { ZoneContextManager } from "@opentelemetry/context-zone";
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { SessifyConfig } from "./config";
import { createUserResource } from "./createUserResource";
import { getSessionId, initSessionManager } from "./SessionManager";
import { CustomTraceStateAppender } from "./CustomTraceStateAppender";

export function initBrowserSessify(config: SessifyConfig): void {
  console.log("🚀 Initializing sessify...");

  initSessionManager(config.sessionStorageType);

  const resource = createUserResource({
    siteName: config.siteName,
    sessionId: getSessionId(), // Initial session ID for resource
  });

  const provider = new WebTracerProvider({
    resource,
  });

  provider.register({
    contextManager: new ZoneContextManager(),
    propagator: new CompositePropagator({
      propagators: [
        new W3CBaggagePropagator(),
        new W3CTraceContextPropagator(),
        new CustomTraceStateAppender(config.siteName),
      ],
    }),
  });

  console.log("🎯 Sessify initialized successfully");
}