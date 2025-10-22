// Create a console exporter (for development environment)
export class CustomConsoleSpanExporter {
  export(spans: any, resultCallback: any) {
    // console.log(`🔍 Exporting ${spans.length} spans`);
    // console.log('👤 Spans:', spans);

    spans.forEach((span: any) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [TRACE] ${span.name}`);
      console.log(`  Span ID: ${span.spanContext().spanId}`);
      console.log(`  Trace ID: ${span.spanContext().traceId}`);
      console.log(`  Duration: ${span.duration?.[0] || 0}ms`);

      // Display resource attributes
      if (span.resource && span.resource.attributes) {
        console.log(`  📋 Resource Attributes:`, JSON.stringify(span.resource.attributes, null, 2));
      }

      // Display span attributes
      if (span.attributes && Object.keys(span.attributes).length > 0) {
        console.log(`  🏷️  Span Attributes:`, JSON.stringify(span.attributes, null, 2));
      }
    });
    resultCallback({ code: 0 });
  }

  shutdown() {
    return Promise.resolve();
  }
}
