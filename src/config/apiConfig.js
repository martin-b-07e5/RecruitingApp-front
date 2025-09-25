/**
 * API Configuration using environment variables
 * Set VITE_API_BASE_URL in your .env files
 */
console.log("VITE_API_BASE_URL from environment:", import.meta.env.VITE_API_BASE_URL);
export const BASE_API_URL =
  import.meta.env.VITE_API_BASE_URL;
console.log("Using API URL:", BASE_API_URL);
