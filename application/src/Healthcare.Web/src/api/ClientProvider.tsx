import { createContext, useContext, type ReactNode } from 'react';
import type { HealthcareClient } from './client';

const HealthcareClientContext = createContext<HealthcareClient | null>(null);

export interface ClientProviderProps {
  client: HealthcareClient;
  children: ReactNode;
}

export function ClientProvider({ client, children }: ClientProviderProps) {
  return (
    <HealthcareClientContext.Provider value={client}>
      {children}
    </HealthcareClientContext.Provider>
  );
}

export function useClient(): HealthcareClient {
  const client = useContext(HealthcareClientContext);
  if (!client) {
    throw new Error('useClient must be used inside a <ClientProvider>.');
  }
  return client;
}