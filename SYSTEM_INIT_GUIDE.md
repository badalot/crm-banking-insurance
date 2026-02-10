# 🚀 Guide d'Initialisation du Système

## 📋 Ce qui va être créé

### 1. Rôles (5)
- **Super Admin** - Accès complet à tout
- **Admin** - Gestion utilisateurs + clients
- **Manager** - Gestion équipe + rapports
- **Agent** - Gestion clients assignés
- **Viewer** - Lecture seule

### 2. Permissions (13)
- `users.create`, `users.read`, `users.update`, `users.delete`
- `clients.create`, `clients.read`, `clients.update`, `clients.delete`
- `reports.create`, `reports.read`, `reports.export`
- `system.settings`, `system.logs`

### 3. Super Admin
- **Email**: software@hcexecutive.net
- **Username**: superadmin
- **Password**: SuperAdmin2024!
- **Rôle**: Super Admin
- **Statut**: Actif et vérifié

---

## 🔧 Comment Exécuter

### Option 1 : Sur Railway (Production)

1. **Via Railway Dashboard** :
   - Va dans ton projet → Service backend
   - Clique sur l'onglet **"Settings"**
   - Scroll jusqu'à **"Deploy"**
   - Dans la section "Custom Start Command", tu peux voir le script actuel

2. **Via Railway CLI** (recommandé) :
   ```bash
   # Se connecter à Railway
   railway link
   
   # Ouvrir un shell dans le container
   railway run bash
   
   # Exécuter le script d'initialisation
   bash scripts/setup_system.sh
   ```

3. **Via Railway Exec** (si CLI installé) :
   ```bash
   railway run python -m scripts.init_roles
   railway run python -m scripts.create_super_admin
   ```

### Option 2 : Localement (avec connexion à Railway DB)

```bash
cd backend

# Activer l'environnement virtuel
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Exporter l'URL de la base Railway
export DATABASE_URL="postgresql://user:pass@host:port/db"

# Exécuter le script
bash scripts/setup_system.sh
```

### Option 3 : Script par script

```bash
# 1. Créer les rôles et permissions
python -m scripts.init_roles

# 2. Créer le Super Admin
python -m scripts.create_super_admin
```

---

## ✅ Vérification

Après l'exécution, vérifie que tout est créé :

```bash
# Test 1: Login du Super Admin
curl -X POST "https://crm-banking-insurance-production.up.railway.app/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "software@hcexecutive.net",
    "password": "SuperAdmin2024!"
  }'
```

Tu devrais recevoir :
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "email": "software@hcexecutive.net",
    "username": "superadmin",
    "roles": [
      {
        "name": "Super Admin",
        "description": "Accès complet à toutes les fonctionnalités"
      }
    ]
  }
}
```

---

## 🔐 Sécurité Post-Installation

### 1. Changer le mot de passe du Super Admin

Via l'API :
```bash
# D'abord se connecter pour avoir le token
TOKEN="votre_token_jwt"

# Changer le mot de passe
curl -X PUT "https://crm-banking-insurance-production.up.railway.app/api/v1/users/{user_id}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "VotreNouveauMotDePasseSecurise123!"
  }'
```

### 2. Créer d'autres administrateurs

Une fois connecté en tant que Super Admin, tu pourras :
- Créer d'autres utilisateurs via l'interface
- Leur assigner des rôles (Admin, Manager, etc.)
- Gérer les permissions

---

## 🚨 Important

- ⚠️ **Ne JAMAIS** commit les identifiants en clair dans Git
- ⚠️ **Changez** le mot de passe par défaut immédiatement après la première connexion
- ⚠️ **Sauvegardez** les identifiants du Super Admin dans un gestionnaire de mots de passe
- ⚠️ Ce script est **idempotent** : tu peux le relancer sans problème, il vérifie si les données existent déjà

---

## 🎯 Prochaines Étapes

1. ✅ Initialiser le système (ce guide)
2. 🔜 Se connecter avec le Super Admin
3. 🔜 Changer le mot de passe par défaut
4. 🔜 Créer d'autres utilisateurs administrateurs
5. 🔜 Commencer à utiliser le CRM !
