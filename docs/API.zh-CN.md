# API 参考

[返回 README](../README.zh-CN.md)

## 配置选项 (Configuration Options)

`initInspector` 函数接受一个包含以下选项的配置对象:

| 选项                           | 类型      | 是否必填 | 默认值                     | 描述                               |
| :----------------------------- | :-------- | :------- | :------------------------- | :--------------------------------- |
| `publicKey`                    | `string`  | 是       | -                          | 您的项目公钥。                     |
| `serviceName`                  | `string`  | 是       | -                          | 您的服务或业务线名称。             |
| `enableTrace`                  | `boolean` | 否       | `true`                     | 是否启用数据上报。                 |
| `endpoint`                     | `string`  | 否       | `'https://o.softprobe.ai'` | 用于覆盖默认上报地址的自定义端点。 |
| `enableConsole`                | `boolean` | 否       | `false`                    | 是否在浏览器控制台打印追踪信息。   |
| `instrumentations`             | `object`  | 否       | -                          | 配置需要自动监听的功能。           |
| `instrumentations.network`     | `boolean` | 否       | `true`                     | 启用网络请求监听。                 |
| `instrumentations.interaction` | `boolean` | 否       | `false`                    | 启用用户交互监听。                 |
| `instrumentations.environment` | `boolean` | 否       | `false`                    | 启用页面加载和环境信息记录。       |

**注意**: `initInspector` 函数是一个“即发即忘”的函数。它不会返回 `Promise`, 并且所有内部错误都会被自动捕获, 不会影响您的主应用程序。

## 手动创建 Span (示例)

您可以手动创建 Span 来追踪特定的业务逻辑。

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
