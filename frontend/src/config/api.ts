/**
 * API Configuration
 * Centralized API URL configuration
 */

// Use environment variable or fallback to production URL
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://crm-banking-insurance-production.up.railway.app');

// Remove trailing slash to avoid double slash issues and HTTP redirects
const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

// Always append /api/v1 to the clean URL
export const API_URL = `${cleanUrl}/api/v1`;

export default API_URL;
