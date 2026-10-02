const DATE_TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

/**
 * Formats an ISO-8601 UTC timestamp. UTC is fixed rather than local so that a
 * clinician reading an appointment in another timezone is not misled, and so
 * tests are not host-timezone dependent.
 */
export function formatDateTime(iso: string): string {
  const parsed = Date.parse(iso);
  return Number.isNaN(parsed) ? 'Unknown time' : `${DATE_TIME_FORMAT.format(parsed)} UTC`;
}

export function formatDate(isoDate: string): string {
  const parsed = Date.parse(`${isoDate}T00:00:00Z`);
  return Number.isNaN(parsed) ? 'Unknown date' : DATE_FORMAT.format(parsed);
}

export function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}