# 🎯 NSIA CRM - Quick Start Guide

Bienvenue dans le projet NSIA CRM ! Voici le guide rapide pour démarrer.

## ⚡ Setup Rapide (Développement Local)

### Option 1 : Script Automatique (Recommandé)

```bash
# Depuis la racine du projet
./scripts/setup.sh
```

Ce script va :
- ✅ Créer l'environnement Python
- ✅ Installer les dépendances backend
- ✅ Installer les dépendances frontend  
- ✅ Démarrer PostgreSQL et Redis (Docker)
- ✅ Créer les fichiers .env

### Option 2 : Setup Manuel

**Backend :**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Modifiez .env si nécessaire
```

**Frontend :**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Modifiez .env.local si nécessaire
```

**Database :**
```bash
# Depuis la racine
docker-compose up -d
```

---

## 🚀 Démarrer l'Application

### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```
→ API disponible sur http://localhost:8000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
→ App disponible sur http://localhost:3000

### Terminal 3 - Database (si pas déjà lancé)
```bash
docker-compose up
```

---

## 📦 Déploiement Production

### 1️⃣ Pousser sur GitHub

```bash
# Option automatique
./scripts/deploy-github.sh

# Ou manuellement
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE-USERNAME/nsia-crm.git
git push -u origin main
```

### 2️⃣ Déployer Backend sur Railway

1. Aller sur https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Sélectionner `nsia-crm`
4. Ajouter PostgreSQL et Redis
5. Configurer les variables d'environnement

**Variables requises :**
```env
DATABASE_URL=<auto-généré>
REDIS_URL=<auto-généré>
SECRET_KEY=<générer-clé-forte>
BACKEND_CORS_ORIGINS=["https://votre-app.vercel.app"]
```

### 3️⃣ Déployer Frontend sur Vercel

1. Aller sur https://vercel.com
2. "New Project" → Importer depuis GitHub
3. **⚠️ IMPORTANT : Root Directory = `frontend`**
4. Configurer la variable :
```env
NEXT_PUBLIC_API_URL=https://votre-api.railway.app
```

📖 **Guide détaillé** : Voir `DEPLOYMENT.md`

---

## 🧪 Tests Rapides

### Vérifier que tout fonctionne

**Backend :**
```bash
# Health check
curl http://localhost:8000/health

# API docs
open http://localhost:8000/docs
```

**Frontend :**
```bash
# Ouvrir dans le navigateur
open http://localhost:3000
```

Vous devriez voir les deux statuts en vert ✅

---

## 📚 Structure du Projet

```
crm/
├── backend/              # FastAPI
│   ├── app/
│   │   ├── core/        # Config, database
│   │   ├── models/      # SQLAlchemy models (à venir)
│   │   ├── schemas/     # Pydantic schemas (à venir)
│   │   ├── api/         # Routes API (à venir)
│   │   └── main.py      # App FastAPI
│   └── requirements.txt
│
├── frontend/             # Next.js 14
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx
│   │       └── layout.tsx
│   └── package.json
│
├── scripts/              # Scripts utiles
│   ├── setup.sh         # Setup initial
│   └── deploy-github.sh # Deploy GitHub
│
├── docker-compose.yml    # PostgreSQL + Redis
├── README.md
├── DEPLOYMENT.md
└── QUICKSTART.md        # Ce fichier
```

---

## 🛠️ Commandes Utiles

### Backend
```bash
# Lancer le serveur
uvicorn app.main:app --reload

# Lancer avec hot reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Générer une SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Frontend
```bash
# Dev mode
npm run dev

# Build production
npm run build
npm start

# Type checking
npm run type-check

# Lint
npm run lint
```

### Database
```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Voir les logs
docker-compose logs -f postgres

# Accéder à PostgreSQL
docker exec -it nsia-crm-db psql -U nsia_user -d nsia_crm
```

---

## 🔧 Configuration

### Variables d'Environnement

**Backend (`backend/.env`) :**
```env
DATABASE_URL=postgresql://nsia_user:nsia_password_dev@localhost:5432/nsia_crm
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

**Frontend (`frontend/.env.local`) :**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📝 Prochaines Étapes

Maintenant que l'infrastructure est en place, on peut commencer à implémenter les modules :

### Phase 1 - Auth & Users (Semaine 1)
- [ ] Modèles User, Role, Permission
- [ ] Endpoints auth (login, register, logout)
- [ ] JWT tokens
- [ ] RBAC middleware
- [ ] Pages auth frontend

### Phase 2 - Gestion Clients (Semaine 2)
- [ ] Modèles Client, Account, Transaction
- [ ] CRUD Clients
- [ ] Vue 360° client
- [ ] Timeline événements
- [ ] Dashboard clients

### Phase 3 - KYC/AML (Semaine 3)
- [ ] Workflow KYC
- [ ] Upload documents
- [ ] Validation automatique
- [ ] Alertes conformité

### Phase 4 - Analytics (Semaine 4)
- [ ] Dashboard analytics
- [ ] Rapports automatisés
- [ ] Exports PDF/Excel
- [ ] Visualisations

---

## ❓ Aide & Support

### Documentation
- **FastAPI** : https://fastapi.tiangolo.com/
- **Next.js** : https://nextjs.org/docs
- **Tailwind CSS** : https://tailwindcss.com/docs

### Commandes de Debug
```bash
# Vérifier les ports utilisés
lsof -i :8000  # Backend
lsof -i :3000  # Frontend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Logs Docker
docker-compose logs -f

# Tester la connexion DB
docker exec -it nsia-crm-db pg_isready -U nsia_user
```

---

## 🎉 C'est parti !

Vous êtes prêt à développer le CRM NSIA ! 🚀

Pour toute question, consultez les fichiers :
- `README.md` - Vue d'ensemble
- `DEPLOYMENT.md` - Guide de déploiement détaillé
- `backend/README.md` - Docs backend
- `frontend/README.md` - Docs frontend

**Bon développement ! 💪**
