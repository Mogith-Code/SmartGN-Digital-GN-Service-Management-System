import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Auto-route /api and /uploads to Render Backend in production
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? ""
    : "https://smartgn-digital-gn-service-management-5diw.onrender.com");

if (typeof window !== "undefined" && API_BASE_URL) {
  const originalFetch = window.fetch;
  window.fetch = function (resource, init) {
    if (typeof resource === "string") {
      if (resource.startsWith("/api/") || resource.startsWith("/uploads/")) {
        resource = `${API_BASE_URL}${resource}`;
      }
    } else if (resource instanceof Request) {
      const url = resource.url;
      if (url.startsWith(window.location.origin + "/api/") || url.startsWith(window.location.origin + "/uploads/")) {
        const path = url.substring(window.location.origin.length);
        resource = new Request(`${API_BASE_URL}${path}`, resource);
      }
    }
    return originalFetch.call(this, resource, init);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

