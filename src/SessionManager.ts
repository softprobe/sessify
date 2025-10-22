/**
 * SessionId Manager
 * Manages the generation and retrieval of session Ids.
 */

// Function to generate a UUID
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Generate a sessionId
function generateSessionId(): string {
  const uuid = generateUUID();
  return `sp-session-${uuid}`;
}

// Get the sessionId (from sessionStorage or generate a new one)
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

// Reset the sessionId (clear the current one and generate a new one)
export function resetSessionId(): string {
  if (typeof window === "undefined") return "";

  sessionStorage.removeItem("x-sp-session-id");
  const newSessionId = generateSessionId();
  sessionStorage.setItem("x-sp-session-id", newSessionId);
  console.log("Reset sessionId:", newSessionId);
  return newSessionId;
}

// Get the current sessionId (without generating a new one)
export function getCurrentSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("x-sp-session-id");
}
