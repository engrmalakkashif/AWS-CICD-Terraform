/**
 * Domain types shared by the UI and the data client.
 *
 * These mirror the shape of the endpoints planned for `Healthcare.Api`
 * (`/api/patients`, `/api/appointments`). They are intentionally hand-written
 * rather than generated until the API contract is approved: treat renaming a
 * field here as a contract change and update both sides together.
 *
 * All sample values are synthetic. Never commit real patient data.
 */

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Patient {
  id: string;
  medicalRecordNumber: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  clinician: string;
  specialty: string;
  /** ISO-8601 UTC timestamp. */
  startsAt: string;
  status: AppointmentStatus;
  notes: string;
}

export const APPOINTMENT_STATUSES: readonly AppointmentStatus[] = [
  'scheduled',
  'completed',
  'cancelled',
];

export function patientDisplayName(patient: Patient): string {
  return `${patient.familyName}, ${patient.givenName}`;
}