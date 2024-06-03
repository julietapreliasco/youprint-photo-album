import { createContext, useState, ReactNode, useMemo } from 'react';

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

  const value = useMemo(
    () => ({ loading, error, setLoading, setError }),
    [loading, error]
  );

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
};
