# OneSave - Commandes PowerShell Quick Reference

## 🎯 Démarrage Rapide (Dev)

### Installation complète en une fois
```powershell
cd c:\Users\DELL\Desktop\OneSave

# Option 1: Script automatique (RECOMMANDÉ)
.\scripts\dev-setup.ps1

# Option 2: Manuel étape par étape
npm install
cd server; npm install; cd ..
cd client; npm install; cd ..

# Setup .env
echo 'DATABASE_URL="file:./prisma/dev.db"' > server\.env
echo 'JWT_SECRET="dev_secret_change_in_prod"' >> server\.env
echo 'PORT=5000' >> server\.env
echo 'NODE_ENV=development' >> server\.env

echo 'REACT_APP_API_URL=http://localhost:5000/api' > client\.env

# Init Database
cd server
npm run prisma:migrate
cd ..
```

## 🚀 Démarrer l'application

### Backend (API + Database)
```powershell
cd c:\Users\DELL\Desktop\OneSave\server
npm run dev
# 🚀 Serveur écoute sur http://localhost:5000
# 📊 API sur http://localhost:5000/api
```

### Frontend (React)
```powershell
cd c:\Users\DELL\Desktop\OneSave\client
npm start
# 🌐 Ouvre http://localhost:3000
# ♻️  Auto-reload sur changements
```

### Les deux ensemble (depuis racine)
```powershell
cd c:\Users\DELL\Desktop\OneSave

# Terminal 1
cd server; npm run dev

# Terminal 2 (dans une nouvelle fenêtre PowerShell)
cd c:\Users\DELL\Desktop\OneSave\client
npm start
```

---

## 🧪 Tests & Vérification

### Health Check API
```powershell
# Vérifier que le backend répond
Invoke-RestMethod http://localhost:5000/api/health -UseBasicParsing | ConvertTo-Json
```

### Tester Inscription (Registration)
```powershell
$body = @{
    nom = "Test User"
    email = "test@example.com"
    motDePasse = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:5000/api/auth/register `
  -Method Post `
  -Body $body `
  -ContentType 'application/json'

$response | ConvertTo-Json
# Résultat: token + utilisateur
```

### Tester Login
```powershell
$body = @{
    email = "test@example.com"
    motDePasse = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:5000/api/auth/login `
  -Method Post `
  -Body $body `
  -ContentType 'application/json'

$response | ConvertTo-Json
# Résultat: token + utilisateur
```

### Run E2E Tests
```powershell
cd c:\Users\DELL\Desktop\OneSave\server
npm run test:e2e
# Tests: registration, login, token verification, /me endpoint
```

---

## 🏗️ Build pour Production

### Build Frontend
```powershell
cd c:\Users\DELL\Desktop\OneSave\client
npm run build
# Résultat: client/build/ (prêt pour Vercel)
```

### Build Backend
```powershell
cd c:\Users\DELL\Desktop\OneSave\server
npm run build
# Résultat: server/dist/ (prêt pour Railway)
```

### Test Build Localement (Production-like)
```powershell
cd c:\Users\DELL\Desktop\OneSave\server
npm start
# Sert frontend + API sur http://localhost:5000
# (le backend serve le client/build statique)
```

---

## 💾 Database Management

### Prisma Studio (DB Explorer)
```powershell
cd c:\Users\DELL\Desktop\OneSave\server
npm run prisma:studio
# Ouvre http://localhost:5555 pour explorer la DB
```

### Reset Database (Dev)
```powershell
cd c:\Users\DELL\Desktop\OneSave\server

# Supprimer la DB locale
rm prisma\dev.db

# Recréer migrations
npm run prisma:migrate
```

### Voir Migrations
```powershell
cd c:\Users\DELL\Desktop\OneSave\server

# Liste toutes les migrations
ls prisma\migrations\

# Appliquer migrations à DB existante
npm run prisma:migrate
```

---

## 🐛 Dépannage

### Port 5000 occupé
```powershell
# Trouver et arrêter le processus
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | `
  Select-Object OwningProcess | `
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Puis relancer
npm run dev
```

### Port 3000 occupé (Frontend)
```powershell
# Trouver et arrêter
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | `
  Select-Object OwningProcess | `
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Relancer
npm start
```

### CORS Error dans Frontend
```powershell
# Vérifier que REACT_APP_API_URL est correct
cat client\.env

# Doit être:
# REACT_APP_API_URL=http://localhost:5000/api

# Relancer frontend
cd client
npm start
```

### Dependencies Broken
```powershell
# Backend
cd c:\Users\DELL\Desktop\OneSave\server
rm -r node_modules
npm install

# Frontend
cd c:\Users\DELL\Desktop\OneSave\client
rm -r node_modules
npm install

# Root
cd c:\Users\DELL\Desktop\OneSave
npm install
```

### Build fails
```powershell
# Frontend
cd c:\Users\DELL\Desktop\OneSave\client
npm run build
# Si erreur, voir console pour details

# Backend
cd c:\Users\DELL\Desktop\OneSave\server
npm run build
# Si erreur TypeScript, voir logs
```

---

## 📁 Navigation & Fichiers Importants

### Ouvrir dans VSCode
```powershell
cd c:\Users\DELL\Desktop\OneSave
code .

# Ou si 'code' n'est pas en PATH
"C:\Program Files\Microsoft VS Code\Code.exe" .
```

### Fichiers clés à éditer

**Frontend:**
```powershell
# Pages
code .\client\src\pages\Login.tsx
code .\client\src\pages\Dashboard.tsx
code .\client\src\pages\Projets.tsx
code .\client\src\pages\Evenements.tsx

# Services (API)
code .\client\src\services\api.ts

# Context (Auth)
code .\client\src\context\AuthContext.tsx
```

**Backend:**
```powershell
# Routes
code .\server\src\routes\auth.routes.ts
code .\server\src\routes\projet.routes.ts
code .\server\src\routes\evenement.routes.ts

# Config
code .\server\src\index.ts
code .\server\prisma\schema.prisma

# Tests
code .\server\src\__tests__\e2e\auth.e2e-spec.ts
```

**Configuration:**
```powershell
code .\server\.env
code .\client\.env
code .\DEPLOYMENT_GUIDE.md
code .\README_DEV.md
```

---

## 📦 Scripts npm par dossier

### Root (`c:\Users\DELL\Desktop\OneSave`)
```powershell
npm install                    # Install root deps
npm run dev                    # Start backend + frontend
npm run build                  # Build client
```

### Server (`server/`)
```powershell
npm run dev                    # Nodemon (watch mode)
npm run build                  # TypeScript compile
npm start                      # Run compiled dist
npm test                       # Run unit tests
npm run test:e2e               # Run E2E tests
npm run prisma:generate        # Generate Prisma client
npm run prisma:migrate         # Create/apply migrations
npm run prisma:studio          # Open Prisma Studio UI
npm run setup:db:dev           # Setup SQLite (dev)
npm run setup:db:prod          # Setup PostgreSQL (prod)
```

### Client (`client/`)
```powershell
npm start                      # Dev server (hot-reload)
npm run build                  # Production build
npm test                       # Run tests
npm run eject                  # Eject CRA (not recommended)
```

---

## 🌐 URLs & Endpoints

### Local (Development)
| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | React app |
| Backend API | http://localhost:5000/api | REST API |
| API Health | http://localhost:5000/api/health | Status check |
| Prisma Studio | http://localhost:5555 | DB UI explorer |

### Production (après déploiement)
| Service | URL |
|---------|-----|
| Frontend | https://onesave.vercel.app |
| Backend | https://onesave-backend.railway.app |
| API | https://onesave-backend.railway.app/api |

---

## 👤 Default User

**Admin (créé auto au démarrage):**
- Email: `admin@example.com`
- Mot de passe: `admin`

---

## 📚 Fichiers de Documentation

```powershell
# Liens vers les docs
code .\README.md                 # Overview général
code .\README_DEV.md             # Dev quickstart
code .\DEPLOYMENT_GUIDE.md       # ⭐ Production deployment
code .\QUICK_START.md            # Installation rapide
code .\FINAL_CHECKLIST.md        # Checklist finale
code .\docs\ARCHITECTURE.md      # Architecture technique
```

---

## 🚀 Déploiement Rapide

### Sur Railway (Backend)
```powershell
# 1. Installer Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Link project
railway link

# 4. Deploy
railway up

# 5. Run migrations
railway run "cd server && npx prisma migrate deploy"
```

### Sur Vercel (Frontend)
```powershell
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# 3. Set env var
# REACT_APP_API_URL=https://onesave-backend.railway.app/api
```

### Voir DEPLOYMENT_GUIDE.md pour le guide complet

---

## 💡 Tips Utiles

### Clear npm cache
```powershell
npm cache clean --force
```

### Voir version packages
```powershell
npm ls --depth=0                # Root
cd server && npm ls --depth=0   # Server
cd ../client && npm ls --depth=0 # Client
```

### Update packages (cautiously)
```powershell
npm update                      # Latest compatible
npm outdated                    # See what's outdated
```

### Kill all Node processes
```powershell
Get-Process node | Stop-Process -Force
```

### Voir logs détaillés
```powershell
# Backend
cd server
npm run dev -- --verbose

# Frontend
cd client
npm start -- --verbose
```

---

## 🎯 Workflow Typique de Développement

```powershell
# 1. Start backend
cd c:\Users\DELL\Desktop\OneSave\server
npm run dev
# ✅ Backend écoute sur :5000

# 2. Start frontend (NEW TERMINAL)
cd c:\Users\DELL\Desktop\OneSave\client
npm start
# ✅ Frontend sur :3000 (auto-ouvre browser)

# 3. Développer & voir changements (hot-reload)
# Éditer files → auto-reload dans navigateur

# 4. Avant de commit
cd c:\Users\DELL\Desktop\OneSave\server
npm run test:e2e          # ✅ Vérifier tests passent

npm run build              # ✅ Vérifier build TypeScript

cd ..\client
npm run build              # ✅ Vérifier build React

# 5. Commit & Push
git add .
git commit -m "Feature description"
git push origin feature-branch

# 6. Create Pull Request (GitHub)
# → Automated tests run via GitHub Actions
# → Merge when approved
```

---

## 📞 Need Help?

- **Dev issues:** Voir QUICK_START.md ou README_DEV.md
- **Deploy issues:** Voir DEPLOYMENT_GUIDE.md
- **API issues:** Test avec Postman/Insomnia ou PowerShell
- **Database issues:** Utiliser Prisma Studio (`npm run prisma:studio`)
- **General:** Vérifier FINAL_CHECKLIST.md

---

**Last updated: November 12, 2025**
**OneSave v1.0.0**
