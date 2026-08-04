// src/utils/imageUtils.js
import { API_BASE_URL } from "./api";

/**
 * Resolves an image path, data URI, or URL to a fully-accessible image URL.
 * Works seamlessly in both local development and cloud production (e.g. Render).
 *
 * @param {string} imagePath - Relative path (e.g. /uploads/profile/xxx.jpg), base64 string, or full URL
 * @returns {string|null} - The complete URL or data string to render in an <img> tag
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") return null;

  const trimmed = imagePath.trim();
  if (!trimmed) return null;

  // 1. Data URLs (Base64) - Return as is for instant browser previews
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  // 2. Blob URLs - Return as is
  if (trimmed.startsWith("blob:")) {
    return trimmed;
  }

  // 3. Absolute HTTP / HTTPS URLs - Return as is
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // 4. Backend base URL determination
  const backendBase =
    API_BASE_URL ||
    import.meta.env?.VITE_API_URL ||
    (typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
      ? ""
      : "https://smartgn-digital-gn-service-management-5diw.onrender.com");

  // Clean the relative path
  let cleanPath = trimmed.replace(/^\/+/, "");

  // If path doesn't start with uploads/ and has no subdirectories, assume uploads folder
  if (!cleanPath.startsWith("uploads/")) {
    if (!cleanPath.includes("/")) {
      cleanPath = `uploads/${cleanPath}`;
    }
  }

  // If backendBase is empty (e.g. localhost with proxy), return root-relative path
  if (!backendBase) {
    return `/${cleanPath}`;
  }

  // Otherwise prefix with backend domain (ensuring clean single slash)
  const normalizedBase = backendBase.replace(/\/+$/, "");
  return `${normalizedBase}/${cleanPath}`;
};
