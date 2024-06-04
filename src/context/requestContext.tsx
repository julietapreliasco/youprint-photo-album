import { createContext, useState, ReactNode, useMemo } from 'react';
import { ErrorType } from '../types';

interface RequestContextProps {
  loading: boolean;
  error: ErrorType;
  setLoading: (loading: boolean) => void;
  setError: (error: ErrorType) => void;
}

export const RequestContext = createContext<RequestContextProps | undefined>(
  undefined
);

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType>({
    error: false,
    message: '',
  });

  const value = useMemo(
    () => ({ loading, error, setLoading, setError }),
    [loading, error]
  );

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
};
