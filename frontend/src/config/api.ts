/**
 * API Configuration
 * Centralized API URL configuration
 */

// Force HTTPS in production to avoid Railway redirects
const isProduction = globalThis.window !== undefined && 
  (globalThis.window.location.hostname === 'crm-banking-insurance.vercel.app' || 
   globalThis.window.location.hostname.includes('vercel.app'));

const baseUrl = isProduction
  ? 'https://crm-banking-insurance-production.up.railway.app'
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

// Remove trailing slash to avoid double slash issues and HTTP redirects
const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

// Always append /api/v1 to the clean URL
export const API_URL = `${cleanUrl}/api/v1`;

console.log('[API Config] Environment:', { isProduction, baseUrl, cleanUrl, API_URL });

export default API_URL;
