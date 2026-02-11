'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import API_URL from '@/config/api';

interface DashboardStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  new_users_last_month: number;
  total_roles: number;
  users_by_role: Record<string, number>;
  recent_users: Array<{
    id: string;
    email: string;
    username: string;
    full_name: string;
    created_at: string;
    is_active: boolean;
    roles: string[];
  }>;
  last_updated: string;
}

export default function DashboardPage() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardStats();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#1a0b2e] to-[#0a0a0f]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = [
    { 
      id: 'stat-1', 
      label: 'Utilisateurs actifs', 
      value: dashboardStats?.active_users.toString() || '0', 
      subtext: `${dashboardStats?.inactive_users || 0} inactifs`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-purple-600 to-pink-600' 
    },
    { 
      id: 'stat-2', 
      label: 'Total utilisateurs', 
      value: dashboardStats?.total_users.toString() || '0',
      subtext: `+${dashboardStats?.new_users_last_month || 0} ce mois`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-blue-600 to-cyan-600' 
    },
    { 
      id: 'stat-3', 
      label: 'Rôles configurés', 
      value: dashboardStats?.total_roles.toString() || '0', 
      subtext: 'rôles actifs',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-green-600 to-emerald-600' 
    },
    { 
      id: 'stat-4', 
      label: 'Clients actifs', 
      value: '0', 
      subtext: 'Bientôt disponible',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-orange-600 to-red-600' 
    },
  ];

  const menuItems = [
    { 
      id: 'menu-1', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      href: '/dashboard', 
      active: true 
    },
    { 
      id: 'menu-2', 
      label: 'Utilisateurs', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      href: '/dashboard/users', 
      admin: true 
    },
    { 
      id: 'menu-3', 
      label: 'Rôles & Permissions', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      href: '/dashboard/roles', 
      admin: true 
    },
    { 
      id: 'menu-4', 
      label: 'Logs & Audit', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: '/dashboard/audit', 
      admin: true 
    },
    { 
      id: 'menu-5', 
      label: 'Paramètres', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: '/dashboard/settings', 
      admin: true 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0b2e] to-[#0a0a0f]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 h-screen sticky top-0 glass-dark border-r border-white/10`}>
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center justify-between mb-8">
              {sidebarOpen && (
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CRM Pro
                </h1>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg glass hover:bg-white/10 transition-all"
              >
                <span className="text-xl">{sidebarOpen ? '◀' : '▶'}</span>
              </button>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    item.active
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="text-white/80 group-hover:text-white transition-colors">{item.icon}</div>
                  {sidebarOpen && (
                    <span className="text-white/90 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  )}
                </a>
              ))}
            </nav>

            {/* User Profile */}
            {sidebarOpen && (
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-dark rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => router.push('/dashboard/profile')}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mon Profil
                    </button>
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-sm rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Welcome Header */}
          <div className="mb-8 animate-fadeInUp">
            <h2 className="text-3xl font-bold text-white mb-2">
              Bienvenue, {user.first_name} ! 👋
            </h2>
            <p className="text-gray-400">
              Voici un aperçu de votre activité aujourd'hui
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fadeInUp delay-100">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="glass-dark rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  {statsLoading ? (
                    <div className="animate-pulse bg-gray-700 h-8 w-16 rounded"></div>
                  ) : (
                    stat.value
                  )}
                </h3>
                <p className="text-sm text-gray-400">{stat.label}</p>
                {stat.subtext && (
                  <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
                )}
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeInUp delay-200">
            {/* Recent Users */}
            <div className="glass-dark rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Utilisateurs récents
              </h3>
              <div className="space-y-3">
                {statsLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  </div>
                )}
                {!statsLoading && dashboardStats && dashboardStats.recent_users.length > 0 && (
                  <>
                    {dashboardStats.recent_users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            user.is_active ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-gray-600'
                          }`}>
                            {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{user.full_name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.roles.length > 0 && (
                            <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                              {user.roles[0]}
                            </span>
                          )}
                          <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-gray-400'}`} />
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {!statsLoading && (!dashboardStats || dashboardStats.recent_users.length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p>Aucun utilisateur pour le moment</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modules Status */}
            <div className="glass-dark rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Modules CRM
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white">Auth & Users</span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                    Actif
                  </span>
                </div>
                {[
                  { id: 'module-1', name: 'Gestion clients 360°' },
                  { id: 'module-2', name: 'KYC/AML' },
                  { id: 'module-3', name: 'Analytics' },
                  { id: 'module-4', name: 'Produits bancaires' }
                ].map((module) => (
                  <div
                    key={module.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-white/70">{module.name}</span>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
                      Bientôt
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
