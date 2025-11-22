import { initBrowserSessify } from "./browser";
import { SessifyConfig } from "./config";
import { getSessionId, startSession, endSession } from "./SessionManager";

// 先定义函数
function initSessify(config: SessifyConfig): void {
  try {
    initBrowserSessify(config);
  } catch (error) {
    console.error("❌ A critical error occurred in the sessify entry point:", error);
  }
}

// 然后导出所有功能
export { initSessify, getSessionId, startSession, endSession };