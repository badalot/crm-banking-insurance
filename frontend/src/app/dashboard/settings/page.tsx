/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */
// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { settingsService, SystemSettings } from '@/services/settings.service';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SystemSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      showMessage('error', err.response?.data?.detail || 'Impossible de charger les paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsService.updateSettings(settings);
      showMessage('success', 'Paramètres enregistrés avec succès');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      showMessage('error', err.response?.data?.detail || 'Impossible de sauvegarder les paramètres');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      setTestingEmail(true);
      const result = await settingsService.testEmail();
      showMessage('success', result.message);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      showMessage('error', err.response?.data?.detail || 'Test email échoué');
    } finally {
      setTestingEmail(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      return;
    }
    
    try {
      setSaving(true);
      const data = await settingsService.resetSettings();
      setSettings(data);
      showMessage('success', 'Paramètres réinitialisés avec succès');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      showMessage('error', err.response?.data?.detail || 'Impossible de réinitialiser les paramètres');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'Général' },
    { id: 'security', label: 'Sécurité' },
    { id: 'email', label: 'Email/SMTP' },
    { id: 'features', label: 'Fonctionnalités' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0b2e] to-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 transition-all"
              title="Retour"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-white">Paramètres Système</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
            >
              🔄 Réinitialiser
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving ? '⏳ Enregistrement...' : '💾 Enregistrer'}
            </button>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 
            'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Onglet Général */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nom du site</label>
                  <input
                    type="text"
                    value={settings.site_name || ''}
                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={settings.site_description || ''}
                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email de support</label>
                    <input
                      type="email"
                      value={settings.support_email || ''}
                      onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone de support</label>
                    <input
                      type="text"
                      value={settings.support_phone || ''}
                      onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fuseau horaire</label>
                    <select
                      value={settings.timezone || 'UTC'}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="UTC">UTC</option>
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Langue</label>
                    <select
                      value={settings.language || 'fr'}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Format de date</label>
                    <select
                      value={settings.date_format || 'DD/MM/YYYY'}
                      onChange={(e) => setSettings({ ...settings, date_format: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Sécurité */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Délai d'expiration de session (minutes)</label>
                  <input
                    type="number"
                    min={5}
                    max={1440}
                    value={settings.session_timeout || 30}
                    onChange={(e) => setSettings({ ...settings, session_timeout: Number.parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Politique de mot de passe</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Longueur minimale</label>
                      <input
                        type="number"
                        min={6}
                        max={32}
                        value={settings.password_min_length || 8}
                        onChange={(e) => setSettings({ ...settings, password_min_length: Number.parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                        <input
                          type="checkbox"
                          checked={settings.password_require_uppercase || false}
                          onChange={(e) => setSettings({ ...settings, password_require_uppercase: e.target.checked })}
                          className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-300">Exiger des majuscules</span>
                      </label>

                      <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                        <input
                          type="checkbox"
                          checked={settings.password_require_lowercase || false}
                          onChange={(e) => setSettings({ ...settings, password_require_lowercase: e.target.checked })}
                          className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-300">Exiger des minuscules</span>
                      </label>

                      <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                        <input
                          type="checkbox"
                          checked={settings.password_require_numbers || false}
                          onChange={(e) => setSettings({ ...settings, password_require_numbers: e.target.checked })}
                          className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-300">Exiger des chiffres</span>
                      </label>

                      <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                        <input
                          type="checkbox"
                          checked={settings.password_require_special || false}
                          onChange={(e) => setSettings({ ...settings, password_require_special: e.target.checked })}
                          className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-300">Exiger des caractères spéciaux</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tentatives de connexion max</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={settings.max_login_attempts || 5}
                        onChange={(e) => setSettings({ ...settings, max_login_attempts: Number.parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Durée de verrouillage (minutes)</label>
                      <input
                        type="number"
                        min={5}
                        max={120}
                        value={settings.lockout_duration || 15}
                        onChange={(e) => setSettings({ ...settings, lockout_duration: Number.parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all mt-4">
                    <input
                      type="checkbox"
                      checked={settings.two_factor_auth_enabled || false}
                      onChange={(e) => setSettings({ ...settings, two_factor_auth_enabled: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-gray-300">Authentification à deux facteurs</span>
                  </label>
                </div>
              </div>
            )}

            {/* Onglet Email/SMTP */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Serveur SMTP</label>
                    <input
                      type="text"
                      value={settings.smtp_host || ''}
                      onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                      placeholder="smtp.example.com"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Port SMTP</label>
                    <input
                      type="number"
                      min={1}
                      max={65535}
                      value={settings.smtp_port || 587}
                      onChange={(e) => setSettings({ ...settings, smtp_port: Number.parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nom d'utilisateur SMTP</label>
                    <input
                      type="text"
                      value={settings.smtp_username || ''}
                      onChange={(e) => setSettings({ ...settings, smtp_username: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe SMTP</label>
                    <input
                      type="password"
                      value={settings.smtp_password || ''}
                      onChange={(e) => setSettings({ ...settings, smtp_password: e.target.value })}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.smtp_use_tls ?? true}
                    onChange={(e) => setSettings({ ...settings, smtp_use_tls: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Utiliser TLS</span>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email expéditeur</label>
                    <input
                      type="email"
                      value={settings.smtp_from_email || ''}
                      onChange={(e) => setSettings({ ...settings, smtp_from_email: e.target.value })}
                      placeholder="noreply@example.com"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nom de l'expéditeur</label>
                    <input
                      type="text"
                      value={settings.smtp_from_name || ''}
                      onChange={(e) => setSettings({ ...settings, smtp_from_name: e.target.value })}
                      placeholder="CRM System"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleTestEmail}
                  disabled={testingEmail}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90 transition-all disabled:opacity-50 font-medium"
                >
                  {testingEmail ? '⏳ Test en cours...' : '✉️ Tester la configuration email'}
                </button>
              </div>
            )}

            {/* Onglet Fonctionnalités */}
            {activeTab === 'features' && (
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.enable_audit_log ?? true}
                    onChange={(e) => setSettings({ ...settings, enable_audit_log: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="text-gray-200 font-medium">Activer le journal d'audit</div>
                    <div className="text-sm text-gray-400">Enregistre toutes les actions importantes des utilisateurs</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.enable_email_notifications ?? true}
                    onChange={(e) => setSettings({ ...settings, enable_email_notifications: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="text-gray-200 font-medium">Activer les notifications email</div>
                    <div className="text-sm text-gray-400">Envoyer des emails de notification aux utilisateurs</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.enable_user_registration || false}
                    onChange={(e) => setSettings({ ...settings, enable_user_registration: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="text-gray-200 font-medium">Permettre l'inscription des utilisateurs</div>
                    <div className="text-sm text-gray-400">Les nouveaux utilisateurs peuvent créer un compte</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.enable_password_reset ?? true}
                    onChange={(e) => setSettings({ ...settings, enable_password_reset: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <div className="text-gray-200 font-medium">Permettre la réinitialisation du mot de passe</div>
                    <div className="text-sm text-gray-400">Les utilisateurs peuvent réinitialiser leur mot de passe par email</div>
                  </div>
                </label>

                <div className="border-t border-white/10 pt-6 mt-6">
                  <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                    <input
                      type="checkbox"
                      checked={settings.maintenance_mode || false}
                      onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                      className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <div className="text-gray-200 font-medium">Mode maintenance</div>
                      <div className="text-sm text-gray-400">Désactive temporairement l'accès au système</div>
                    </div>
                  </label>

                  {settings.maintenance_mode && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Message de maintenance</label>
                      <textarea
                        value={settings.maintenance_message || ''}
                        onChange={(e) => setSettings({ ...settings, maintenance_message: e.target.value })}
                        placeholder="Le système est en maintenance. Veuillez réessayer plus tard."
                        rows={3}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
