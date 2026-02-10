# NSIA CRM Backend

FastAPI backend pour le CRM NSIA.

## Installation

```bash
# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt

# Copier le fichier d'environnement
cp .env.example .env

# Modifier .env avec vos valeurs
```

## Démarrage

```bash
# Lancer la base de données (depuis la racine du projet)
cd ..
docker-compose up -d

# Retourner au backend
cd backend

# Lancer le serveur
uvicorn app.main:app --reload
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Déploiement Railway

1. Connecter le repo GitHub à Railway
2. Ajouter les services :
   - PostgreSQL
   - Redis
3. Variables d'environnement :
   - `DATABASE_URL` (auto-généré par Railway)
   - `REDIS_URL` (auto-généré par Railway)
   - `SECRET_KEY` (générer une clé forte)
   - `BACKEND_CORS_ORIGINS` (ajouter l'URL Vercel)

## Structure

```
backend/
├── app/
│   ├── core/         # Configuration, database
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic schemas
│   ├── api/          # Routes API
│   └── main.py       # Application FastAPI
├── requirements.txt
└── .env.example
```
