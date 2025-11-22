import { initBrowserSessify } from "./browser";
import { SessifyConfig } from "./config";

export function initSessify(config: SessifyConfig): void {
  try {
    initBrowserSessify(config);
  } catch (error) {
    console.error("❌ A critical error occurred in the sessify entry point:", error);
  }
}

export { startSession, endSession } from "./SessionManager";