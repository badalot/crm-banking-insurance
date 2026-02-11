'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
      });
    }
  }, [loading, isAuthenticated, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
        setIsEditing(false);
        // Refresh user data
        globalThis.location.reload();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.detail || 'Erreur lors de la mise à jour' });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#1a0b2e] to-[#0a0a0f]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0b2e] to-[#0a0a0f] p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mb-6 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-all text-white/90 hover:text-white flex items-center gap-2"
        >
          <span>←</span> Retour au dashboard
        </button>

        {/* Profile Header */}
        <div className="glass-dark rounded-2xl p-8 border border-white/10 mb-6 animate-fadeInUp">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-400">{user.email}</p>
              <div className="flex gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.is_active 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {user.is_active ? '✓ Actif' : '✗ Inactif'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.is_verified 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {user.is_verified ? '✓ Vérifié' : '⏳ En attente'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all hover:scale-105"
            >
              {isEditing ? 'Annuler' : 'Modifier le profil'}
            </button>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          } animate-fadeInUp`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="glass-dark rounded-2xl p-6 border border-white/10 animate-fadeInUp delay-100">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informations personnelles
            </h2>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-400 mb-2">
                    Prénom
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-400 mb-2">
                    Nom
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="block text-sm font-medium text-gray-400 mb-1">
                    Nom complet
                  </div>
                  <p className="text-white">{user.first_name} {user.last_name}</p>
                </div>
                <div>
                  <div className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </div>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <div className="block text-sm font-medium text-gray-400 mb-1">
                    Nom d&apos;utilisateur
                  </div>
                  <p className="text-white">{user.username}</p>
                </div>
                <div>
                  <div className="block text-sm font-medium text-gray-400 mb-1">
                    Téléphone
                  </div>
                  <p className="text-white">{user.phone || 'Non renseigné'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Account Details */}
          <div className="glass-dark rounded-2xl p-6 border border-white/10 animate-fadeInUp delay-200">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Sécurité du compte
            </h2>
            <div className="space-y-4">
              <div>
                <div className="block text-sm font-medium text-gray-400 mb-1">
                  Mot de passe
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-white">••••••••••</p>
                  <button
                    onClick={() => router.push('/dashboard/change-password')}
                    className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all text-sm"
                  >
                    Modifier
                  </button>
                </div>
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-400 mb-1">
                  Dernière connexion
                </div>
                <p className="text-white">
                  {user.last_login 
                    ? new Date(user.last_login).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Première connexion'}
                </p>
              </div>
              <div>
                <div className="block text-sm font-medium text-gray-400 mb-1">
                  Compte créé le
                </div>
                <p className="text-white">
                  {new Date(user.created_at).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-sm font-bold text-red-400 mb-3">Zone de danger</h3>
              <button className="w-full px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all">
                Désactiver mon compte
              </button>
            </div>
          </div>
        </div>

        {/* Roles & Permissions */}
        <div className="glass-dark rounded-2xl p-6 border border-white/10 mt-6 animate-fadeInUp delay-300">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Rôles et permissions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="block text-sm font-medium text-gray-400 mb-2">
                Rôles assignés
              </div>
              <div className="flex flex-wrap gap-2">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role: any) => (
                    <span
                      key={role.id}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    >
                      {role.name}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">Aucun rôle assigné</span>
                )}
              </div>
            </div>
            <div>
              <div className="block text-sm font-medium text-gray-400 mb-2">
                Permissions
              </div>
              <p className="text-gray-400 text-sm">
                Les permissions sont gérées via vos rôles assignés
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
