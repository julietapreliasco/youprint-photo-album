import { LuLogOut } from 'react-icons/lu';
import { useAuth } from '../../context/useAuthHook';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-grow items-center justify-end gap-2 text-xs md:text-sm">
      <button onClick={handleLogout}>
        <LuLogOut color="#10abbb" />
      </button>
      <span>Salir</span>
    </div>
  );
};
