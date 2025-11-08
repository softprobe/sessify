# @softprobe/web-inspector

[English](./README.md)

## 安装 (Installation)

```bash
npm install @softprobe/web-inspector
```

## 使用 (Usage)

### 初始化配置 (Initialization)

在您的应用入口处调用 `initInspector` 进行初始化。

**最简配置:**

提供 `publicKey` 和 `serviceName` 即可启动网络性能监控, 并将数据上报到 Softprobe 的生产环境。

```typescript
import { initInspector } from "@softprobe/web-inspector";

initInspector({
  publicKey: "YOUR_PUBLIC_KEY",
  serviceName: "YOUR_SERVICE_NAME",
});
```

**完整配置选项:**

```typescript
import { initInspector } from "@softprobe/web-inspector";

initInspector({
  // (必填) 您的项目公钥
  publicKey: "YOUR_PUBLIC_KEY",
  // (必填) 您的服务/业务线名称
  serviceName: "YOUR_SERVICE_NAME",

  // --- 数据导出 ---
  // (可选) 是否启用数据上报, 默认为 true
  enableTrace: true,
  // (可选) 自定义数据上报地址, 默认为 'https://o.softprobe.ai'
  endpoint: "https://your-proxy-or-private-collector.com",
  // (可选) 是否在浏览器控制台打印调试信息, 默认为 false
  enableConsole: true,

  // --- 功能开关 ---
  // (可选) 配置需要自动监听的功能
  instrumentations: {
    // 网络请求监听, 默认为 true
    network: true,
    // 用户交互监听 (点击等), 默认为 false
    interaction: true,
    // 页面加载信息记录, 默认为 false
    environment: true,
  },
});
```

**注意**: `initInspector` 函数是一个“即发即忘”的函数, 它不会返回 `Promise`, 并且所有内部错误都会被自动捕获, 不会影响您的主应用程序。

### 手动创建 Span (示例)

```typescript
// pages/index.tsx
import { trace } from '@softprobe/web-inspector';

export default function Home() {
  const handleClick = () => {
    const tracer = trace.getTracer('nextjs-tracer');
    const span = tracer.startSpan('checkout_process');

    try {
      // 业务逻辑...
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

  return <button onClickhandleClick}>Start Checkout</button>;
}
```
