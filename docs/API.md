# API Reference

[Back to README](../README.md)

## Installation

```bash
npm install sessify
```

## Import

```typescript
import { initSessify, startSession, endSession } from '@softprobe/sessify';
```

## Configuration Options

`initSessify` accepts the following configuration:

| Option               | Type                        | Required | Default   | Description                                                        |
| :------------------- | :-------------------------- | :------- | :-------- | :----------------------------------------------------------------- |
| `siteName`           | `string`                    | Yes      | -         | Logical service/site name, written to resource and tracestate.     |
| `sessionStorageType` | `'session' \| 'local'`      | No       | `session` | Choose where the session ID is stored.                              |
| `observeScroll`      | `boolean`                   | No       | -         | Reserved for scroll recording control (not active in this version). |
| `enableTrace`        | `boolean`                   | No       | -         | Reserved for trace exporting (not active in this version).          |
| `endpoint`           | `string`                    | No       | -         | Reserved for exporter endpoint (not active in this version).        |
| `enableConsole`      | `boolean`                   | No       | -         | Reserved for console exporter (not active in this version).         |
| `instrumentations`   | `{ network?; interaction?; environment? }` | No | - | Reserved for auto-instrumentations (not active in this version).    |

Type definition location: `src/config.ts:1–49`.

## Functions

- `initSessify(config: SessifyConfig): void`
  - Initializes the web tracer provider and registers context/propagators.
  - Entry: `src/index.ts:4–10`; Browser init: `src/browser.ts:13–39`.

- `startSession(): string`
  - Forces a new session ID and updates last activity timestamp.
  - `src/SessionManager.ts:58–64`.

- `endSession(): void`
  - Clears current session ID and activity markers.
  - `src/SessionManager.ts:69–73`.

## Usage Example

```typescript
import { initSessify, startSession, endSession } from '@softprobe/sessify';

initSessify({
  siteName: 'YOUR_SITE_NAME',
  sessionStorageType: 'session',
});

// Start a new session explicitly (optional)
const newSessionId = startSession();

// End current session (optional)
endSession();
```

## Notes

- This library initializes OpenTelemetry context management and tracestate propagation in the browser. Exporters and auto-instrumentations are intentionally not activated in this version.
- It is safe to call `initSessify` at application startup; errors are caught to avoid impacting your app.
