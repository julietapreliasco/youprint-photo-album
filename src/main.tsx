import React from "react";
import ReactDOM from "react-dom/client";
import { Header } from "./components/Header";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
   <Header />
    <main className="m-auto p-10 bg-slate-50">
      <App />
    </main>
  </React.StrictMode>,
);