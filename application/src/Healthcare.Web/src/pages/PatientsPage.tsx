import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useClient } from '../api/ClientProvider';
import { usePatients } from '../api/hooks';
import { patientDisplayName } from '../api/types';
import { EmptyState, ErrorState, LoadingState } from '../components/States';
import { formatDate } from '../lib/format';

export function PatientsPage() {
  const client = useClient();
  const { data: patients, isPending, error, refetch } = usePatients(client);
  const [filter, setFilter] = useState('');

  const visiblePatients = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    if (!needle) {
      return patients ?? [];
    }

    return (patients ?? []).filter((patient) =>
      [
        patientDisplayName(patient),
        patient.medicalRecordNumber,
        patient.email,
      ].some((value) => value.toLowerCase().includes(needle)),
    );
  }, [patients, filter]);

  if (error) {
    return <ErrorState error={error} onRetry={() => void refetch()} />;
  }

  return (
    <>
      <header className="page-header">
        <h1>Patients</h1>
        <p className="page-header__hint">Synthetic records for reference use only.</p>
      </header>

      <div className="toolbar">
        <label className="toolbar__field" htmlFor="patient-filter">
          <span>Filter</span>
          <input
            id="patient-filter"
            type="search"
            value={filter}
            placeholder="Name, MRN, or email"
            onChange={(event) => setFilter(event.target.value)}
          />
        </label>
        <p className="toolbar__count" aria-live="polite">
          {visiblePatients.length} of {patients?.length ?? 0} shown
        </p>
      </div>

      {isPending ? <LoadingState label="Loading patients" /> : null}

      {!isPending && visiblePatients.length === 0 ? (
        <EmptyState title="No matching patients">
          {filter ? 'Try a different filter.' : 'No patient records are available.'}
        </EmptyState>
      ) : null}

      {!isPending && visiblePatients.length > 0 ? (
        <table className="table">
          <caption className="visually-hidden">Patients</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">MRN</th>
              <th scope="col">Date of birth</th>
              <th scope="col">Contact</th>
            </tr>
          </thead>
          <tbody>
            {visiblePatients.map((patient) => (
              <tr key={patient.id}>
                <th scope="row">
                  <Link to={`/patients/${patient.id}`}>{patientDisplayName(patient)}</Link>
                </th>
                <td>{patient.medicalRecordNumber}</td>
                <td>{formatDate(patient.dateOfBirth)}</td>
                <td>
                  <a href={`mailto:${patient.email}`}>{patient.email}</a>
                  <span className="table__secondary">{patient.phone}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </>
  );
}