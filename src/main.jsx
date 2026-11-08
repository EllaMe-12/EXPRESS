import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

// Capture the browser's install event before React mounts. This avoids losing
// the one-time event while the app is still registering component effects.
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  window.__EXPRESS_INSTALL_PROMPT__ = event;
});

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch((error) => {
      console.error("EXPRESS service worker registration failed:", error);
    });
  });
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);