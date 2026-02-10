# Banking & Insurance CRM

CRM moderne et professionnel pour le secteur bancaire et assurance.
Solution multi-entreprises adaptée au marché africain.

## 🏗️ Architecture

- **Backend**: FastAPI (Python 3.11+)
- **Frontend**: Next.js 14 (TypeScript)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Déploiement**: Railway (backend) + Vercel (frontend)

## 📁 Structure du Projet

```
crm/
├── backend/          # API FastAPI
├── frontend/         # Application Next.js
├── docker-compose.yml
└── README.md
```

## 🚀 Démarrage Rapide

### Prérequis

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. **Clone le repo**
```bash
git clone <your-repo-url>
cd crm
```

2. **Backend (Terminal 1)**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn app.main:app --reload
```

3. **Frontend (Terminal 2)**
```bash
cd frontend
npm install
npm run dev
```

4. **Database (Terminal 3)**
```bash
docker-compose up
```

### URLs Locales

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🌍 Déploiement

### Railway (Backend)

1. Connecter le repo GitHub
2. Ajouter PostgreSQL et Redis
3. Variables d'environnement dans Railway

### Vercel (Frontend)

1. Importer le projet depuis GitHub
2. Root Directory: `frontend`
3. Ajouter `NEXT_PUBLIC_API_URL`

## 📝 TODO - Roadmap

- [x] Setup projet
- [x] Déploiement initial
- [ ] Module Auth & Users
- [ ] Gestion Clients 360°
- [ ] KYC/AML
- [ ] Dashboard Analytics
- [ ] Scoring & ML
- [ ] Intégrations (Mobile Money, WhatsApp)
- [ ] Mode offline (PWA)

## 🔐 Sécurité

- JWT Authentication
- RBAC (Role-Based Access Control)
- Chiffrement données sensibles
- Logs d'audit
- Rate limiting

## 📄 License

Proprietary
