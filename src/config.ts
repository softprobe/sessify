export type InspectorConfig = {
  // Business related
  apiKey: string;
  userId: string;
  /** Differentiate business lines */
  serviceName: string;
  /** Address for receiving spans, POST <collectorEndpoint>/v1/traces */
  collectorEndpoint?: string;
  /** 'dev' | 'prd' */
  env?: string;

  // Configuration related
  /** Whether to enable scroll listening, disabled by default */
  observeScroll?: boolean;
};
