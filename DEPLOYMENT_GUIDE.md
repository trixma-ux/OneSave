# 🚀 Guide Complet de Déploiement - OneSave

## Table des matières
1. [Architecture](#architecture)
2. [Déploiement local (dev)](#déploiement-local-dev)
3. [Déploiement en production](#déploiement-en-production)
4. [Configuration Railway (Backend)](#configuration-railway-backend)
5. [Configuration Vercel (Frontend)](#configuration-vercel-frontend)
6. [CI/CD GitHub Actions](#cicd-github-actions)
7. [Migration SQLite → PostgreSQL](#migration-sqlite--postgresql)
8. [Dépannage](#dépannage)

---

## Architecture

### Topologie recommandée (Production gratuite)

```
┌─────────────────────────────────────────────────────────────┐
│                     Utilisateurs                            │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
    ┌────▼─────┐                  ┌─────▼──────┐
    │  Vercel  │                  │  Railway   │
    │ (Frontend│                  │ (Backend + │
    │ React)   │◄─────────────────┤ API +      │
    │          │   API requests   │ Postgres)  │
    └──────────┘                  └────┬───────┘
                                       │
                                  ┌────▼──────┐
                                  │ PostgreSQL│
                                  │ Database  │
                                  └───────────┘
```

### Base de données

| Environnement | Provider | Statut | Configuration |
|---|---|---|---|
| **Development** | SQLite (local) | `file:./prisma/dev.db` | Repo ignoré (`.gitignore`) |
| **Production** | PostgreSQL | Fourni par Railway/Render | Clé d'env `DATABASE_URL` |

---

## Déploiement local (dev)

### 1. Prérequis
```bash
# Vérifier Node.js 18+
node --version  # v18.0.0 ou supérieur

# Vérifier npm 9+
npm --version   # v9.0.0 ou supérieur
```

### 2. Clone et setup complet

```powershell
# Clone le repo
git clone https://github.com/votre-username/OneSave.git
cd OneSave

# Install all dependencies
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Configuration environnement

**`server/.env`** (créer ce fichier)
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="votre_secret_jwt_super_securise_changez_en_prod"
PORT=5000
NODE_ENV=development
```

**`client/.env`** (créer ce fichier)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Initialiser base de données

```powershell
cd server

# Générer Prisma Client
npm run prisma:generate

# Créer DB et appliquer migrations
npm run prisma:migrate

# Vérifier avec Prisma Studio (optionnel)
npm run prisma:studio
```

### 5. Démarrer en mode dev

**Option A : Backend + Frontend séparés (recommended pour dev)**

Terminal 1 - Backend :
```powershell
cd server
npm run dev
# Écoute sur http://localhost:5000
# API sur http://localhost:5000/api
```

Terminal 2 - Frontend (hot-reload) :
```powershell
cd client
npm start
# Ouvre http://localhost:3000
# Auto-reload lors des changements
```

**Option B : Build et servir depuis backend (production-like)**

```powershell
# Build client
cd client
npm run build

# Démarrer serveur (sert frontend + API)
cd ../server
npm start
# Ouvre http://localhost:5000
```

### 6. Test utilisateur

**Créer un compte de test :**
- URL: http://localhost:3000 (dev) ou http://localhost:5000 (prod build)
- Email : `test@example.com`
- Mot de passe : `password123`

**Tester API directement :**
```powershell
# Vérifier santé API
Invoke-RestMethod http://localhost:5000/api/health -UseBasicParsing | ConvertTo-Json

# Inscrire utilisateur
$body = @{
    nom = "Test User"
    email = "test@example.com"
    motDePasse = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/auth/register `
  -Method Post `
  -Body $body `
  -ContentType 'application/json'
```

---

## Déploiement en production

### Stack recommandé (gratuit)

| Composant | Service | Plan | Coût |
|---|---|---|---|
| **Frontend** | Vercel | Hobby (gratuit) | 💰 0€ |
| **Backend** | Railway | Starter (crédit gratuit) | 💰 $5-10/mois après |
| **Database** | Railway PostgreSQL | Inclus | 💰 0€ (crédit initial) |
| **CI/CD** | GitHub Actions | Free tier | 💰 0€ |

**Alternative :** Render (backend), Netlify (frontend), Supabase (DB)

---

## Configuration Railway (Backend)

### Step 1: Créer un compte Railway

1. Aller sur [railway.app](https://railway.app)
2. S'inscrire avec GitHub
3. Accorder les permissions (repo accès)

### Step 2: Créer un nouveau projet

1. Cliquer sur "+ New Project"
2. Choisir "Deploy from GitHub repo"
3. Sélectionner votre repo `OneSave`
4. Valider

### Step 3: Configurer le service backend

Railway va auto-détecter le `package.json` et créer un service Node.

**Configuration variables d'env :**
- Dans le dashboard Railway, aller à "Environment" du service backend
- Ajouter :
  ```
  JWT_SECRET = votre_secret_jwt_tres_securise
  PORT = 5000
  NODE_ENV = production
  DATABASE_URL = (sera défini à l'étape 4)
  ```

### Step 4: Ajouter PostgreSQL

1. Dans le projet Railway, cliquer "+ Add Service"
2. Choisir "PostgreSQL"
3. Railway va créer une DB et peupler `DATABASE_URL` automatiquement ✨
4. **Vérifier** : dans l'onglet "Variables" du service PostgreSQL, `DATABASE_URL` doit exister

### Step 5: Configurer le build & start

Dans "Settings" du service backend :

- **Build Command :**
  ```bash
  cd server && npm install && npx prisma generate && npm run build
  ```

- **Start Command :**
  ```bash
  cd server && npm start
  ```

- **Root Directory :** ✅ (laisser vide, ou mettre `.` si monorepo)

### Step 6: Appliquer migrations à la DB distante

**Première fois (une seule fois) :**

Option A - Via Railway CLI (local) :
```powershell
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link votre projet
railway link

# Exécuter migration
railway run "cd server && npx prisma migrate deploy"
```

Option B - Via le dashboard Railway :
1. Aller à votre service backend
2. Onglet "Deploy" → "Run"
3. Entrer la commande : `npx prisma migrate deploy`
4. Cliquer "Execute"

### Step 7: Vérifier le déploiement

1. Railway va afficher l'URL publique : `https://onesave-backend-prod.up.railway.app`
2. Tester la santé de l'API :
   ```powershell
   Invoke-RestMethod https://onesave-backend-prod.up.railway.app/api/health -UseBasicParsing
   ```
   Résultat attendu :
   ```json
   {
     "status": "OK",
     "message": "OneSave API is running",
     "environment": "production",
     "timestamp": "2025-11-12T10:30:00Z"
   }
   ```

---

## Configuration Vercel (Frontend)

### Step 1: Créer un compte Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. S'inscrire avec GitHub
3. Accorder permissions

### Step 2: Importer le projet

1. Dans Vercel, cliquer "New Project"
2. Sélectionner repo `OneSave`
3. Vercel va auto-détecter React app

### Step 3: Configuration Build

- **Framework Preset :** `Create React App` (auto-détecté)
- **Build Command :** `npm run build`
- **Output Directory :** `build`
- **Install Command :** `npm install`

### Step 4: Variables d'environnement

Aller à "Settings" → "Environment Variables"

Ajouter :
```
REACT_APP_API_URL = https://onesave-backend-prod.up.railway.app/api
```

**Pour chaque environnement :**
- **Production :** URL backend Railway
- **Preview** (PR) : URL backend staging (ou même production pour test)

### Step 5: Deploy

Cliquer "Deploy"

Vercel va :
1. Cloner le repo
2. Installer dépendances (`npm install`)
3. Exécuter build (`npm run build`)
4. Servir `/client/build` sur son CDN global 🚀

**Résultat :** https://onesave.vercel.app (URL auto-générée)

### Step 6: Custom Domain (optionnel)

1. Dans Vercel Settings → Domains
2. Ajouter votre domaine personnalisé (ex. `onesave.com`)
3. Pointer DNS vers Vercel

---

## CI/CD GitHub Actions

Le fichier `.github/workflows/ci-cd.yml` va :

✅ **À chaque push sur `main` :**
1. Installer dépendances (root, server, client)
2. Build TypeScript serveur
3. Run tests backend + e2e
4. Build frontend React
5. Déployer backend → Railway
6. Déployer frontend → Vercel

### Setup GitHub Secrets

1. Aller à repo Settings → "Secrets and variables" → "Actions"
2. Ajouter :

```
RAILWAY_TOKEN          = (depuis Railway → Settings → Tokens)
RAILWAY_PROJECT_ID     = (depuis Railway dashboard)
VERCEL_TOKEN           = (depuis Vercel → Settings → Tokens)
API_URL                = https://onesave-backend-prod.up.railway.app/api
```

### Obtenir les tokens

**Railway Token :**
1. [railway.app/settings/tokens](https://railway.app/account/tokens)
2. Générer nouveau token
3. Copier & ajouter en secret GitHub `RAILWAY_TOKEN`

**Vercel Token :**
1. [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Créer nouveau token
3. Copier & ajouter en secret GitHub `VERCEL_TOKEN`

---

## Migration SQLite → PostgreSQL

### Pourquoi ?

| Aspect | SQLite | PostgreSQL |
|---|---|---|
| **Persistence** | Fichier local (éphémère) ❌ | Base de données persistante ✅ |
| **Scaling** | 1 utilisateur ❌ | Milliers d'utilisateurs ✅ |
| **Transactions** | Limité ❌ | Full ACID ✅ |
| **Production** | ❌ Non recommandé | ✅ Recommandé |

### Comment

**1. Créer PostgreSQL sur Railway (voir section précédente)**

**2. Mettre à jour `DATABASE_URL` localement**

`server/.env` (test local vers Postgres Railway) :
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
PORT=5000
NODE_ENV=development
```

**3. Appliquer migrations existantes**

```powershell
cd server

# Prisma va appliquer tous les changesets vers la nouvelle DB
npx prisma migrate deploy

# Vérifier les données
npx prisma studio
```

**4. Valider**

```powershell
# Faire des requêtes API depuis le frontend
# Vérifier les données dans Prisma Studio
```

---

## Dépannage

### ❌ `DATABASE_URL not set`

**Solution :**
```bash
# Dev
export DATABASE_URL="file:./prisma/dev.db"  # Linux/Mac
set DATABASE_URL=file:./prisma/dev.db       # Windows

# Ou ajouter dans `.env`
echo 'DATABASE_URL="file:./prisma/dev.db"' >> server/.env
```

### ❌ `Port 5000 already in use`

**Solution :**
```powershell
# Tuer le processus
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Ou utiliser un port différent
$env:PORT=5001
npm run dev
```

### ❌ `CORS error` (frontend ne peut pas atteindre backend)

**Solution :**
1. Vérifier que `REACT_APP_API_URL` pointe correctement vers le backend
2. Vérifier que CORS est activé sur backend (`cors()` dans `index.ts`)
3. Vérifier proxy en `client/package.json` :
   ```json
   "proxy": "http://localhost:5000"
   ```

### ❌ `Prisma migrations failed`

**Solution :**
```powershell
# Réappliquer migrations depuis zéro
cd server

# Supprimer l'archive de migrations (dev seulement)
rm prisma/dev.db

# Recréer
npx prisma migrate dev --name initial

# Ou sur Prod Railway
railway run "npx prisma migrate deploy --skip-generate"
```

### ❌ Tests échouent localement

**Solution :**
```powershell
# Nettoyer node_modules et réinstaller
rm -r server/node_modules
npm ci

# Refaire migrations pour test DB
npm run test
```

---

## 📋 Checklist Déploiement Complet

- [ ] Repository GitHub créé et token généré
- [ ] Compte Railway créé & projet linké
- [ ] Compte Vercel créé & repo importé
- [ ] PostgreSQL créé sur Railway
- [ ] `DATABASE_URL` défini sur Railway
- [ ] Migrations appliquées à DB distante
- [ ] Secrets GitHub ajoutés (`RAILWAY_TOKEN`, `VERCEL_TOKEN`, etc.)
- [ ] CI/CD workflow `.github/workflows/ci-cd.yml` commité
- [ ] Test API santé : `GET /api/health` répond 200
- [ ] Frontend accessible sur Vercel URL
- [ ] Inscription/Login fonctionnent de bout en bout

---

## 🎉 Résumé des URLs

```
🌐 Frontend (Vercel)  : https://onesave.vercel.app
🔗 Backend API (Railway) : https://onesave-backend.up.railway.app
📊 Prisma Studio (local) : http://localhost:5555
💾 Database : PostgreSQL (Railway)
```

---

## 📞 Support & Ressources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Migration Guide](https://www.prisma.io/docs/orm/prisma-migrate/workflows/add-to-existing-project)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Créé le 12 novembre 2025 | OneSave v1.0.0**
