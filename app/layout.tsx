import React from 'react';
import { ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import { Header } from '../components/Header';
import { AdminNavBar } from '../components/ui/AdminNavBar';
import { Loader } from '../components/ui/Loader';
import { ErrorMsg } from '../components/ui/ErrorMsg';
import { ConfirmationModal } from '../components/ui/Modal';
import AppProvider from '../context/AppProvider';
import './global.css';

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link
          rel="shortcut icon"
          href="/youprint-logo.ico"
          type="image/x-icon"
        />
      </head>
      <body className={poppins.className}>
        <AppProvider>
          <main className="flex min-h-screen flex-col bg-slate-50">
            <Header />
            <AdminNavBar />
            <div className="flex-grow px-12 py-10">
              {children}
              <Loader />
              <ErrorMsg />
            </div>
            <ConfirmationModal />
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
