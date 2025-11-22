import {
  Context,
  TextMapGetter,
  TextMapPropagator,
  TextMapSetter,
  trace,
} from "@opentelemetry/api";
import { TRACE_STATE_HEADER, TraceState } from "@opentelemetry/core";
import { getSessionId } from "./SessionManager";

/**
 * A custom propagator that injects session and site information into the W3C tracestate header.
 */
export class CustomTraceStateAppender implements TextMapPropagator {
  private siteName?: string;

  constructor(siteName?: string) {
    this.siteName = siteName;
  }

  inject(context: Context, carrier: unknown, setter: TextMapSetter): void {
    const spanContext = trace.getSpanContext(context);
    if (!spanContext) {
      return;
    }

    const sessionId = getSessionId();
    const originalTraceState = spanContext.traceState ?? new TraceState();
    let newTraceState = originalTraceState;
    
    // 只有当siteName存在时才设置sp_site
    if (this.siteName) {
      newTraceState = newTraceState.set("sp_site", this.siteName);
    }
    
    newTraceState = newTraceState.set("sp_session", sessionId);

    const serializedTraceState = newTraceState.serialize();

    if (serializedTraceState) {
      setter.set(carrier, TRACE_STATE_HEADER, serializedTraceState);
    }
  }

  extract(context: Context, carrier: unknown, getter: TextMapGetter): Context {
    return context;
  }

  fields(): string[] {
    return [];
  }
}