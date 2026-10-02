import type { AppointmentStatus } from '../api/types';
import { formatStatus } from '../lib/format';

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`badge badge--${status}`} data-testid={`status-${status}`}>
      {formatStatus(status)}
    </span>
  );
}