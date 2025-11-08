# @softprobe/web-inspector

A powerful web development tool for inspecting web pages directly from your browser.

## Installation

```bash
npm install @softprobe/web-inspector
```

## Getting Started

To get started, import `initInspector` at the entry point of your application and call it with your `publicKey` and `serviceName`.

```typescript
import { initInspector } from "@softprobe/web-inspector";

initInspector({
  publicKey: "YOUR_PUBLIC_KEY",
  serviceName: "YOUR_SERVICE_NAME",
});
```

### Usage with Next.js (App Router)

First create `InspectorInitializer`, and then import and use it in your root `layout.tsx`.

```typescriptreact
// src/components/InspectorInitializer.tsx
'use client'
import { useEffect } from 'react';
import { initInspector } from '@softprobe/web-inspector';
export const InspectorInitializer = () => {
  useEffect(() => {
    initInspector({
      publicKey: 'YOUR_PUBLIC_KEY',
      serviceName: "YOUR_SERVICE_NAME",
    })
  }, [])
  return null
}

// app/layout.tsx
import { InspectorInitializer } from '@/components/InspectorInitializer'

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

For detailed configuration options and advanced usage, please see our [API Reference](./docs/API.md).
