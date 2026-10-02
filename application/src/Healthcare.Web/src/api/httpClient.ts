import { HealthcareApiError, type HealthcareClient } from './client';
import type { Appointment, Patient } from './types';

export interface HttpClientOptions {
  /** Same-origin by default; set VITE_API_BASE_URL when the API has a host. */
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

/**
 * Talks to the real `Healthcare.Api` endpoints.
 *
 * Inactive today: `/api/patients` and `/api/appointments` are planned but not
 * implemented, and the API has no authentication or CORS policy yet. Enable it
 * by setting `VITE_API_BASE_URL` once those endpoints ship and the ingress
 * decisions in docs/03-network-security.md are approved.
 */
export function createHttpClient(options: HttpClientOptions = {}): HealthcareClient {
  const baseUrl = (options.baseUrl ?? '').replace(/\/+$/, '');
  const doFetch = options.fetchImpl ?? globalThis.fetch.bind(globalThis);

  async function request<T>(path: string, resource: string): Promise<T> {
    const response = await doFetch(`${baseUrl}${path}`, {
      headers: { Accept: 'application/json' },
    });

    if (response.status === 404) {
      throw new HealthcareApiError(`No ${resource} found.`, 404, resource);
    }

    if (!response.ok) {
      throw new HealthcareApiError(
        `Request to ${path} failed with status ${response.status}.`,
        response.status,
        resource,
      );
    }

    return (await response.json()) as T;
  }

  return {
    kind: 'http',
    listPatients: () => request<Patient[]>('/api/patients', 'patients'),
    getPatient: (id) =>
      request<Patient>(`/api/patients/${encodeURIComponent(id)}`, 'patients'),
    listAppointments: () => request<Appointment[]>('/api/appointments', 'appointments'),
  };
}