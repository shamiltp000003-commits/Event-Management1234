import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true })
// ✅ AXIOS GLOBAL DEFAULTS (NO TOKEN)
  axios.defaults.baseURL = "http://localhost:5000/api";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
