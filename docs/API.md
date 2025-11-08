# API Reference

[Back to README](../README.md)

## Configuration Options

The `initInspector` function accepts a configuration object with the following options:

| Option                         | Type      | Required | Default                    | Description                                         |
| :----------------------------- | :-------- | :------- | :------------------------- | :-------------------------------------------------- |
| `publicKey`                    | `string`  | Yes      | -                          | Your project's public key.                          |
| `serviceName`                  | `string`  | Yes      | -                          | Your service or business line name.                 |
| `enableTrace`                  | `boolean` | No       | `true`                     | Whether to enable trace reporting.                  |
| `endpoint`                     | `string`  | No       | `'https://o.softprobe.ai'` | Custom endpoint to override the default.            |
| `enableConsole`                | `boolean` | No       | `false`                    | Whether to print trace info to the browser console. |
| `instrumentations`             | `object`  | No       | -                          | Configure which features to auto-instrument.        |
| `instrumentations.network`     | `boolean` | No       | `true`                     | Enable network request instrumentation.             |
| `instrumentations.interaction` | `boolean` | No       | `false`                    | Enable user interaction instrumentation.            |
| `instrumentations.environment` | `boolean` | No       | `false`                    | Enable page load and environment information.       |

**Note**: The `initInspector` function is a "fire-and-forget" function. It does not return a `Promise`, and all internal errors are automatically caught to avoid impacting your main application.

## Manual Span Creation (Example)

You can manually create spans to trace specific business logic.

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
