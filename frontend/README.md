# NSIA CRM Frontend

Interface web Next.js 14 pour le CRM NSIA.

## Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.local.example .env.local

# Modifier .env.local avec l'URL de votre API
```

## Démarrage

```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## Build Production

```bash
npm run build
npm start
```

## Déploiement Vercel

### Via le Dashboard Vercel

1. Importer le repo GitHub
2. **Root Directory**: `frontend`
3. **Framework Preset**: Next.js
4. **Build Command**: `npm run build`
5. **Output Directory**: `.next`

### Variables d'Environnement

Ajouter dans Vercel :
- `NEXT_PUBLIC_API_URL` = URL de votre API Railway (ex: https://your-api.railway.app)

### Via CLI Vercel

```bash
npm install -g vercel
cd frontend
vercel
```

## Structure

```
frontend/
├── src/
│   └── app/
│       ├── layout.tsx    # Layout principal
│       ├── page.tsx      # Page d'accueil
│       └── globals.css   # Styles globaux
├── public/               # Assets statiques
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Technologies

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Query** (à venir)
- **Zustand** (à venir)
