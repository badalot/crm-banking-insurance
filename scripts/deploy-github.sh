#!/bin/bash

# Script pour créer le repo GitHub et pousser le code
# Usage: ./scripts/deploy-github.sh

set -e

echo "🚀 NSIA CRM - Déploiement GitHub"
echo "================================"
echo ""

# Vérifier qu'on est à la racine du projet
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Erreur: Exécutez ce script depuis la racine du projet"
    exit 1
fi

# Demander le nom d'utilisateur GitHub
read -p "Entrez votre nom d'utilisateur GitHub: " github_username
read -p "Entrez le nom du repo (par défaut: nsia-crm): " repo_name
repo_name=${repo_name:-nsia-crm}

echo ""
echo "📝 Configuration Git..."

# Vérifier si git est initialisé
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git initialisé"
fi

# Ajouter tous les fichiers
git add .

# Commit
if git diff-index --quiet HEAD --; then
    echo "Aucun changement à commiter"
else
    git commit -m "Initial commit - NSIA CRM setup" || true
    echo "✅ Commit créé"
fi

# Configurer la branche main
git branch -M main

# Ajouter le remote
remote_url="https://github.com/$github_username/$repo_name.git"
if git remote | grep -q "origin"; then
    git remote set-url origin $remote_url
else
    git remote add origin $remote_url
fi

echo ""
echo "📤 Instructions pour créer le repo sur GitHub:"
echo ""
echo "1. Allez sur https://github.com/new"
echo "2. Nom du repo: $repo_name"
echo "3. Description: CRM Bancaire & Assurance pour NSIA"
echo "4. Repo: Private (recommandé)"
echo "5. NE PAS initialiser avec README, .gitignore ou license"
echo "6. Cliquez sur 'Create repository'"
echo ""
read -p "Appuyez sur Entrée une fois le repo créé sur GitHub..."

echo ""
echo "📤 Push vers GitHub..."
git push -u origin main

echo ""
echo "✅ Code poussé sur GitHub!"
echo ""
echo "🔗 Repo URL: https://github.com/$github_username/$repo_name"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Déployer le backend sur Railway"
echo "2. Déployer le frontend sur Vercel"
echo ""
echo "Consultez DEPLOYMENT.md pour les instructions détaillées"
