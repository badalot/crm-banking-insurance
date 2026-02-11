'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

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
    { id: 'stat-1', label: 'Clients actifs', value: '0', icon: '👥', color: 'from-purple-600 to-pink-600' },
    { id: 'stat-2', label: 'Dossiers KYC', value: '0', icon: '📋', color: 'from-blue-600 to-cyan-600' },
    { id: 'stat-3', label: 'Tâches en cours', value: '0', icon: '✓', color: 'from-green-600 to-emerald-600' },
    { id: 'stat-4', label: 'Alertes', value: '0', icon: '⚠️', color: 'from-orange-600 to-red-600' },
  ];

  const quickActions = [
    { id: 'action-1', label: 'Nouveau client', icon: '➕', href: '#' },
    { id: 'action-2', label: 'KYC Check', icon: '🔍', href: '#' },
    { id: 'action-3', label: 'Rapport', icon: '📊', href: '#' },
    { id: 'action-4', label: 'Paramètres', icon: '⚙️', href: '/dashboard/profile' },
  ];

  const menuItems = [
    { id: 'menu-1', label: 'Dashboard', icon: '📊', href: '/dashboard', active: true },
    { id: 'menu-2', label: 'Clients', icon: '👥', href: '#', badge: 'Bientôt' },
    { id: 'menu-3', label: 'KYC/AML', icon: '🔒', href: '#', badge: 'Bientôt' },
    { id: 'menu-4', label: 'Produits', icon: '💼', href: '#', badge: 'Bientôt' },
    { id: 'menu-5', label: 'Analytics', icon: '📈', href: '#', badge: 'Bientôt' },
    { id: 'menu-6', label: 'Utilisateurs', icon: '👤', href: '#', admin: true },
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
                  <span className="text-2xl">{item.icon}</span>
                  {sidebarOpen && (
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-white/90 group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </a>
              ))}
            </nav>

            {/* User Profile */}
            {sidebarOpen && (
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-dark rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
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
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-sm rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    Déconnexion
                  </button>
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
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-lg bg-green-500/10 text-green-400">
                    +0%
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8 animate-fadeInUp delay-200">
            <h3 className="text-xl font-bold text-white mb-4">Actions rapides</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <a
                  key={action.id}
                  href={action.href}
                  className="glass-dark rounded-xl p-6 border border-white/10 hover:border-purple-500/50 hover:scale-105 transition-all duration-300 text-center group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <p className="text-sm text-white/90">{action.label}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeInUp delay-300">
            {/* Recent Activity */}
            <div className="glass-dark rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📊</span> Activité récente
              </h3>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-400">
                  <p className="text-4xl mb-2">🎯</p>
                  <p>Aucune activité pour le moment</p>
                  <p className="text-sm mt-2">Commencez par ajouter un client</p>
                </div>
              </div>
            </div>

            {/* Modules Status */}
            <div className="glass-dark rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🚀</span> Modules CRM
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
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
                      <span className="text-2xl">⏳</span>
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
