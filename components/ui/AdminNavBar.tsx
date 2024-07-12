'use client';
import { useAuth } from '../../context/useAuthHook';
import { BackButton } from './BackButton';
import { Logout } from './Logout';

export const AdminNavBar = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center justify-between px-5 pt-5">
      <BackButton />
      <Logout />
    </div>
  );
};
