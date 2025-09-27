import {
  Context,
  TextMapGetter,
  TextMapPropagator,
  TextMapSetter,
  // trace,
  // SpanContext,
  // TraceFlags,
} from "@opentelemetry/api";

// // Define the custom header names
// const MY_TRACE_ID_HEADER = 'x-my-trace-id';
// const MY_SPAN_ID_HEADER = 'x-my-span-id';

export class HttpHeaderPropagator implements TextMapPropagator {
  headers: Record<string, string> = {};
  constructor(headers: Record<string, string> = {}) {
    Object.keys(headers || {})
      .filter((key) => !!key && key.startsWith("x-") && typeof headers[key] === "string")
      .forEach((key) => {
        this.headers[key] = headers[key];
      });
  }
  // inject is called when sending a request
  inject(context: Context, carrier: unknown, setter: TextMapSetter): void {
    Object.keys(this.headers).forEach((key) => {
      if (key && this.headers[key]) {
        setter.set(carrier, key, this.headers[key]);
      }
    });
  }

  // extract is called when receiving a request
  extract(context: Context, carrier: unknown, getter: TextMapGetter): Context {
    const list = Object.keys(this.headers)
      .map((key) => {
        return {
          key,
          value: getter.get(carrier, key),
        };
      })
      .filter((item) => typeof item.value === "string");

    return context;

    // const traceId = getter.get(carrier, MY_TRACE_ID_HEADER);
    // const spanId = getter.get(carrier, MY_SPAN_ID_HEADER);
    //
    // if (typeof traceId !== 'string' || typeof spanId !== 'string') {
    //   return context; // Return original context if headers are not found
    // }
    //
    // const spanContext: SpanContext = {
    //   traceId,
    //   spanId,
    //   isRemote: true,
    //   traceFlags: TraceFlags.SAMPLED, // Assuming the trace is always sampled
    // };
    //
    // return trace.setSpanContext(context, spanContext);
  }

  fields(): string[] {
    return Object.keys(this.headers);
  }
}
