import { useQuery } from '@tanstack/react-query';
import { queryKeys, type HealthcareClient } from './client';
import type { Appointment, Patient } from './types';

export function usePatients(client: HealthcareClient) {
  return useQuery({
    queryKey: queryKeys.patients,
    queryFn: () => client.listPatients(),
  });
}

export function usePatient(client: HealthcareClient, id: string) {
  return useQuery({
    queryKey: queryKeys.patient(id),
    queryFn: () => client.getPatient(id),
    enabled: id.length > 0,
    retry: false,
  });
}

export function useAppointments(client: HealthcareClient) {
  return useQuery({
    queryKey: queryKeys.appointments,
    queryFn: () => client.listAppointments(),
  });
}

export interface ScheduledAppointment {
  appointment: Appointment;
  patient: Patient;
}

/**
 * Joins appointments to patients and keeps the future, still-scheduled ones.
 *
 * Requires both queries so a list is never rendered with missing patients.
 * Appointments pointing at an unknown patient are dropped with a console warning
 * rather than rendered as a blank row.
 */
export function useUpcomingAppointments(client: HealthcareClient): {
  appointments: ScheduledAppointment[];
  isLoading: boolean;
  error: Error | null;
} {
  const appointmentsQuery = useAppointments(client);
  const patientsQuery = usePatients(client);

  const error = appointmentsQuery.error ?? patientsQuery.error ?? null;
  const isLoading = appointmentsQuery.isPending || patientsQuery.isPending;

  if (error || isLoading) {
    return { appointments: [], isLoading, error };
  }

  const patientsById = new Map(
    (patientsQuery.data ?? []).map((patient) => [patient.id, patient]),
  );
  const now = Date.now();

  const appointments: ScheduledAppointment[] = [];

  for (const appointment of appointmentsQuery.data ?? []) {
    if (appointment.status !== 'scheduled' || Date.parse(appointment.startsAt) < now) {
      continue;
    }

    const patient = patientsById.get(appointment.patientId);
    if (!patient) {
      console.warn(
        `Dropping appointment ${appointment.id}: unknown patient ${appointment.patientId}.`,
      );
      continue;
    }

    appointments.push({ appointment, patient });
  }

  appointments.sort(
    (a, b) => Date.parse(a.appointment.startsAt) - Date.parse(b.appointment.startsAt),
  );

  return { appointments, isLoading, error };
}