const SESSION_ID_KEY = "x-sp-session-id";

let storage: Storage = sessionStorage;

/**
 * Initializes the session manager with the specified storage type.
 * @param storageType - The type of storage to use ('session' or 'local').
 */
export function initSessionManager(storageType: 'session' | 'local' = 'session'): void {
  if (typeof window === "undefined") return;
  storage = storageType === 'local' ? localStorage : sessionStorage;
}

function generateNewSessionId(): string {
  // Generate shorter unique ID using timestamp + random combination
  const timestamp = Date.now().toString(36); // Timestamp in base36
  
  // Use Web Crypto API for cryptographically secure random values
  const array = new Uint8Array(4); // 4 bytes for 8 hex characters
  const crypto = typeof window !== "undefined" ? window.crypto : typeof global !== "undefined" ? global.crypto : null;
  
  let randomPart: string;
  if (crypto && crypto.getRandomValues) {
    // Use Web Crypto API for better randomness
    crypto.getRandomValues(array);
    randomPart = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').substring(0, 8);
  } else {
    // Fallback to Math.random if Web Crypto API is not available
    randomPart = Math.random().toString(36).substring(2, 10); // 8 random characters
  }
  
  // Combine into 16-character unique ID
  return timestamp + randomPart;
}

/**
 * Gets the current session ID. If no session exists,
 * a new one is created.
 * @returns The session ID.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = storage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateNewSessionId();
    storage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

/**
 * Force starts a new session, invalidating the old one.
 * @returns The new session ID.
 */
export function startSession(): string {
  if (typeof window === "undefined") return "";
  const newSessionId = generateNewSessionId();
  storage.setItem(SESSION_ID_KEY, newSessionId);
  return newSessionId;
}

/**
 * Ends the current session.
 */
export function endSession(): void {
  if (typeof window === "undefined") return;
  storage.removeItem(SESSION_ID_KEY);
}

/**
 * Checks if there is an active session.
 * @returns True if there is an active session, false otherwise.
 */
export function isSessionActive(): boolean {
  if (typeof window === "undefined") return false;
  const sessionId = storage.getItem(SESSION_ID_KEY);
  return !!sessionId;
}
