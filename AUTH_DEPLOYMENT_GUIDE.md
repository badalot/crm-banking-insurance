# Module Auth & Users - Guide de Déploiement

## ✅ Fichiers Créés

### Backend
1. **Models** (`backend/app/models/`)
   - `user.py` - User, Role, Permission models avec relations Many-to-Many

2. **Schemas** (`backend/app/schemas/`)
   - `user.py` - Pydantic schemas pour validation (UserCreate, UserResponse, Token, etc.)

3. **Services** (`backend/app/services/`)
   - `user_service.py` - Logique métier pour la gestion des utilisateurs

4. **Security** (`backend/app/core/`)
   - `security.py` - Password hashing, JWT token creation/validation
   - `deps.py` - FastAPI dependencies (get_current_user, has_permission)

5. **API Routes** (`backend/app/api/v1/`)
   - `auth.py` - Routes d'authentification (register, login, logout, me)
   - `users.py` - Routes CRUD utilisateurs avec RBAC

6. **Database**
   - `alembic/versions/001_initial_auth_users.py` - Migration pour tables auth
   - `scripts/init_roles.py` - Script d'initialisation des rôles et permissions

7. **Configuration**
   - `app/main.py` - Mis à jour avec les routes API

## 📋 Étapes de Déploiement

### 1. Installer les dépendances (si nécessaire)
```bash
cd backend
pip install -r requirements.txt
```

### 2. Appliquer la migration
```bash
# Depuis le dossier backend
export DATABASE_URL="votre_url_postgresql"
alembic upgrade head
```

### 3. Initialiser les rôles et permissions
```bash
python -m scripts.init_roles
```

### 4. Tester localement
```bash
uvicorn app.main:app --reload
```

Accédez à http://localhost:8000/docs pour voir la documentation Swagger.

### 5. Commit et Push
```bash
git add .
git commit -m "feat: implement Auth & Users module with RBAC"
git push origin main
```

Railway va automatiquement:
1. Détecter le push
2. Installer les dépendances
3. Redémarrer l'application

### 6. Exécuter la migration sur Railway
Une fois le déploiement terminé, exécutez dans le terminal Railway:
```bash
alembic upgrade head
python -m scripts.init_roles
```

## 🔐 Endpoints Disponibles

### Authentication (`/api/v1/auth`)
- `POST /register` - Créer un nouveau compte
- `POST /login` - Se connecter (retourne JWT token)
- `POST /logout` - Se déconnecter
- `GET /me` - Obtenir les infos de l'utilisateur connecté

### Users (`/api/v1/users`)
- `GET /` - Lister tous les utilisateurs (permission: users.read)
- `GET /{user_id}` - Obtenir un utilisateur (permission: users.read)
- `PUT /{user_id}` - Mettre à jour un utilisateur (permission: users.update)
- `DELETE /{user_id}` - Désactiver un utilisateur (permission: users.delete)

## 👥 Rôles Par Défaut

1. **Super Admin** - Accès complet
2. **Admin** - Gestion utilisateurs + clients
3. **Manager** - Gestion agence + rapports
4. **Agent** - Gestion clients assignés
5. **Viewer** - Lecture seule

## 🔑 Permissions

- `users.*` - Gestion utilisateurs
- `clients.*` - Gestion clients
- `reports.*` - Gestion rapports
- `system.*` - Paramètres système

## 🧪 Test de l'API

### 1. Créer un compte
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "Admin123!",
    "first_name": "Admin",
    "last_name": "User"
  }'
```

### 2. Se connecter
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

Réponse:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {...}
}
```

### 3. Accéder à une route protégée
```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer eyJ..."
```

## 🚨 Variables d'Environnement Requises

Assurez-vous que ces variables sont définies sur Railway:
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
SECRET_KEY=votre_secret_key_long_et_securise
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## ✨ Prochaines Étapes

1. ✅ Module Auth & Users complet
2. 🔜 Frontend - Pages Login/Register
3. 🔜 Module Client Management
4. 🔜 Module KYC/AML
