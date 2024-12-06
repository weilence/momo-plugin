import "@/assets/style.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster richColors theme="light" position="bottom-center" closeButton />
    <App />
  </React.StrictMode>
);
