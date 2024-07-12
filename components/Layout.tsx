import { ReactNode } from 'react';
import { Header } from './Header';
import { AdminNavBar } from './ui/AdminNavBar';
import { Loader } from './ui/Loader';
import { ErrorMsg } from './ui/ErrorMsg';
import { ConfirmationModal } from './ui/Modal';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <AdminNavBar />
      <div className="flex-grow p-10">
        {children}
        <Loader />
        <ErrorMsg />
      </div>
      <ConfirmationModal />
    </main>
  );
}
