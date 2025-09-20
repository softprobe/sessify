import { initBrowserInspector } from './browser';
import { InspectorConfig } from './config';

export function initInspector(config: InspectorConfig) {
  return initBrowserInspector(config);
}

export { trace } from '@opentelemetry/api';
