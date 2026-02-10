#!/bin/bash

# Script de setup initial pour NSIA CRM
# Usage: ./scripts/setup.sh

set -e

echo "🚀 NSIA CRM - Setup Initial"
echo "================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier qu'on est à la racine du projet
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Erreur: Exécutez ce script depuis la racine du projet"
    exit 1
fi

# 1. Setup Backend
echo -e "${BLUE}📦 Setup Backend${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo "Création de l'environnement virtuel Python..."
    python3 -m venv venv
fi

echo "Activation de l'environnement virtuel..."
source venv/bin/activate

echo "Installation des dépendances Python..."
pip install --upgrade pip
pip install -r requirements.txt

if [ ! -f ".env" ]; then
    echo "Création du fichier .env..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  N'oubliez pas de modifier backend/.env avec vos valeurs${NC}"
fi

cd ..

# 2. Setup Frontend
echo ""
echo -e "${BLUE}📦 Setup Frontend${NC}"
cd frontend

echo "Installation des dépendances Node.js..."
npm install

if [ ! -f ".env.local" ]; then
    echo "Création du fichier .env.local..."
    cp .env.local.example .env.local
fi

cd ..

# 3. Setup Docker
echo ""
echo -e "${BLUE}🐳 Démarrage des services Docker${NC}"
echo "Démarrage de PostgreSQL et Redis..."
docker-compose up -d

echo ""
echo -e "${GREEN}✅ Setup terminé!${NC}"
echo ""
echo "📝 Prochaines étapes:"
echo ""
echo "1. Backend (Terminal 1):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload"
echo ""
echo "2. Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Ouvrir dans le navigateur:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000/docs"
echo ""
echo "🚀 Bon développement!"
