import { createContext, useContext } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

const TechnologiesContext = createContext(null);

export function TechnologiesProvider({ children }) {
  const api = useTechnologiesApi();

  return (
    <TechnologiesContext.Provider value={api}>
      {children}
    </TechnologiesContext.Provider>
  );
}

export function useTechnologies() {
  const ctx = useContext(TechnologiesContext);
  if (!ctx) {
    throw new Error('useTechnologies must be used within TechnologiesProvider');
  }
  return ctx;
}

export default TechnologiesContext;
