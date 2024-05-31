import { IoIosArrowBack } from 'react-icons/io';
import { useAuth } from '../../context/useAuthHook';
import { useLocation } from 'react-router-dom';

export const BackButton = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const showButton =
    isAuthenticated && location.pathname.startsWith('/gallery');

  if (!showButton) return null;

  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <button className="text-base">
      <IoIosArrowBack onClick={handleBack} size={20} color="#f9ac2b" />
    </button>
  );
};
