# @softprobe/web-inspector

## 安装

```bash
npm install @softprobe/web-inspector
```

## 使用

```javascript
import { initInspector } from "@softprobe/web-inspector";

initInspector({
  apiKey: "YOUR_API_KEY",
  userId: "YOUR_USER_ID",
  source: "YOUR_BUSINESS_SOURCE",
  observeScroll: false,
})
  .then(({ provider }) => {
    console.log("Success");
  })
  .catch((err) => {
    console.log("Failure");
  });
```
