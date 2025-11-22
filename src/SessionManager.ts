const SESSION_ID_KEY = "x-sp-session-id";
const SESSION_LAST_ACTIVITY_KEY = "x-sp-session-last-activity";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

let storage: Storage = sessionStorage;

/**
 * Initializes the session manager with the specified storage type.
 * @param storageType - The type of storage to use ('session' or 'local').
 */
export function initSessionManager(storageType: 'session' | 'local' = 'session'): void {
  if (typeof window === "undefined") return;
  storage = storageType === 'local' ? localStorage : sessionStorage;
}

function updateLastActivity(): void {
  if (typeof window === "undefined") return;
  storage.setItem(SESSION_LAST_ACTIVITY_KEY, Date.now().toString());
}

function isSessionExpired(): boolean {
  if (typeof window === "undefined") return true;
  const lastActivity = storage.getItem(SESSION_LAST_ACTIVITY_KEY);
  if (!lastActivity) {
    return false; // No activity yet, so not expired
  }
  return Date.now() - parseInt(lastActivity, 10) > SESSION_TIMEOUT;
}

function generateNewSessionId(): string {
  // Generate shorter unique ID using timestamp + random combination
  const timestamp = Date.now().toString(36); // Timestamp in base36
  const randomPart = Math.random().toString(36).substring(2, 10); // 8 random characters
  
  // Combine into 16-character unique ID
  return timestamp + randomPart;
}

/**
 * Gets the current session ID. If the session is expired or doesn't exist,
 * a new one is created.
 * @returns The session ID.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = storage.getItem(SESSION_ID_KEY);
  if (!sessionId || isSessionExpired()) {
    sessionId = generateNewSessionId();
    storage.setItem(SESSION_ID_KEY, sessionId);
  }
  updateLastActivity();
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
  updateLastActivity();
  return newSessionId;
}

/**
 * Ends the current session.
 */
export function endSession(): void {
  if (typeof window === "undefined") return;
  storage.removeItem(SESSION_ID_KEY);
  storage.removeItem(SESSION_LAST_ACTIVITY_KEY);
}

/**
 * Checks if there is an active session.
 * @returns True if there is an active session, false otherwise.
 */
export function isSessionActive(): boolean {
  if (typeof window === "undefined") return false;
  const sessionId = storage.getItem(SESSION_ID_KEY);
  return !!sessionId && !isSessionExpired();
}