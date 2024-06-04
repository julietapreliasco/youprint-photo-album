import { Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuthHook';

interface PrivateRouteProps {
  component: React.ComponentType;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Component {...rest} />;
};
