import '../App.css';
import { useAuth } from '../context/useAuthHook';

export const Header = () => {
  const { isAuthenticated } = useAuth();

  const title =
    isAuthenticated || location.pathname === '/login'
      ? 'Gestion de Fotolibros'
      : 'Ordena tu Fotolibro';

  return (
    <header className="flex max-w-full items-center justify-between bg-slate-100 px-5 py-4 text-3xl md:px-16">
      <h1 className="self-center text-center text-base font-semibold sm:text-xl md:text-3xl">
        {title}
      </h1>
      <img
        className="w-20 md:w-32"
        src={`${import.meta.env.VITE_PUBLIC_URL}/youprint-logo.png`}
        alt="youprint-logo"
      />
    </header>
  );
};
