/**
 * API Configuration
 * Centralized API URL configuration
 */

// Use environment variable or fallback to production URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000/api/v1'
    : 'https://crm-banking-insurance-production.up.railway.app/api/v1');

export default API_URL;
