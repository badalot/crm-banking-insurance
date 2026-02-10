'use client'

import { useEffect, useState } from 'react'

interface ApiStatus {
  status: string
  message?: string
  version?: string
  environment?: string
}

export default function Home() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    fetch(`${apiUrl}/`)
      .then(res => res.json())
      .then(data => {
        setApiStatus({ status: 'connected', ...data })
        setLoading(false)
      })
      .catch(err => {
        setApiStatus({ status: 'error', message: err.message })
        setLoading(false)
      })
  }, [])

  const getStatusColor = (isConnected: boolean, isLoading: boolean) => {
    if (isLoading) return { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' }
    if (isConnected) return { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' }
    return { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' }
  }

  const backendStatus = getStatusColor(apiStatus?.status === 'connected', loading)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Banking & Insurance CRM
          </h1>
          <p className="text-lg text-gray-600">
            Solution professionnelle pour la gestion de la relation client
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            État du Système
          </h2>
          
          <div className="space-y-4">
            {/* Frontend Status */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Frontend</span>
              </div>
              <span className="text-green-700 font-semibold">✓ Actif</span>
            </div>

            {/* Backend Status */}
            <div className={`flex items-center justify-between p-4 rounded-lg border ${backendStatus.bg} border-${backendStatus.dot.replace('bg-', '')}-200`}>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${backendStatus.dot} ${loading ? 'animate-pulse' : ''}`}></div>
                <span className="font-medium text-gray-900">Backend API</span>
              </div>
              <span className={`font-semibold ${backendStatus.text}`}>
                {loading ? '⟳ Connexion...' : 
                 apiStatus?.status === 'connected' ? '✓ Actif' : '✗ Erreur'}
              </span>
            </div>
          </div>

          {/* API Info */}
          {apiStatus?.status === 'connected' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">Informations API</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Version:</span> {apiStatus.version}</p>
                <p><span className="font-medium">Environnement:</span> {apiStatus.environment}</p>
                <p><span className="font-medium">URL:</span> {apiUrl}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/docs"
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all text-center"
          >
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Documentation</h3>
            <p className="text-gray-600 text-sm">Guide d&apos;utilisation</p>
          </a>
          
          <a
            href={`${apiUrl}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all text-center"
          >
            <div className="text-3xl mb-3">🔌</div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">API Docs</h3>
            <p className="text-gray-600 text-sm">Swagger UI</p>
          </a>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-center opacity-60">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Dashboard</h3>
            <p className="text-gray-600 text-sm">Bientôt disponible</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-12">
          <p>CRM v1.0.0 - Déploiement Initial</p>
        </div>
      </div>
    </main>
  )
}
