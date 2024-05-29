import { createContext, useState, ReactNode } from 'react';

interface RequestContextProps {
  loading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const RequestContext = createContext<RequestContextProps | undefined>(
  undefined
);

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <RequestContext.Provider value={{ loading, error, setLoading, setError }}>
      {children}
    </RequestContext.Provider>
  );
};
