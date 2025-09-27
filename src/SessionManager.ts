/**
 * SessionId 管理器
 * 统一管理sessionId的生成和获取
 */

// 生成UUID函数
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 生成sessionId
function generateSessionId(): string {
  const uuid = generateUUID();
  return `sp-session-${uuid}`;
}

// 获取sessionId（从sessionStorage或生成新的）
export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem("x-sp-session-id");
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem("x-sp-session-id", sessionId);
    console.log("Generated new sessionId:", sessionId);
  } else {
    console.log("Using existing sessionId:", sessionId);
  }
  return sessionId;
}

// 重置sessionId（清除当前的并生成新的）
export function resetSessionId(): string {
  if (typeof window === "undefined") return "";

  sessionStorage.removeItem("x-sp-session-id");
  const newSessionId = generateSessionId();
  sessionStorage.setItem("x-sp-session-id", newSessionId);
  console.log("Reset sessionId:", newSessionId);
  return newSessionId;
}

// 获取当前sessionId（不生成新的）
export function getCurrentSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("x-sp-session-id");
}
