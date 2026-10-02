import type { Appointment, Patient } from './types';

/**
 * Error raised by every `HealthcareClient` implementation so callers can handle
 * transport and not-found failures without depending on the transport shape.
 */
export class HealthcareApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly resource: string,
  ) {
    super(message);
    this.name = 'HealthcareApiError';
  }
}

/**
 * The single seam between the UI and its data source.
 *
 * The UI depends on this interface only, so the in-memory fixtures used today
 * can be replaced by the real API without touching components: change the
 * factory in `createClient` and keep the signatures.
 */
export interface HealthcareClient {
  readonly kind: 'mock' | 'http';
  listPatients(): Promise<Patient[]>;
  getPatient(id: string): Promise<Patient>;
  listAppointments(): Promise<Appointment[]>;
}

export const queryKeys = {
  patients: ['patients'] as const,
  patient: (id: string) => ['patients', id] as const,
  appointments: ['appointments'] as const,
};