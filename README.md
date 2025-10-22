# Web SDK (`@softprobe/web-inspector`)

This guide covers the installation and usage of the Softprobe Web SDK.

## Installation

Install the package using your preferred package manager:

```bash
npm install @softprobe/web-inspector
```

## Usage

### Initialization

Initialize the inspector in your application's entry point.

```typescript
import { initInspector } from "@softprobe/web-inspector";

export function register() {
  // Initialize the client
  initInspector({
    apiKey: "",
    userId: "",
    serviceName: "YOUR_SERVICE_NAME",
    // Data collector endpoint: <INSPECTOR_COLLECTOR_URL>/v1/traces
    collectorEndpoint: process.env.INSPECTOR_COLLECTOR_URL!,
    // Automatically enables console logging in development
    env: "dev",
    // Optional: disable scroll observation
    observeScroll: false,
  })
    .then(({ provider }) => {
      console.log("Softprobe inspector initialized successfully.");
    })
    .catch((err) => {
      console.error("Failed to initialize Softprobe inspector:", err);
    });
}
```

### Creating Spans Manually

You can create custom spans to trace specific business logic or user interactions.

```typescript
// Example in a React component (e.g., pages/index.tsx)
import { trace } from '@softprobe/web-inspector';

export default function Home() {
  const handleClick = () => {
    // Get a tracer instance
    const tracer = trace.getTracer('nextjs-tracer');

    // Start a new span
    const span = tracer.startSpan('checkout_process');

    try {
      // Your business logic here...
      // Example: processing items in a shopping cart

      // Add attributes to the span for context
      span.setAttribute('item_count', 3);
      span.setAttribute('user_tier', 'gold');

      // Set the span status to OK on success
      span.setStatus({ code: trace.SpanStatusCode.OK });

    } catch (error) {
      // Set the span status to ERROR on failure
      span.setStatus({
        code: trace.SpanStatusCode.ERROR,
        message: error.message
      });

    } finally {
      // End the span to record it
      span.end();
    }
  };

  return <button onClick={handleClick}>Start Checkout</button>;
}
```
