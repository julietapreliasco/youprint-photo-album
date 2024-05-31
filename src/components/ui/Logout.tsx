import { LuLogOut } from 'react-icons/lu';
import { useAuth } from '../../context/useAuthHook';

export const Logout = () => {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <button
      className="flex flex-grow items-center justify-end gap-2 text-xs md:text-sm"
      onClick={handleLogout}
    >
      <LuLogOut color="#10abbb" />
      <span>Salir</span>
    </button>
  );
};
