import { initBrowserSessify } from "./browser";
import { SessifyConfig } from "./config";
import { getSessionId, startSession, endSession, isSessionActive } from "./SessionManager";

// First define functions
function initSessify(config: SessifyConfig): void {
  try {
    initBrowserSessify(config);
  } catch (error) {
    console.error("❌ A critical error occurred in the sessify entry point:", error);
  }
}
// Then export all functionality
export { initSessify, getSessionId, startSession, endSession, isSessionActive };