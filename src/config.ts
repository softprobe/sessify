export type SessifyConfig = {
  // --- Core Authentication ---
  siteName: string;

  // --- Session Management ---
  sessionStorageType?: 'session' | 'local';

  // --- Core Configuration ---

  // --- Data Export Configuration ---
  /**
   * Whether to enable data reporting to Softprobe backend.
   * @default true
   */
  enableTrace?: boolean;

  /**
   * Custom data reporting endpoint, used to override the default production address ('https://o.softprobe.ai').
   */
  endpoint?: string;

  /**
   * Whether to print tracking information to browser console.
   * Recommended to enable only during development and debugging.
   * @default false
   */
  enableConsole?: boolean;

  // --- Auto-detection Configuration ---
  instrumentations?: {
    /**
     * Whether to monitor network requests (Fetch and XHR).
     * @default true
     */
    network?: boolean;
    /**
     * Whether to monitor user interaction events.
     * @default false
     */
    interaction?: boolean;
    /**
     * Whether to record page environment and loading information.
     * @default false
     */
    environment?: boolean;
  };

  // --- Other Configuration ---
  /** Whether to enable scroll monitoring, disabled by default */
  observeScroll?: boolean;
};