/**
 * API Configuration
 * Centralized API URL configuration
 */

// Use environment variable or fallback to production URL
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000/api/v1'
    : 'https://crm-banking-insurance-production.up.railway.app/api/v1');

// Remove trailing slash to avoid double slash issues and HTTP redirects
export const API_URL = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

export default API_URL;
