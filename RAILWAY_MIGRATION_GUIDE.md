# 🚀 Gestion des Migrations sur Railway

## ⚠️ Important : Railway N'exécute PAS les migrations automatiquement

Railway va uniquement :
1. ✅ Installer les dépendances (`pip install -r requirements.txt`)
2. ✅ Exécuter le script de démarrage (`start.sh`)

Il **NE va PAS** automatiquement :
- ❌ Exécuter `alembic upgrade head`
- ❌ Lancer `python -m scripts.init_roles`

## ✅ Solution Mise en Place

### Approche 1 : Migration Automatique au Démarrage (ACTUEL)

Le fichier `start.sh` a été modifié pour :

```bash
#!/bin/bash
# 1. Installer les dépendances
pip install -r requirements.txt

# 2. Appliquer les migrations (NOUVEAU)
alembic upgrade head

# 3. Initialiser les rôles (NOUVEAU)
python -m scripts.init_roles

# 4. Démarrer l'app
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

**Avantages** :
- ✅ Automatique à chaque déploiement
- ✅ Pas besoin d'action manuelle
- ✅ Les migrations sont toujours à jour

**Inconvénients** :
- ⚠️ Légèrement plus long au démarrage (2-5 secondes)
- ⚠️ Si la migration échoue, l'app ne démarre pas

### Approche 2 : Migration Manuelle (Alternative)

Si tu préfères gérer les migrations manuellement :

1. **Sur Railway Dashboard** :
   - Aller dans l'onglet "Settings"
   - Cliquer sur "Deploy" 
   - Attendre que le déploiement se termine

2. **Ouvrir le Terminal Railway** :
   ```bash
   # Se connecter au terminal Railway
   railway run bash
   
   # Exécuter les migrations
   alembic upgrade head
   python -m scripts.init_roles
   ```

## 📋 Processus de Déploiement

### Avec Migration Automatique (Configuration Actuelle)

```bash
# 1. Commit et push
git add .
git commit -m "feat: Auth & Users module with auto-migration"
git push origin main

# 2. Railway détecte le push et :
#    - Build l'image
#    - Installe les dépendances
#    - Lance start.sh qui fait :
#      ✅ alembic upgrade head
#      ✅ python -m scripts.init_roles
#      ✅ démarre l'app

# 3. C'est tout ! ✨
```

### Première Vérification

Une fois déployé, vérifie que tout fonctionne :

```bash
# Test de l'API
curl https://crm-banking-insurance-production.up.railway.app/health

# Devrait retourner :
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected"
}

# Test des endpoints auth
curl https://crm-banking-insurance-production.up.railway.app/api/v1/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123!",
    "first_name": "Test",
    "last_name": "User"
  }'
```

## 🔧 Script de Migration Manuel

Si besoin, tu peux aussi exécuter manuellement :

```bash
cd backend
./scripts/migrate.sh
```

Ce script :
1. Vérifie DATABASE_URL
2. Teste la connexion
3. Applique les migrations
4. Initialise les rôles

## 🐛 Dépannage

### Si la migration échoue au démarrage

**Option 1 : Vérifier les logs Railway**
```
Railway Dashboard → Deployments → View Logs
```

**Option 2 : Revenir à la migration manuelle**

Modifier `start.sh` pour retirer les migrations :
```bash
#!/bin/bash
pip install -r requirements.txt
# alembic upgrade head  # Commenté
# python -m scripts.init_roles  # Commenté
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

Puis exécuter manuellement via Railway CLI :
```bash
railway run bash
alembic upgrade head
python -m scripts.init_roles
```

## 📊 État Actuel

- ✅ `start.sh` modifié avec migrations automatiques
- ✅ `scripts/migrate.sh` créé pour migration manuelle
- ✅ Scripts rendus exécutables (chmod +x)
- ⏳ Prêt à commit et push

## 🎯 Recommandation

**Pour ce projet, j'ai configuré la migration automatique** car :
- ✅ Simple et automatique
- ✅ Pas besoin d'accès Railway à chaque déploiement
- ✅ Les migrations sont idempotentes (peuvent être relancées)
- ✅ `init_roles.py` vérifie si les rôles existent déjà

Tu veux qu'on commit et push maintenant pour tester sur Railway ?
