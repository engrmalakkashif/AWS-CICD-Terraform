import type { Appointment, AppointmentStatus, Patient } from './types';

/**
 * Synthetic fixtures only.
 *
 * Names, identifiers, contact details, and clinical notes below are invented for
 * demonstration. `.example` is a reserved documentation domain (RFC 2606), so
 * these records cannot reach a real mailbox. Replace this module with the real
 * client once the API contract is approved; never add real records.
 */

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export interface AppointmentFixture {
  id: string;
  patientId: string;
  clinician: string;
  specialty: string;
  /** Days from the reference "now"; negative values are in the past. */
  dayOffset: number;
  /** Local time of day, 24-hour. */
  hour: number;
  status: AppointmentStatus;
  notes: string;
}

export const patientFixtures: readonly Patient[] = [
  {
    id: 'pat-1001',
    medicalRecordNumber: 'MRN-0001001',
    givenName: 'Amara',
    familyName: 'Okafor',
    dateOfBirth: '1984-03-12',
    email: 'amara.okafor@example.com',
    phone: '+1-555-0101',
  },
  {
    id: 'pat-1002',
    medicalRecordNumber: 'MRN-0001002',
    givenName: 'Bruno',
    familyName: 'Almeida',
    dateOfBirth: '1991-11-02',
    email: 'bruno.almeida@example.com',
    phone: '+1-555-0102',
  },
  {
    id: 'pat-1003',
    medicalRecordNumber: 'MRN-0001003',
    givenName: 'Chen',
    familyName: 'Wei',
    dateOfBirth: '1976-07-29',
    email: 'chen.wei@example.com',
    phone: '+1-555-0103',
  },
  {
    id: 'pat-1004',
    medicalRecordNumber: 'MRN-0001004',
    givenName: 'Dilnoza',
    familyName: 'Rahmanova',
    dateOfBirth: '2001-01-24',
    email: 'dilnoza.rahmanova@example.com',
    phone: '+1-555-0104',
  },
  {
    id: 'pat-1005',
    medicalRecordNumber: 'MRN-0001005',
    givenName: 'Elias',
    familyName: 'Sorensen',
    dateOfBirth: '1969-09-15',
    email: 'elias.sorensen@example.com',
    phone: '+1-555-0105',
  },
  {
    id: 'pat-1006',
    medicalRecordNumber: 'MRN-0001006',
    givenName: 'Fatima',
    familyName: 'Nasser',
    dateOfBirth: '1996-05-08',
    email: 'fatima.nasser@example.com',
    phone: '+1-555-0106',
  },
];

export const appointmentFixtures: readonly AppointmentFixture[] = [
  {
    id: 'apt-5001',
    patientId: 'pat-1001',
    clinician: 'Dr. Ines Duarte',
    specialty: 'Cardiology',
    dayOffset: -21,
    hour: 9,
    status: 'completed',
    notes: 'Routine follow-up; synthetic record.',
  },
  {
    id: 'apt-5002',
    patientId: 'pat-1001',
    clinician: 'Dr. Ines Duarte',
    specialty: 'Cardiology',
    dayOffset: 3,
    hour: 14,
    status: 'scheduled',
    notes: 'Requested by patient; synthetic record.',
  },
  {
    id: 'apt-5003',
    patientId: 'pat-1002',
    clinician: 'Dr. Tobias Lenz',
    specialty: 'General Practice',
    dayOffset: 1,
    hour: 8,
    status: 'scheduled',
    notes: 'Annual review; synthetic record.',
  },
  {
    id: 'apt-5004',
    patientId: 'pat-1002',
    clinician: 'Dr. Tobias Lenz',
    specialty: 'General Practice',
    dayOffset: -7,
    hour: 11,
    status: 'cancelled',
    notes: 'Cancelled by clinic; synthetic record.',
  },
  {
    id: 'apt-5005',
    patientId: 'pat-1003',
    clinician: 'Dr. Priya Raman',
    specialty: 'Endocrinology',
    dayOffset: 6,
    hour: 10,
    status: 'scheduled',
    notes: 'Lab results review; synthetic record.',
  },
  {
    id: 'apt-5006',
    patientId: 'pat-1004',
    clinician: 'Dr. Samuel Okonkwo',
    specialty: 'Paediatrics',
    dayOffset: 2,
    hour: 15,
    status: 'scheduled',
    notes: 'Vaccination appointment; synthetic record.',
  },
  {
    id: 'apt-5007',
    patientId: 'pat-1005',
    clinician: 'Dr. Priya Raman',
    specialty: 'Endocrinology',
    dayOffset: -3,
    hour: 13,
    status: 'completed',
    notes: 'Medication review; synthetic record.',
  },
  {
    id: 'apt-5008',
    patientId: 'pat-1006',
    clinician: 'Dr. Samuel Okonkwo',
    specialty: 'Paediatrics',
    dayOffset: 9,
    hour: 16,
    status: 'scheduled',
    notes: 'Post-discharge check; synthetic record.',
  },
];

/** Resolves fixture offsets into absolute ISO-8601 UTC timestamps. */
export function resolveAppointments(reference: Date): Appointment[] {
  const midnightUtc = Date.UTC(
    reference.getUTCFullYear(),
    reference.getUTCMonth(),
    reference.getUTCDate(),
  );

  return appointmentFixtures.map((fixture) => ({
    id: fixture.id,
    patientId: fixture.patientId,
    clinician: fixture.clinician,
    specialty: fixture.specialty,
    startsAt: new Date(
      midnightUtc + fixture.dayOffset * DAY_IN_MS + fixture.hour * 60 * 60 * 1000,
    ).toISOString(),
    status: fixture.status,
    notes: fixture.notes,
  }));
}