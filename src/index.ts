import { initBrowserInspector } from "./browser";
import { InspectorConfig } from "./config";

export function initInspector(config: InspectorConfig): void {
  try {
    // <--- 在入口函数增加 try/catch
    initBrowserInspector(config);
  } catch (error) {
    // 这个 catch 只有在 initBrowserInspector 本身加载失败或存在致命的语法错误时才可能被触发
    console.error("❌ A critical error occurred in the inspector entry point:", error);
  }
}

export { trace } from "@opentelemetry/api";
