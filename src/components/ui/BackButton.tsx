import { IoIosArrowBack } from 'react-icons/io';
import { useAuth } from '../../context/useAuthHook';
import { useRouter } from 'next/router';

export const BackButton = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const showButton = isAuthenticated && router.pathname.startsWith('/gallery');

  if (!showButton) return null;

  const handleBack = () => {
    router.push('/');
  };

  return (
    <button className="text-base" onClick={handleBack}>
      <IoIosArrowBack size={20} color="#f9ac2b" />
    </button>
  );
};
