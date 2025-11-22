import {
  Context,
  TextMapGetter,
  TextMapPropagator,
  TextMapSetter,
  trace,
} from "@opentelemetry/api";
import { TRACE_STATE_HEADER, TraceState } from "@opentelemetry/core";

/**
 * A custom propagator that injects a session ID into the W3C tracestate header.
 * This should be used in a CompositePropagator AFTER the W3CTraceContextPropagator.
 */
export class SessionIdTraceStateAppender implements TextMapPropagator {
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  /**
   * Injects the session ID into the tracestate.
   * It retrieves the current tracestate from the span context, adds the session ID,
   * and then sets the `tracestate` header, overwriting any existing value.
   */
  inject(context: Context, carrier: unknown, setter: TextMapSetter): void {
    const spanContext = trace.getSpanContext(context);
    if (!spanContext) {
      return;
    }

    const originalTraceState = spanContext.traceState ?? new TraceState();
    const newTraceState = originalTraceState.set("sp", this.sessionId);
    const serializedTraceState = newTraceState.serialize();

    if (serializedTraceState) {
      setter.set(carrier, TRACE_STATE_HEADER, serializedTraceState);
    }
  }

  /**
   * This propagator does not extract any data. Extraction is handled
   * by the W3CTraceContextPropagator.
   */
  extract(context: Context, carrier: unknown, getter: TextMapGetter): Context {
    return context;
  }

  /**
   * This propagator modifies the `tracestate` field, which is already
   * declared by W3CTraceContextPropagator.
   */
  fields(): string[] {
    return [];
  }
}