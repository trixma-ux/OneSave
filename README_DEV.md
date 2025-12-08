# OneSave - Application de Gestion de Projets CNF
**v1.0.0 - Production Ready** ✅

Application web locale, sécurisée et collaborative pour la gestion des projets, planification des rencontres et collaboration entre la CNF, l'OIF et ses partenaires (CLAC, IFADEM, GAF).

## 🎯 Features

- ✅ **Gestion complète des projets** (création, suivi, clôture)
- ✅ **Planification des rencontres** et événements
- ✅ **Génération de rapports** statistiques
- ✅ **Notifications automatiques** pour échéances
- ✅ **Personnalisation** (modules CLAC, IFADEM, GAF)
- ✅ **Mode hors ligne** (PWA)
- ✅ **Authentification sécurisée** (JWT + bcrypt)
- ✅ **Interface 100% en français**
- ✅ **Admin dashboard** (utilisateur initial: admin/admin)

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- React Router v6
- Tailwind CSS
- Chart.js pour graphiques
- Workbox PWA

### Backend
- Node.js 18+ / Express
- TypeScript
- Prisma ORM
- SQLite (dev) / PostgreSQL (prod)
- JWT + bcryptjs sécurité

## ⚡ Démarrage Rapide (Dev)

### Prérequis
```bash
node --version  # v18+
npm --version   # v9+
git --version
```

### Installation

```powershell
# 1. Clone repo
git clone https://github.com/votre-username/OneSave.git
cd OneSave

# 2. Install all deps
npm install
cd server && npm install
cd ../client && npm install
cd ..

# 3. Setup .env files
# server/.env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="dev_secret_change_in_production"
PORT=5000
NODE_ENV=development

# client/.env
REACT_APP_API_URL=http://localhost:5000/api

# 4. Initialize database
cd server
npm run prisma:migrate
cd ..
```

### Démarrer l'app

**Terminal 1 - Backend (API)**
```powershell
cd server
npm run dev
# 🚀 Écoute sur http://localhost:5000
# 📊 Prisma Studio: http://localhost:5555
```

**Terminal 2 - Frontend (React)**
```powershell
cd client
npm start
# 🌐 Auto-ouvre http://localhost:3000
```

### Se connecter

**Admin par défaut :**
- Email: `admin@example.com`
- Mot de passe: `admin`

**Créer nouveau compte :** Inscription sur la page login

## 📦 Commands

### Backend (`cd server`)
```bash
npm run dev              # Start with nodemon (watch)
npm run build            # Build TypeScript
npm start                # Run production build
npm test                 # Run unit tests
npm run test:e2e         # Run E2E tests (registration + login)
npm run prisma:studio    # Open Prisma Studio (DB explorer)
npm run setup:db:dev     # Setup SQLite (dev)
npm run setup:db:prod    # Setup PostgreSQL (prod)
```

### Frontend (`cd client`)
```bash
npm start                # Start dev server (hot-reload)
npm run build            # Build for production
npm test                 # Run tests
npm run eject            # Eject from Create React App (irreversible!)
```

### Root
```bash
npm run dev              # Start backend + frontend (from root)
npm run build            # Build client
```

## 📁 Project Structure

```
OneSave/
├── server/              # Backend (Node.js + Express)
│   ├── src/
│   │   ├── index.ts     # Entry point
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth middleware
│   │   ├── utils/       # Helpers (admin init, notifications)
│   │   └── __tests__/   # E2E tests
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # DB migrations
│   └── package.json
│
├── client/              # Frontend (React)
│   ├── src/
│   │   ├── pages/       # Pages (Login, Dashboard, etc)
│   │   ├── components/  # Reusable components
│   │   ├── context/     # AuthContext
│   │   ├── services/    # API client (axios)
│   │   └── index.tsx    # Entry point
│   ├── public/          # Static assets
│   └── package.json
│
├── docs/                # Documentation
├── scripts/             # Build/setup scripts
├── .github/workflows/   # GitHub Actions CI/CD
│
└── DEPLOYMENT_GUIDE.md  # 👈 Production deployment guide
```

## 🗄️ Database

### Development
- **Type:** SQLite 3
- **File:** `server/prisma/dev.db`
- **Auto-created:** On first `npm run prisma:migrate`
- **Persisted:** Git-ignored (local only)

### Production
- **Type:** PostgreSQL 14+
- **Hosted:** Railway (or Render, Supabase)
- **Connection:** Via `DATABASE_URL` env var
- **Migrations:** Applied on deploy

### Prisma Studio (DB UI)

```bash
cd server
npm run prisma:studio
# Opens http://localhost:5555 with DB explorer
```

## 🔐 Security

| Feature | Implementation |
|---------|---|
| **Passwords** | bcryptjs (10 rounds salt) |
| **Auth** | JWT (7-day expiry) |
| **CORS** | Enabled (configurable) |
| **Admin** | Role-based (admin/utilisateur) |
| **Validation** | Zod schemas |

## 🧪 Testing

### Unit + Integration
```bash
cd server
npm test
```

### E2E (Auth flow)
```bash
cd server
npm run test:e2e
# Tests: registration, login, token, /me endpoint
```

### Manual API Test
```powershell
# Health check
Invoke-RestMethod http://localhost:5000/api/health | ConvertTo-Json

# Register
$body = @{nom='Test';email='test@test.com';motDePasse='pass123'} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/auth/register `
  -Method Post -Body $body -ContentType 'application/json'
```

## 🚀 Production Deployment

### Recommended Stack (FREE)

| Component | Service | Plan |
|---|---|---|
| Frontend | **Vercel** | Hobby (free) |
| Backend | **Railway** | Starter ($5/mo after credits) |
| Database | **Railway PostgreSQL** | Included |
| CI/CD | **GitHub Actions** | Free tier |

### Quick Start Deployment

1. **Backend → Railway**
   ```bash
   # See DEPLOYMENT_GUIDE.md → Configuration Railway (Backend)
   ```

2. **Frontend → Vercel**
   ```bash
   # See DEPLOYMENT_GUIDE.md → Configuration Vercel (Frontend)
   ```

3. **CI/CD → GitHub Actions**
   ```bash
   # Workflows already configured in .github/workflows/ci-cd.yml
   # Add Railway + Vercel tokens to repo Secrets
   ```

**Full guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🐛 Troubleshooting

### Port already in use
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS errors
- Check `REACT_APP_API_URL` in `client/.env`
- Verify backend CORS is enabled (`cors()` in `index.ts`)

### Database issues
```powershell
cd server
rm prisma/dev.db
npm run prisma:migrate
```

### Tests failing
```powershell
cd server
rm -r node_modules
npm ci
npm run test
```

## 📚 Documentation

- [README.md](./README.md) - Project overview
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - **⭐ Production deployment**
- [QUICK_START.md](./QUICK_START.md) - Quickstart guide
- [INSTALLATION.md](./INSTALLATION.md) - Detailed setup
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Technical architecture
- [docs/UTILISATEUR.md](./docs/UTILISATEUR.md) - User guide (FR)

## 🤝 Contributing

1. Fork repo
2. Create feature branch (`git checkout -b feature/amazing-thing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-thing`)
5. Open Pull Request

**Code style:**
- TypeScript strict mode
- ESLint + Prettier (auto-format)
- Commit messages in French or English

## 📋 Known Issues

None currently tracked. Please report via GitHub Issues.

## 📞 Support

- **Docs:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Issues:** [GitHub Issues](https://github.com/votre-username/OneSave/issues)
- **Email:** support@onesave.ci

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

---

**OneSave v1.0.0** | Made with ❤️ for CNF Côte d'Ivoire | November 2025

### Quick Links
- 🌐 [Live Demo](https://onesave.vercel.app) (Staging)
- 🔗 [GitHub](https://github.com/votre-username/OneSave)
- 📖 [Docs](./DEPLOYMENT_GUIDE.md)
- 🚀 [Deploy Now](./DEPLOYMENT_GUIDE.md#déploiement-en-production)
