# @softprobe/web-inspector

## 安装

```bash
npm install @softprobe/web-inspector
```

## 使用

### 初始化配置

```typescript
import { initInspector } from '@softprobe/web-inspector';

export function register() {
  // 客户端初始化
  initInspector({
    apiKey: 'YOUR_API_KEY',
    userId: 'YOUR_USER_ID',
    serviceName: 'YOUR_BUSINESS_SOURCE',
    collectorEndpoint: process.env.INSPECTOR_COLLECTOR_PROXY_URL!,

    observeScroll: false,
  })
    .then(({ provider }) => {
      console.log('Success');
    })
    .catch((err) => {
      console.log('Failure');
    });
}
```

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

  return <button onClick={handleClick}>Start Checkout</button>;
}
```
