# @softprobe/sessify

A lightweight tool for web session management and context propagation. It automatically manages user session IDs and follows the W3C Trace Context specification, injecting them into the `tracestate` header of outgoing requests.

## Features

- **Automatic Session Management**: Automatically creates and manages user sessions based on user inactivity time.
- **Flexible Storage Options**: Choose between `sessionStorage` (session bound to tab) or `localStorage` (session shared across the browser).
- **Manual Control**: Start or end sessions manually as needed.
- **Standard Compliance**: Propagates session information through the standard `tracestate` header.
- **Lightweight**: Minimal dependencies, focused on core session management and propagation functionality.

## Installation

```bash
npm install @softprobe/sessify
```

## Quick Start

At your application entry point, import `initSessify` and call it with your configuration.

```typescript
import { initSessify } from "@softprobe/sessify";

initSessify({
  siteName: "my-awesome-app",
});
```

## Configuration Options

The `initSessify` function accepts a configuration object with the following properties:

- `siteName` (string, **required**): The name of your site or application.
- `sessionStorageType` ('session' | 'local', *optional*, default: `'session'`):
  - `'session'`: Session ID stored in `sessionStorage`. The session is unique to each browser tab and cleared when the tab is closed.
  - `'local'`: Session ID stored in `localStorage`. The session is shared across all tabs and windows of the same domain and persists after browser closure.

### Using Local Storage Example

```typescript
import { initSessify } from "@softprobe/sessify";

// Session will be shared across all tabs
initSessify({
  siteName: "my-awesome-app",
  sessionStorageType: 'local',
});
```

## Manual Session Management

You can also use the `startSession` and `endSession` functions to have full control over the session lifecycle.

### `startSession()`

Forces the end of the current session (if exists) and starts a new one. This function returns the newly created session ID.

```typescript
import { startSession } from "@softprobe/sessify";

// For example, manually start a new session when a user logs in
const newSessionId = startSession();
console.log("A new session has started:", newSessionId);
```

### `endSession()`

Forces the end of the current session by clearing session data from storage.

```typescript
import { endSession } from "@softprobe/sessify";

// For example, manually end the session when a user logs out
endSession();
console.log("Session has ended.");
```

## Using with Next.js (App Router)

For frameworks like Next.js, it's recommended to create a client-side initialization component and use it in your root layout.

```typescript
// src/components/InspectorInitializer.tsx
'use client'

import { useEffect } from 'react';
import { initSessify } from '@softprobe/sessify';

export const InspectorInitializer = () => {
  useEffect(() => {
    initSessify({
      siteName: "my-nextjs-app",
      sessionStorageType: 'local', // 'local' is recommended to maintain consistent sessions between page navigations
    });
  }, []);

  return null;
}

// app/layout.tsx
import { InspectorInitializer } from '@/components/InspectorInitializer';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <InspectorInitializer />
      </body>
    </html>
  );
}
```