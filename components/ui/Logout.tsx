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
    <div className="text-md flex flex-grow justify-end md:text-lg">
      <button className="flex items-center gap-2" onClick={handleLogout}>
        <LuLogOut color="#10abbb" />
        <label className="cursor-pointer">Salir</label>
      </button>
    </div>
  );
};
