# 🚀 Guide de Déploiement Rapide

## ✅ État Actuel

- ✅ Code prêt et commité
- ✅ Build frontend réussi
- ✅ 0 vulnérabilités
- ✅ Next.js 15.5.12 (sécurisé)
- ✅ Design professionnel sans dégradé
- ✅ Branding multi-entreprises

---

## 📝 Étapes de Déploiement

### 1️⃣ Créer le Repo GitHub (2 min)

```bash
# Option 1: Via l'interface GitHub
# Aller sur https://github.com/new
# Nom: crm-banking-insurance
# Description: CRM professionnel pour banques et assurances
# Visibilité: Private (recommandé)
# Ne PAS initialiser avec README

# Option 2: Via GitHub CLI (si installé)
gh repo create crm-banking-insurance --private --source=. --remote=origin
```

**Puis pusher le code:**
```bash
cd /home/anna/Documents/crm
git remote add origin https://github.com/VOTRE-USERNAME/crm-banking-insurance.git
git push -u origin main
```

---

### 2️⃣ Déployer Backend sur Railway (5 min)

#### A. Créer le Projet
1. Aller sur https://railway.app
2. Se connecter avec GitHub
3. Cliquer **"New Project"**
4. Sélectionner **"Deploy from GitHub repo"**
5. Choisir `crm-banking-insurance`
6. Railway détecte automatiquement le backend Python

#### B. Ajouter PostgreSQL
1. Cliquer **"+ New"** dans le projet
2. Sélectionner **"Database" → "Add PostgreSQL"**
3. `DATABASE_URL` est auto-généré

#### C. Ajouter Redis
1. Cliquer **"+ New"**
2. Sélectionner **"Database" → "Add Redis"**
3. `REDIS_URL` est auto-généré

#### D. Variables d'Environnement
Dans le service backend, onglet **"Variables"**, ajouter:

```env
# Auto-générées par Railway
DATABASE_URL=<déjà présent>
REDIS_URL=<déjà présent>

# À ajouter manuellement:
SECRET_KEY=<voir commande ci-dessous>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
PROJECT_NAME=Banking & Insurance CRM API
API_V1_PREFIX=/api/v1
BACKEND_CORS_ORIGINS=["*"]
```

**Générer SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
# Copier la sortie et la coller dans Railway
```

#### E. Vérifier le Déploiement
- Attendre le build (2-3 min)
- Noter l'URL: `https://VOTRE-PROJET.up.railway.app`
- Tester: `https://VOTRE-PROJET.up.railway.app/health`
- Doit retourner: `{"status":"healthy","database":"connected","redis":"connected"}`

---

### 3️⃣ Déployer Frontend sur Vercel (3 min)

#### A. Importer le Projet
1. Aller sur https://vercel.com
2. Se connecter avec GitHub
3. Cliquer **"Add New" → "Project"**
4. Sélectionner `crm-banking-insurance`

#### B. Configuration du Build
**⚠️ TRÈS IMPORTANT:**

```
Root Directory:    frontend          ← Dossier racine
Framework Preset:  Next.js           ← Automatique
Build Command:     npm run build     ← Par défaut
Output Directory:  .next             ← Par défaut
Install Command:   npm install       ← Par défaut
```

#### C. Variables d'Environnement
Dans **"Environment Variables"**, ajouter:

```env
NEXT_PUBLIC_API_URL=https://VOTRE-PROJET.up.railway.app
```
(Utiliser l'URL Railway de l'étape 2)

#### D. Déployer
1. Cliquer **"Deploy"**
2. Attendre le build (1-2 min)
3. Noter l'URL: `https://VOTRE-APP.vercel.app`

---

### 4️⃣ Finaliser CORS (1 min)

#### Retour sur Railway
1. Dans le service backend → **Variables**
2. Modifier `BACKEND_CORS_ORIGINS`:
```env
BACKEND_CORS_ORIGINS=["https://VOTRE-APP.vercel.app","https://*.vercel.app"]
```
3. Railway redéploie automatiquement

---

### 5️⃣ Tester l'Application

#### Backend
```bash
# Health check
curl https://VOTRE-PROJET.up.railway.app/health

# API root
curl https://VOTRE-PROJET.up.railway.app/

# API Docs
# Ouvrir: https://VOTRE-PROJET.up.railway.app/docs
```

#### Frontend
1. Ouvrir: `https://VOTRE-APP.vercel.app`
2. Vérifier que les 2 statuts sont verts ✅
3. Cliquer sur "API Docs" → doit ouvrir Swagger
4. Tester un endpoint dans Swagger

---

## ✅ Checklist de Validation

### Backend Railway
- [ ] Build réussi
- [ ] PostgreSQL connecté
- [ ] Redis connecté
- [ ] Health check retourne "healthy"
- [ ] API Docs accessible (/docs)
- [ ] Variables d'environnement configurées

### Frontend Vercel
- [ ] Build réussi
- [ ] Page d'accueil charge
- [ ] Statut Frontend: ✓ Actif (vert)
- [ ] Statut Backend: ✓ Actif (vert)
- [ ] Design sans dégradé ✓
- [ ] Lien API Docs fonctionne

### Communication
- [ ] Frontend peut appeler le backend
- [ ] Pas d'erreurs CORS
- [ ] Informations API affichées correctement

---

## 🎯 URLs Finales à Noter

```
GitHub:           https://github.com/VOTRE-USERNAME/crm-banking-insurance
Backend Railway:  https://VOTRE-PROJET.up.railway.app
API Docs:         https://VOTRE-PROJET.up.railway.app/docs
Frontend Vercel:  https://VOTRE-APP.vercel.app
```

---

## 🔄 Déploiement Continu

Une fois configuré, c'est automatique:

```bash
# Faire des changements
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push

# Railway et Vercel redéploient automatiquement !
```

---

## 🆘 Troubleshooting

### Backend ne démarre pas
```bash
# Vérifier les logs Railway
# Dashboard → Service → Deployments → Logs

# Vérifier les variables
# Dashboard → Service → Variables
```

### Frontend ne se connecte pas
```bash
# Vérifier NEXT_PUBLIC_API_URL dans Vercel
# Dashboard → Settings → Environment Variables

# Vérifier CORS dans Railway
# Doit inclure l'URL Vercel
```

### Erreurs CORS
```bash
# Dans Railway, BACKEND_CORS_ORIGINS doit inclure:
["https://votre-app.vercel.app","https://*.vercel.app"]
```

---

## 📞 Support

- **Railway**: https://railway.app/help
- **Vercel**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs
- **FastAPI**: https://fastapi.tiangolo.com

---

**Temps total estimé: ~15 minutes**

🎉 **Bonne chance pour le déploiement !**
