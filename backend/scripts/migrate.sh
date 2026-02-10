#!/bin/bash
# Script pour vérifier et appliquer les migrations Alembic

set -e  # Arrêter en cas d'erreur

echo "🔍 Vérification de la base de données..."

# Vérifier que DATABASE_URL est défini
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL n'est pas défini"
    exit 1
fi

echo "✅ DATABASE_URL défini"

# Vérifier la connexion à la base de données
echo "🔌 Test de connexion..."
python -c "
from app.core.database import engine
from sqlalchemy import text
try:
    with engine.connect() as conn:
        conn.execute(text('SELECT 1'))
    print('✅ Connexion à la base de données réussie')
except Exception as e:
    print(f'❌ Erreur de connexion: {e}')
    exit(1)
"

# Appliquer les migrations
echo "📦 Application des migrations Alembic..."
alembic upgrade head

if [ $? -eq 0 ]; then
    echo "✅ Migrations appliquées avec succès"
else
    echo "❌ Erreur lors de l'application des migrations"
    exit 1
fi

# Initialiser les rôles et permissions
echo "👥 Initialisation des rôles et permissions..."
python -m scripts.init_roles

if [ $? -eq 0 ]; then
    echo "✅ Rôles et permissions initialisés"
else
    echo "⚠️  Avertissement: Les rôles existent peut-être déjà"
fi

echo "🎉 Configuration de la base de données terminée!"
