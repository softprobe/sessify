# @softprobe/web-inspector

[简体中文](./README.zh-CN.md)

## Installation

```bash
npm install @softprobe/web-inspector
```

## Usage

### Initialization

Initialize the inspector at the entry point of your application (e.g., `main.ts` or `App.tsx`).

**Minimal Configuration:**

You only need to provide `publicKey` and `serviceName` to start monitoring network performance and reporting data to the Softprobe production environment.

```typescript
import { initInspector } from "@softprobe/web-inspector";

initInspector({
  publicKey: "YOUR_PUBLIC_KEY",
  serviceName: "YOUR_SERVICE_NAME",
});
```

**Full Configuration Options:**

```typescript
import { initInspector } from "@softprobe/web-inspector";

initInspector({
  // (Required) Your project's public key
  publicKey: "YOUR_PUBLIC_KEY",
  // (Required) Your service or business line name
  serviceName: "YOUR_SERVICE_NAME",

  // --- Data Export ---
  // (Optional) Whether to enable trace reporting, defaults to true
  enableTrace: true,
  // (Optional) Custom endpoint to override the default ('https://o.softprobe.ai')
  endpoint: "https://your-proxy-or-private-collector.com",
  // (Optional) Whether to print trace info to the browser console, defaults to false
  enableConsole: true,

  // --- Feature Toggles ---
  // (Optional) Configure which features to auto-instrument
  instrumentations: {
    // Network request instrumentation, defaults to true
    network: true,
    // User interaction instrumentation (e.g., clicks), defaults to false
    interaction: true,
    // Page load and environment information, defaults to false
    environment: true,
  },
});
```

**Note**: The `initInspector` function is a "fire-and-forget" function. It does not return a `Promise`, and all internal errors are automatically caught to avoid impacting your main application.

### Manual Span Creation (Example)

```typescript
// pages/index.tsx
import { trace } from '@softprobe/web-inspector';

export default function Home() {
  const handleClick = () => {
    const tracer = trace.getTracer('nextjs-tracer');
    const span = tracer.startSpan('checkout_process');

    try {
      // Business logic...
      span.setAttribute('item_count', 3);
      span.setStatus({ code: trace.SpanStatusCode.OK });
    } catch (error) {
      span.setStatus({
        code: trace.SpanStatusCode.ERROR,
        message: error.message
      });
    } finally {
      span.end();
    }
  };

  return <button onClick={handleClick}>Start Checkout</button>;
}
```
