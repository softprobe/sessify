# @softprobe/web-inspector

一个功能强大的 Web 开发工具, 可直接从您的浏览器检查网页。

## 安装 (Installation)

```bash
npm install @softprobe/web-inspector
```

## 快速上手 (Getting Started)

在您的应用入口处导入 `initInspector` 并使用您的 `publicKey` 和 `serviceName` 来调用它。

```typescript
import { initInspector } from "@softprobe/web-inspector";

initInspector({
  publicKey: "YOUR_PUBLIC_KEY",
  serviceName: "YOUR_SERVICE_NAME",
});
```

### 在 Next.js (App Router) 中使用

首先创建 `InspectorInitializer`，然后在您的根 `layout.tsx` 文件中导入并使用它。

```typescript
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

有关详细的配置选项和高级用法, 请参阅我们的 [API 参考](./docs/API.zh-CN.md)。
