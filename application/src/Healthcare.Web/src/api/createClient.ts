import type { HealthcareClient } from './client';
import { createHttpClient } from './httpClient';
import { createMockClient } from './mockClient';

export interface CreateClientOptions {
  baseUrl?: string;
  latencyMs?: number;
}

/**
 * Chooses the data source at startup: synthetic fixtures by default, the real
 * API when `VITE_API_BASE_URL` is present. This is the only place the choice is
 * made, so switching the UI onto the API is a configuration change.
 */
export function createClient(options: CreateClientOptions = {}): HealthcareClient {
  const baseUrl = options.baseUrl ?? import.meta.env.VITE_API_BASE_URL;

  return baseUrl
    ? createHttpClient({ baseUrl })
    : createMockClient({ latencyMs: options.latencyMs });
}