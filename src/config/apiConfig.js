/**
 * API Configuration using environment variables
 * Set VITE_API_BASE_URL in your .env files
 * .env.local when running locally
 */
console.log("VITE_API_BASE_URL from environment:", import.meta.env.VITE_API_BASE_URL);
export const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("Using API URL:", VITE_API_BASE_URL);
