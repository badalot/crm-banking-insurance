import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://crm-banking-insurance-production.up.railway.app';

export interface SystemSettings {
  id?: number;
  // Généraux
  site_name?: string;
  site_description?: string;
  support_email?: string;
  support_phone?: string;
  timezone?: string;
  language?: string;
  date_format?: string;
  // Sécurité
  session_timeout?: number;
  password_min_length?: number;
  password_require_uppercase?: boolean;
  password_require_lowercase?: boolean;
  password_require_numbers?: boolean;
  password_require_special?: boolean;
  max_login_attempts?: number;
  lockout_duration?: number;
  two_factor_auth_enabled?: boolean;
  // Email/SMTP
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  smtp_use_tls?: boolean;
  smtp_from_email?: string;
  smtp_from_name?: string;
  // Fonctionnalités
  enable_audit_log?: boolean;
  enable_email_notifications?: boolean;
  enable_user_registration?: boolean;
  enable_password_reset?: boolean;
  maintenance_mode?: boolean;
  maintenance_message?: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const settingsService = {
  getSettings: async (): Promise<SystemSettings> => {
    const response = await axios.get(`${API_URL}/api/v1/settings/`, getAuthHeader());
    return response.data;
  },

  updateSettings: async (settings: SystemSettings): Promise<SystemSettings> => {
    const response = await axios.put(`${API_URL}/api/v1/settings/`, settings, getAuthHeader());
    return response.data;
  },

  testEmail: async (): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`${API_URL}/api/v1/settings/test-email`, {}, getAuthHeader());
    return response.data;
  },

  resetSettings: async (): Promise<SystemSettings> => {
    const response = await axios.post(`${API_URL}/api/v1/settings/reset`, {}, getAuthHeader());
    return response.data;
  },
};
