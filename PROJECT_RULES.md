# 📋 Règles du Projet - CRM Banking & Insurance

## 🎯 Principes Fondamentaux

### 1. Multi-Entreprises
- ✅ Le CRM n'est PAS spécifique à NSIA
- ✅ Doit être adaptable à toute entreprise bancaire/assurance
- ✅ Branding neutre et professionnel
- ✅ Configuration par entreprise (logo, couleurs, etc.) à venir

### 2. Données Réelles Uniquement
- ❌ **AUCUNE donnée fictive** dans l'application
- ✅ Toutes les données proviennent de la base de données
- ✅ Pas de mock data dans le code
- ✅ Pas de données hard-codées
- ⚠️ Pour les tests : utiliser des fixtures de test ou données anonymisées

### 3. Tests en Production
- ✅ Tester directement sur les environnements déployés
- ✅ Railway (backend) + Vercel (frontend)
- ✅ Pas de tests avec données de production réelles
- ✅ Utiliser des environnements de staging si nécessaire

### 4. Design Professionnel
- ❌ **PAS de dégradés** (gradients)
- ✅ Design épuré et professionnel
- ✅ Couleurs unies et sobres
- ✅ Espaces blancs et marges appropriées
- ✅ Typographie claire et lisible
- ✅ Bordures et ombres subtiles
- ✅ Responsive design obligatoire

## 🎨 Guidelines Design

### Couleurs
- **Primaire**: Bleu professionnel (#0284c7)
- **Secondaire**: Gris (#6b7280)
- **Succès**: Vert (#10b981)
- **Erreur**: Rouge (#ef4444)
- **Avertissement**: Orange (#f59e0b)
- **Fond**: Blanc (#ffffff) et Gris clair (#f9fafb)

### Composants
- Bordures: `border border-gray-200`
- Ombres: `shadow-sm` ou `shadow-md` (pas de shadow-xl)
- Arrondis: `rounded-lg` (8px)
- Espacement: Utiliser le système de spacing Tailwind

### Typographie
- Titres: `font-bold` ou `font-semibold`
- Corps: `font-normal` ou `font-medium`
- Tailles: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-4xl`

## 💾 Gestion des Données

### Base de Données
- PostgreSQL comme source unique de vérité
- Pas de données en dur dans le code
- Migrations Alembic pour les changements de schéma
- Validation Pydantic côté backend

### API
- RESTful endpoints
- Pagination obligatoire pour les listes
- Filtres et recherche sur les ressources
- Réponses JSON standardisées

### Frontend
- TanStack Query pour le cache et la synchronisation
- Pas de données mockées
- Loading states obligatoires
- Error handling approprié

## 🔒 Sécurité

### Authentification
- JWT tokens
- Refresh tokens
- Expiration appropriée
- HTTPS obligatoire en production

### Autorisation
- RBAC (Role-Based Access Control)
- Permissions granulaires
- Validation côté backend
- Double vérification frontend + backend

### Données Sensibles
- Pas de logs de données sensibles
- Chiffrement des données critiques
- Pas de secrets dans le code
- Variables d'environnement pour la config

## 📝 Code Quality

### Backend (Python/FastAPI)
- Type hints obligatoires
- Docstrings pour les fonctions publiques
- Tests unitaires
- Validation Pydantic
- Code formaté avec Black
- Linting avec Ruff

### Frontend (TypeScript/Next.js)
- TypeScript strict mode
- Props typées
- Composants réutilisables
- Hooks personnalisés pour la logique
- ESLint + Prettier
- Pas de `any` type (sauf exceptions justifiées)

### Git
- Commits atomiques et descriptifs
- Feature branches
- Pull requests pour review
- Conventional commits

## 🚫 Interdictions

### ❌ À NE JAMAIS FAIRE
1. Hard-coder des données de test dans l'app
2. Utiliser des dégradés CSS
3. Commiter des secrets ou credentials
4. Ignorer les erreurs TypeScript
5. Skipper la validation des données
6. Laisser des console.log en production
7. Utiliser `any` sans raison valable
8. Créer des composants monolithiques (>300 lignes)
9. Dupliquer du code (DRY principle)
10. Oublier la gestion d'erreurs

### ⚠️ À Éviter
1. Composants trop complexes
2. Props drilling excessif
3. Requêtes non optimisées
4. Données non validées
5. États non synchronisés
6. Styles inline excessifs
7. Dépendances non nécessaires

## ✅ Best Practices

### Performance
- Lazy loading des composants
- Pagination des listes longues
- Cache approprié (Redis + TanStack Query)
- Optimisation des images
- Code splitting

### UX/UI
- Loading states clairs
- Messages d'erreur explicites
- Feedback utilisateur immédiat
- Navigation intuitive
- Accessibility (a11y)

### Développement
- Environnements séparés (dev/staging/prod)
- CI/CD automatisé
- Tests automatisés
- Documentation à jour
- Code reviews systématiques

## 🔄 Workflow de Développement

### 1. Développement Local
```bash
# Backend
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# Frontend
cd frontend && npm run dev

# Database
docker-compose up -d
```

### 2. Tests
- Tests unitaires backend (pytest)
- Tests frontend (Jest + Testing Library)
- Tests E2E si nécessaire

### 3. Déploiement
- Push sur GitHub
- Railway redéploie automatiquement (backend)
- Vercel redéploie automatiquement (frontend)
- Vérifier les logs après déploiement

## 📚 Documentation

### Obligatoire
- README.md à jour
- Docstrings Python
- JSDoc pour fonctions complexes
- API documentation (Swagger auto-généré)
- Schémas de base de données

### Recommandé
- Architecture decisions records (ADR)
- Guides utilisateur
- Changelog
- Contributing guidelines

## 🎯 Priorités

1. **Fonctionnalité** - Ça doit marcher
2. **Sécurité** - Ça doit être sécurisé
3. **Performance** - Ça doit être rapide
4. **UX** - Ça doit être utilisable
5. **Design** - Ça doit être professionnel
6. **Code Quality** - Ça doit être maintenable

---

**Date de création**: 10 février 2026  
**Version**: 1.0.0  
**Statut**: 📋 Règles actives et obligatoires
