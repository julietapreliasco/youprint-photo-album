'use client';
import { LuLogOut } from 'react-icons/lu';
import { useAuth } from '../../context/useAuthHook';
import { useRouter } from 'next/navigation';

export const Logout = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
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
