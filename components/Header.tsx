'use client';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/useAuthHook';

export const Header = () => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const title =
    isAuthenticated || pathname === '/login'
      ? 'Gestión de fotos'
      : 'Ordena tus fotos';

  return (
    <header className="flex max-w-full items-center justify-between bg-slate-100 px-5 py-4 text-3xl md:px-16">
      <h1 className="self-center text-center text-base font-semibold sm:text-xl md:text-3xl">
        {title}
      </h1>
      <img
        className="w-20 md:w-32"
        src="/youprint-logo.png"
        alt="youprint-logo"
      />
    </header>
  );
};
