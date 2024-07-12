import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      if (token && tokenExpiration) {
        const now = Date.now();
        if (now < parseInt(tokenExpiration, 10)) {
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (token: string) => {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenPayload.exp * 1000;

    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    setIsLoading(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
  };

  const authContextValue = useMemo(
    () => ({ isAuthenticated, isLoading, login, logout }),
    [isAuthenticated, isLoading]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
