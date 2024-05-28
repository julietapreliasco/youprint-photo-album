import React from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from './components/Header';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-slate-50 p-10">
        <App />
      </main>
    </div>
  </React.StrictMode>
);
