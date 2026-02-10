#!/bin/bash
# Script pour initialiser complètement le système avec rôles, permissions et Super Admin

set -e  # Arrêter en cas d'erreur

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 INITIALISATION COMPLÈTE DU SYSTÈME"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Vérifier que DATABASE_URL est défini
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL n'est pas défini"
    exit 1
fi

# Étape 1 : Créer les rôles et permissions
echo "📋 Étape 1/2 : Création des rôles et permissions..."
python -m scripts.init_roles

if [ $? -eq 0 ]; then
    echo "✅ Rôles et permissions créés"
    echo ""
else
    echo "❌ Erreur lors de la création des rôles"
    exit 1
fi

# Étape 2 : Créer le Super Admin
echo "👑 Étape 2/2 : Création du Super Admin..."
python -m scripts.create_super_admin

if [ $? -eq 0 ]; then
    echo "✅ Super Admin créé"
    echo ""
else
    echo "❌ Erreur lors de la création du Super Admin"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ INITIALISATION TERMINÉE AVEC SUCCÈS!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔐 Identifiants Super Admin:"
echo "   Email:    software@hcexecutive.net"
echo "   Password: SuperAdmin2024!"
echo ""
echo "⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!"
echo ""
