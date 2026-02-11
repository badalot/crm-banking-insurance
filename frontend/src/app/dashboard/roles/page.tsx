'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import API_URL from '@/config/api';

interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

interface RoleFormData {
  name: string;
  description: string;
  permission_ids: string[];
}

export default function RolesPage() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    description: '',
    permission_ids: [],
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRoles();
      fetchPermissions();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const filtered = roles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoles(filtered);
  }, [searchTerm, roles]);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data);
        setFilteredRoles(data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/permissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPermissions(data);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      permission_ids: [],
    });
    setMessage({ type: '', text: '' });
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permission_ids: role.permissions.map(p => p.id),
    });
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const togglePermission = useCallback((permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter(id => id !== permissionId)
        : [...prev.permission_ids, permissionId]
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');

      if (selectedRole) {
        // Update existing role
        const updateResponse = await fetch(`${API_URL}/roles/${selectedRole.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
          }),
        });

        if (updateResponse.ok) {
          // Update permissions
          await fetch(`${API_URL}/roles/${selectedRole.id}/permissions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              permission_ids: formData.permission_ids,
            }),
          });

          setMessage({ type: 'success', text: 'Rôle modifié avec succès !' });
          setTimeout(() => {
            handleCloseModal();
            fetchRoles();
          }, 1500);
        } else {
          const error = await updateResponse.json();
          setMessage({ type: 'error', text: error.detail || 'Erreur lors de la modification' });
        }
      } else {
        // Create new role
        const createResponse = await fetch(`${API_URL}/roles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            permission_ids: formData.permission_ids,
          }),
        });

        if (createResponse.ok) {
          setMessage({ type: 'success', text: 'Rôle créé avec succès !' });
          setTimeout(() => {
            handleCloseModal();
            fetchRoles();
          }, 1500);
        } else {
          const error = await createResponse.json();
          setMessage({ type: 'error', text: error.detail || 'Erreur lors de la création' });
        }
      }
    } catch (error) {
      console.error('Error saving role:', error);
      setMessage({ type: 'error', text: 'Erreur réseau' });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRole = async (roleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Rôle supprimé avec succès' });
        fetchRoles();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      setMessage({ type: 'error', text: 'Erreur réseau' });
    }
  };

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  // Get submit button text
  const getSubmitButtonText = () => {
    if (isSaving) return 'Enregistrement...';
    return selectedRole ? 'Modifier' : 'Créer';
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Gestion des Rôles & Permissions
          </h1>
          <p className="text-gray-400">Gérez les rôles et leurs permissions</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl glass border ${
            message.type === 'success' 
              ? 'border-green-500/50 bg-green-500/10' 
              : 'border-red-500/50 bg-red-500/10'
          }`}>
            <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Actions Bar */}
        <div className="glass-dark rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 w-full md:w-auto">
              <input
                type="text"
                placeholder="Rechercher un rôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/50 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau Rôle
            </button>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <div key={role.id} className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{role.name}</h3>
                  <p className="text-gray-400 text-sm">{role.description || 'Aucune description'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditRole(role)}
                    className="p-2 rounded-lg glass hover:bg-white/10 transition-all text-blue-400 hover:text-blue-300"
                    title="Modifier"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteRole(role.id)}
                    className="p-2 rounded-lg glass hover:bg-white/10 transition-all text-red-400 hover:text-red-300"
                    title="Supprimer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Permissions:</span>
                  <span className="text-purple-400 font-semibold">{role.permissions.length}</span>
                </div>
                
                {role.permissions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {role.permissions.slice(0, 5).map((perm) => (
                      <span
                        key={perm.id}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs border border-purple-500/30"
                      >
                        {perm.resource}.{perm.action}
                      </span>
                    ))}
                    {role.permissions.length > 5 && (
                      <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-lg text-xs border border-gray-500/30">
                        +{role.permissions.length - 5} autres
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-12 glass-dark rounded-2xl border border-white/10">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-gray-400 text-lg">Aucun rôle trouvé</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || selectedRole) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-dark rounded-2xl p-8 border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {selectedRole ? 'Modifier le rôle' : 'Nouveau rôle'}
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

            {message.text && (
              <div className={`mb-6 p-4 rounded-xl glass border ${
                message.type === 'success' 
                  ? 'border-green-500/50 bg-green-500/10' 
                  : 'border-red-500/50 bg-red-500/10'
              }`}>
                <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                  {message.text}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="role-name" className="block text-sm font-medium text-gray-300 mb-2">
                    Nom du rôle *
                  </label>
                  <input
                    id="role-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                    placeholder="Ex: Manager Commercial"
                  />
                </div>

                <div>
                  <label htmlFor="role-description" className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    id="role-description"
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                    placeholder="Description du rôle"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Permissions ({formData.permission_ids.length} sélectionnée{formData.permission_ids.length === 1 ? '' : 's'})
                </label>
                
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([resource, perms]) => (
                    <div key={resource} className="glass rounded-xl p-4 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-3 capitalize">{resource}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {perms.map((perm) => (
                          <button
                            key={perm.id}
                            type="button"
                            onClick={() => togglePermission(perm.id)}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              formData.permission_ids.includes(perm.id)
                                ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                : 'border-white/10 bg-white/5 text-gray-400 hover:border-purple-500/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                formData.permission_ids.includes(perm.id)
                                  ? 'border-purple-500 bg-purple-500'
                                  : 'border-gray-400'
                              }`}>
                                {formData.permission_ids.includes(perm.id) && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="font-medium text-sm">{perm.action}</span>
                            </div>
                            {perm.description && (
                              <p className="text-xs mt-1 text-gray-400">{perm.description}</p>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {permissions.length === 0 && (
                  <p className="text-yellow-400 text-sm">⚠️ Aucune permission disponible</p>
                )}
              </div>

              <div className="flex gap-4 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-white/5 rounded-xl text-white font-semibold hover:bg-white/10 transition-all border border-white/10"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {getSubmitButtonText()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
