import type { ReactNode } from 'react';
import { HealthcareApiError } from '../api/client';

export function LoadingState({ label }: { label: string }) {
  return (
    <p className="state state--loading" role="status">
      {label}
    </p>
  );
}

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  children?: ReactNode;
}

/**
 * Surfaces a failed query. Unexpected failures are reported by kind only so an
 * API message or URL cannot leak internals into the UI or the logs.
 */
export function ErrorState({ error, onRetry, children }: ErrorStateProps) {
  const notFound = error instanceof HealthcareApiError && error.status === 404;
  const title = notFound ? 'Not found' : 'Could not load data';

  return (
    <div className="state state--error" role="alert">
      <h2>{title}</h2>
      <p>{children ?? (notFound ? 'That record does not exist.' : 'The request failed. Try again.')}</p>
      {onRetry ? (
        <button type="button" className="button" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="state state--empty">
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}