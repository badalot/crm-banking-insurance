# ☑️ Checklist de Déploiement - NSIA CRM

Utilisez cette checklist pour vous assurer que tout est configuré correctement.

---

## 📦 Phase 1 : Setup Local

### Backend
- [ ] Python 3.11+ installé (`python3 --version`)
- [ ] Environnement virtuel créé (`python3 -m venv backend/venv`)
- [ ] Dépendances installées (`pip install -r backend/requirements.txt`)
- [ ] Fichier `.env` créé (`cp backend/.env.example backend/.env`)
- [ ] SECRET_KEY générée et ajoutée dans `.env`

### Frontend
- [ ] Node.js 18+ installé (`node --version`)
- [ ] Dépendances installées (`cd frontend && npm install`)
- [ ] Fichier `.env.local` créé (`cp .env.local.example .env.local`)

### Database
- [ ] Docker installé (`docker --version`)
- [ ] PostgreSQL et Redis démarrés (`docker-compose up -d`)
- [ ] Connexion DB testée (`docker exec -it nsia-crm-db pg_isready`)

### Test Local
- [ ] Backend démarre (`uvicorn app.main:app --reload`)
- [ ] Frontend démarre (`npm run dev`)
- [ ] Health check OK (`curl http://localhost:8000/health`)
- [ ] Page d'accueil charge (`open http://localhost:3000`)
- [ ] Statut backend vert sur la page d'accueil

---

## 🐙 Phase 2 : GitHub

### Initialisation
- [ ] Git initialisé (`git init`)
- [ ] Fichiers ajoutés (`git add .`)
- [ ] Premier commit (`git commit -m "Initial commit"`)

### Repo GitHub
- [ ] Repo créé sur github.com/new
- [ ] Nom: `nsia-crm`
- [ ] Visibilité: Private (recommandé)
- [ ] Remote ajouté (`git remote add origin ...`)
- [ ] Code poussé (`git push -u origin main`)
- [ ] Code visible sur GitHub

---

## 🚂 Phase 3 : Railway (Backend)

### Projet Railway
- [ ] Compte Railway créé
- [ ] Nouveau projet créé
- [ ] Repo GitHub connecté
- [ ] Service backend détecté automatiquement

### Services
- [ ] PostgreSQL ajouté
- [ ] Redis ajouté
- [ ] Variables auto-générées visibles

### Variables d'Environnement
- [ ] `DATABASE_URL` (auto-généré)
- [ ] `REDIS_URL` (auto-généré)
- [ ] `SECRET_KEY` (ajouté manuellement)
- [ ] `ALGORITHM=HS256`
- [ ] `ACCESS_TOKEN_EXPIRE_MINUTES=30`
- [ ] `ENVIRONMENT=production`
- [ ] `PROJECT_NAME=NSIA CRM API`
- [ ] `API_V1_PREFIX=/api/v1`
- [ ] `BACKEND_CORS_ORIGINS` (temporaire: `["*"]`)

### Déploiement
- [ ] Build réussit
- [ ] Déploiement terminé
- [ ] URL publique notée
- [ ] Health check OK (`curl https://votre-api.railway.app/health`)
- [ ] API Docs accessible (`https://votre-api.railway.app/docs`)

---

## ▲ Phase 4 : Vercel (Frontend)

### Projet Vercel
- [ ] Compte Vercel créé
- [ ] Nouveau projet créé
- [ ] Repo GitHub importé

### Configuration
- [ ] **Root Directory: `frontend`** ⚠️ IMPORTANT
- [ ] Framework Preset: Next.js
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`

### Variables d'Environnement
- [ ] `NEXT_PUBLIC_API_URL` = URL Railway
  - Example: `https://nsia-crm-production.up.railway.app`

### Déploiement
- [ ] Build réussit
- [ ] Déploiement terminé
- [ ] URL publique notée
- [ ] Site accessible
- [ ] Connexion backend fonctionne
- [ ] Statuts verts sur la page d'accueil

---

## 🔄 Phase 5 : Finalisation

### CORS Backend (Railway)
- [ ] Retour sur Railway → Variables
- [ ] `BACKEND_CORS_ORIGINS` mis à jour avec URL Vercel
  - Example: `["https://nsia-crm.vercel.app","https://nsia-crm-*.vercel.app"]`
- [ ] Redéploiement automatique terminé
- [ ] Test connexion OK

### Documentation
- [ ] URLs notées dans un fichier sécurisé
  - [ ] GitHub Repo
  - [ ] Railway Backend
  - [ ] Vercel Frontend
- [ ] Credentials sauvegardés
  - [ ] SECRET_KEY
  - [ ] DATABASE_URL
  - [ ] REDIS_URL

### Tests Finaux
- [ ] Frontend production accessible
- [ ] Backend production accessible
- [ ] Connexion frontend ↔ backend OK
- [ ] Health check backend OK
- [ ] Logs backend sans erreurs
- [ ] Logs frontend sans erreurs

---

## 📝 URLs à Documenter

### Développement
```
Frontend Local:  http://localhost:3000
Backend Local:   http://localhost:8000
API Docs Local:  http://localhost:8000/docs
PostgreSQL:      localhost:5432
Redis:           localhost:6379
```

### Production
```
GitHub Repo:     https://github.com/[USERNAME]/nsia-crm
Railway Backend: https://[PROJECT].railway.app
Vercel Frontend: https://[PROJECT].vercel.app
API Docs Prod:   https://[PROJECT].railway.app/docs
```

---

## 🔐 Sécurité

### Secrets à Protéger
- [ ] `.env` ajouté dans `.gitignore` ✅
- [ ] `backend/.env` jamais commité
- [ ] `frontend/.env.local` jamais commité
- [ ] SECRET_KEY forte générée (32+ chars)
- [ ] Credentials database non exposés
- [ ] Variables sensibles uniquement dans Railway/Vercel

### Accès
- [ ] Repo GitHub en Private
- [ ] Railway dashboard sécurisé
- [ ] Vercel dashboard sécurisé
- [ ] 2FA activé (recommandé)

---

## ✅ Validation Finale

### Checklist Complète
- [ ] ✅ Setup local fonctionnel
- [ ] ✅ Code sur GitHub
- [ ] ✅ Backend déployé sur Railway
- [ ] ✅ Frontend déployé sur Vercel
- [ ] ✅ Communication frontend ↔ backend OK
- [ ] ✅ Logs sans erreurs
- [ ] ✅ Documentation à jour
- [ ] ✅ URLs documentées

### Test End-to-End
1. [ ] Ouvrir l'URL Vercel
2. [ ] Voir les 2 statuts verts
3. [ ] Cliquer sur "API Docs"
4. [ ] Swagger UI s'ouvre
5. [ ] Tester `/health` dans Swagger
6. [ ] Réponse 200 OK

---

## 🎉 Statut

- [ ] 🔴 Pas commencé
- [ ] 🟡 En cours
- [ ] 🟢 **TERMINÉ ET VALIDÉ**

**Une fois tout ✅, vous êtes prêt à développer les fonctionnalités !**

---

## 🆘 En Cas de Problème

### Backend ne démarre pas
1. Vérifier les logs Railway
2. Vérifier que DATABASE_URL et REDIS_URL existent
3. Vérifier que SECRET_KEY est définie
4. Tester le health check

### Frontend ne se connecte pas
1. Vérifier NEXT_PUBLIC_API_URL dans Vercel
2. Vérifier CORS dans Railway
3. Ouvrir la console navigateur (F12)
4. Chercher les erreurs CORS ou network

### Build échoue
1. Voir les logs de build
2. Vérifier les dépendances
3. Tester le build localement
4. Vérifier la version de Node/Python

---

**Date:** 10 février 2026  
**Version:** 1.0.0  
**Statut:** 📋 Prêt à utiliser
