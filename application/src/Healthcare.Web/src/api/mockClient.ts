import { HealthcareApiError, type HealthcareClient } from './client';
import {
  patientFixtures,
  resolveAppointments,
} from './fixtures';
import type { Appointment, Patient } from './types';

export interface MockClientOptions {
  /** Clock used to place fixture appointments. Inject to make tests stable. */
  reference?: Date;
  /** Artificial latency so loading states are observable in the browser. */
  latencyMs?: number;
}

const DEFAULT_LATENCY_MS = 250;

/**
 * In-memory implementation of {@link HealthcareClient} backed by synthetic
 * fixtures. This is what runs until `VITE_API_BASE_URL` is set, which keeps the
 * UI demonstrable without a database, network access, or real records.
 */
export function createMockClient(options: MockClientOptions = {}): HealthcareClient {
  const reference = options.reference ?? new Date();
  const latencyMs = options.latencyMs ?? DEFAULT_LATENCY_MS;

  // Cloned once per client so callers cannot mutate the shared fixtures.
  const patients: Patient[] = patientFixtures.map((patient) => ({ ...patient }));
  const appointments: Appointment[] = resolveAppointments(reference);

  const sortAppointments = (values: Appointment[]): Appointment[] =>
    values.toSorted((a, b) => a.startsAt.localeCompare(b.startsAt));

  const respond = <T>(value: T): Promise<T> =>
    latencyMs > 0
      ? new Promise((resolve) => {
          setTimeout(() => {
            resolve(value);
          }, latencyMs);
        })
      : Promise.resolve(value);

  return {
    kind: 'mock',

    async listPatients(): Promise<Patient[]> {
      return respond(patients.map((patient) => ({ ...patient })));
    },

    async getPatient(id: string): Promise<Patient> {
      const patient = patients.find((candidate) => candidate.id === id);
      if (!patient) {
        throw new HealthcareApiError(`No patient with id "${id}".`, 404, 'patients');
      }
      return respond({ ...patient });
    },

    async listAppointments(): Promise<Appointment[]> {
      return respond(sortAppointments(appointments.map((item) => ({ ...item }))));
    },
  };
}

export function appointmentsForPatient(
  appointments: readonly Appointment[],
  patientId: string,
): Appointment[] {
  return appointments
    .filter((appointment) => appointment.patientId === patientId)
    .toSorted((a, b) => a.startsAt.localeCompare(b.startsAt));
}