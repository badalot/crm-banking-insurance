'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import API_URL from '@/config/api';

interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  roles: Array<{ id: string; name: string }>;
}

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface UserFormData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  password?: string;
  role_ids: string[];
}

export default function UsersPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    role_ids: [],
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchRoles();
    }
  }, [user]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterStatus]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        email: selectedUser.email,
        username: selectedUser.username,
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        phone: selectedUser.phone || '',
        role_ids: selectedUser.roles.map(r => r.id),
      });
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching roles from:', `${API_URL}/roles`);
      const response = await fetch(`${API_URL}/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Roles response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Roles fetched:', data);
        setRoles(data);
      } else {
        const error = await response.json();
        console.error('Roles fetch error:', error);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.last_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(u => 
        filterStatus === 'active' ? u.is_active : !u.is_active
      );
    }

    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      
      // Si actif, on désactive (DELETE), sinon on réactive (POST /activate)
      const url = currentStatus 
        ? `${API_URL}/users/${userId}` 
        : `${API_URL}/users/${userId}/activate`;
      
      const method = currentStatus ? 'DELETE' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchUsers();
        setMessage({ 
          type: 'success', 
          text: currentStatus ? 'Utilisateur désactivé avec succès' : 'Utilisateur réactivé avec succès' 
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la modification du statut' });
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      setMessage({ type: 'error', text: 'Erreur réseau' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      
      if (selectedUser) {
        // Update user
        const updateResponse = await fetch(`${API_URL}/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
          }),
        });

        if (!updateResponse.ok) {
          const error = await updateResponse.json();
          throw new Error(error.detail || 'Erreur lors de la mise à jour');
        }

        // Assign roles
        const rolesResponse = await fetch(`${API_URL}/users/${selectedUser.id}/roles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ role_ids: formData.role_ids }),
        });

        if (!rolesResponse.ok) {
          const error = await rolesResponse.json();
          throw new Error(error.detail || 'Erreur lors de l\'assignation des rôles');
        }

        setMessage({ type: 'success', text: 'Utilisateur modifié avec succès !' });
      } else {
        // Create user
        const createResponse = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            password: formData.password,
          }),
        });

        if (!createResponse.ok) {
          const error = await createResponse.json();
          throw new Error(error.detail || 'Erreur lors de la création');
        }

        const newUser = await createResponse.json();
        console.log('User created:', newUser);
        console.log('Assigning roles:', formData.role_ids);

        // Assign roles
        const rolesResponse = await fetch(`${API_URL}/users/${newUser.id}/roles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ role_ids: formData.role_ids }),
        });

        console.log('Roles response status:', rolesResponse.status);

        if (!rolesResponse.ok) {
          const error = await rolesResponse.json();
          console.error('Roles assignment error:', error);
          throw new Error(error.detail || 'Erreur lors de l\'assignation des rôles');
        }

        const updatedUser = await rolesResponse.json();
        console.log('User with roles:', updatedUser);

        setMessage({ type: 'success', text: 'Utilisateur créé avec succès !' });
      }

      fetchUsers();
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error: any) {
      console.error('Error saving user:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur de connexion au serveur' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedUser(null);
    setMessage({ type: '', text: '' });
    setFormData({
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      phone: '',
      password: '',
      role_ids: [],
    });
  };

  const toggleRole = useCallback((roleId: string) => {
    setFormData(prev => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter(id => id !== roleId)
        : [...prev.role_ids, roleId]
    }));
  }, []);

  const handleInputChange = useCallback((field: keyof UserFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

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

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fadeInUp">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="mb-4 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-all text-white/90 hover:text-white flex items-center gap-2"
            >
              <span>←</span> Retour au dashboard
            </button>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Gestion des utilisateurs
            </h1>
            <p className="text-gray-400">
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvel utilisateur
          </button>
        </div>

        {/* Filters */}
        <div className="glass-dark rounded-2xl p-6 border border-white/10 mb-6 animate-fadeInUp delay-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Email, nom, prénom..."
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-2">
                Statut
              </label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-all"
              >
                <option value="all">Tous les utilisateurs</option>
                <option value="active">Actifs uniquement</option>
                <option value="inactive">Inactifs uniquement</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-dark rounded-2xl border border-white/10 overflow-hidden animate-fadeInUp delay-200">
          {isLoading && (
            <div className="p-12 text-center text-gray-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              Chargement des utilisateurs...
            </div>
          )}
          
          {!isLoading && filteredUsers.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>Aucun utilisateur trouvé</p>
            </div>
          )}
          
          {!isLoading && filteredUsers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Utilisateur</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Email</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Rôles</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Statut</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-400">Créé le</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                            {u.first_name?.[0]}{u.last_name?.[0]}
                          </div>
                          <div>
                            <p className="text-white font-medium">{u.first_name} {u.last_name}</p>
                            <p className="text-sm text-gray-400">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white">{u.email}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((role) => (
                            <span
                              key={role.id}
                              className="px-2 py-1 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            >
                              {role.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.is_active 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {u.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {new Date(u.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-2 rounded-lg glass hover:bg-white/10 transition-all text-blue-400 hover:text-blue-300"
                            title="Modifier"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => toggleUserStatus(u.id, u.is_active)}
                            className={`p-2 rounded-lg glass hover:bg-white/10 transition-all ${
                              u.is_active ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'
                            }`}
                            title={u.is_active ? 'Désactiver' : 'Activer'}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {u.is_active ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              )}
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || selectedUser) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-dark rounded-2xl p-8 border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {selectedUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg glass hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                title="Fermer"
                aria-label="Fermer la fenêtre"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl border ${
                message.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-400 mb-2">
                    Prénom *
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    value={formData.first_name}
                    onChange={handleInputChange('first_name')}
                    className="w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-400 mb-2">
                    Nom *
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    value={formData.last_name}
                    onChange={handleInputChange('last_name')}
                    className="w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Username & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
                    Nom d&apos;utilisateur *
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    className="w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-all"
                    required
                    disabled={!!selectedUser}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className="w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Phone & Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    className="w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                {!selectedUser && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                      Mot de passe *
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      className="w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 text-white focus:border-purple-500 focus:outline-none transition-all"
                      required={!selectedUser}
                      minLength={8}
                      placeholder="Minimum 8 caractères"
                    />
                  </div>
                )}
              </div>

              {/* Roles */}
              <div>
                <div className="block text-sm font-medium text-gray-400 mb-3">
                  Rôles * {roles.length === 0 && <span className="text-red-400 text-xs">(Aucun rôle disponible)</span>}
                </div>
                {roles.length === 0 ? (
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm">
                    ⚠️ Aucun rôle disponible. Vérifiez que l&apos;API des rôles fonctionne correctement.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => toggleRole(role.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.role_ids.includes(role.id)
                            ? 'bg-purple-500/20 border-purple-500/50 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-purple-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{role.name}</p>
                            {role.description && (
                              <p className="text-xs mt-1 opacity-75">{role.description}</p>
                            )}
                          </div>
                          {formData.role_ids.includes(role.id) && (
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {formData.role_ids.length === 0 && roles.length > 0 && (
                  <p className="text-sm text-red-400 mt-2">Veuillez sélectionner au moins un rôle</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving || formData.role_ids.length === 0}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {(() => {
                    if (isSaving) return 'Enregistrement...';
                    if (selectedUser) return 'Modifier';
                    return 'Créer';
                  })()}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 rounded-xl bg-gray-500/20 text-white hover:bg-gray-500/30 transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
