import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <main className="flex min-h-screen flex-col bg-slate-50">
      <App />
    </main>
  </React.StrictMode>
);
