'use client';
import { IoIosArrowBack } from 'react-icons/io';
import { useAuth } from '../../context/useAuthHook';
import { usePathname, useRouter } from 'next/navigation';

export const BackButton = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const showButton = isAuthenticated && pathname.startsWith('/gallery');

  if (!showButton) return null;

  const handleBack = () => {
    router.push('/');
  };

  return (
    <button className="text-md md:text-lg" onClick={handleBack}>
      <IoIosArrowBack size={20} color="#f9ac2b" />
    </button>
  );
};
