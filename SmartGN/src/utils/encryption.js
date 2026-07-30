// src/utils/encryption.js

/**
 * Simple encryption/decryption utility for URL parameters
 * Uses btoa/atob for encoding (not secure but works for obfuscation)
 * For production, use a proper encryption library like crypto-js
 */

// Simple encoding function
export const encryptId = (id) => {
  if (!id) return "";
  // Encode to base64 and make URL-safe
  const encoded = btoa(id);
  // Replace characters that might cause issues in URLs
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

// Simple decoding function
export const decryptId = (encryptedId) => {
  if (!encryptedId) return "";
  try {
    // Restore original base64
    let base64 = encryptedId.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }
    return atob(base64);
  } catch (error) {
    console.error("Error decrypting ID:", error);
    return encryptedId; // Return original if decryption fails
  }
};

// Optional: More secure encryption using crypto-js
// Install: npm install crypto-js
// Uncomment below if using crypto-js

/*
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'smartgn_secret_key_2024';

export const encryptId = (id) => {
    if (!id) return '';
    return CryptoJS.AES.encrypt(id, SECRET_KEY).toString();
};

export const decryptId = (encryptedId) => {
    if (!encryptedId) return '';
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedId, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Error decrypting ID:', error);
        return encryptedId;
    }
};
*/
