# 📚 OneSave Documentation Index

## 🚀 START HERE

👉 **[START_HERE.md](./START_HERE.md)** - Read this first! Visual overview + quick start

---

## 📖 Documentation par Phase

### Phase 1: Premier Démarrage
| Document | Contenu | Quand ? |
|----------|---------|---------|
| **START_HERE.md** | Overview visuel du projet | 👈 Commencez ici |
| **README.md** | Description générale & features | Premier contact |
| **README_DEV.md** | Dev quickstart (5 min setup) | Avant de coder |
| **QUICK_START.md** | Installation détaillée étape-par-étape | Si problèmes setup |

### Phase 2: Développement Local
| Document | Contenu | Quand ? |
|----------|---------|---------|
| **README_DEV.md** | Commandes, structure, API endpoints | Pendant le dev |
| **POWERSHELL_COMMANDS.md** | Reference de toutes les commandes PS1 | Lookup rapide |
| **docs/ARCHITECTURE.md** | Architecture technique | Compréhension système |
| **docs/TECHNIQUE.md** | Details techniques détaillés | Deep dive |

### Phase 3: Production & Déploiement
| Document | Contenu | Quand ? |
|----------|---------|---------|
| **DEPLOYMENT_GUIDE.md** ⭐ | Guide complet Railway + Vercel | 👈 **Avant de déployer** |
| **FINAL_CHECKLIST.md** | Checklist de déploiement & next steps | Final review |
| **docs/UTILISATEUR.md** | Guide utilisateur (EN FRANÇAIS) | Formation users |

---

## 🎯 Quick Reference by Role

### 👨‍💻 Developer (Dev Local)
1. **START_HERE.md** → Get oriented
2. **README_DEV.md** → Setup local
3. **POWERSHELL_COMMANDS.md** → Command reference
4. **docs/ARCHITECTURE.md** → Understand codebase

### 🚀 DevOps/Deployment Engineer
1. **DEPLOYMENT_GUIDE.md** → Production setup
2. **FINAL_CHECKLIST.md** → Pre-deploy checklist
3. **.github/workflows/ci-cd.yml** → GitHub Actions config

### 👥 Product Manager / Stakeholder
1. **README.md** → Project overview
2. **START_HERE.md** → Visual summary
3. **docs/UTILISATEUR.md** → User guide (FR)

### 🏫 Trainer / Documentation Manager
1. **docs/UTILISATEUR.md** → User guide
2. **README.md** → Features overview
3. **QUICK_START.md** → Training materials

---

## 📋 File Structure

```
OneSave/
│
├── 📚 DOCUMENTATION (You are here)
│   ├── START_HERE.md ⭐          ← Begin here (visual guide)
│   ├── README.md                 ← Project overview
│   ├── README_DEV.md             ← Dev quickstart
│   ├── QUICK_START.md            ← Installation guide
│   ├── DEPLOYMENT_GUIDE.md ⭐   ← Production setup (MUST READ)
│   ├── FINAL_CHECKLIST.md        ← Completion & next steps
│   ├── POWERSHELL_COMMANDS.md    ← Command reference
│   ├── INSTALLATION.md           ← Detailed installation
│   ├── CHANGELOG.md              ← Version history
│   └── LICENSE                   ← MIT License
│
├── 📖 EXTENDED DOCS
│   ├── docs/ARCHITECTURE.md      ← System architecture
│   ├── docs/TECHNIQUE.md         ← Technical details
│   ├── docs/UTILISATEUR.md       ← User guide (FR)
│   └── docs/index.md             ← Docs index
│
├── 💻 SOURCE CODE
│   ├── server/                   ← Backend (Node.js + Express)
│   │   ├── src/
│   │   ├── prisma/               ← Database schema & migrations
│   │   ├── jest.config.js        ← Testing config
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── client/                   ← Frontend (React)
│   │   ├── src/
│   │   ├── public/               ← Static assets
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── scripts/                  ← Build & setup scripts
│       ├── install.ps1
│       ├── dev-setup.ps1 ⭐
│       └── backup.ps1
│
├── ⚙️  CONFIGURATION
│   ├── .env.example              ← Environment template
│   ├── .gitignore                ← Git ignore rules
│   ├── .github/
│   │   └── workflows/
│   │       └── ci-cd.yml         ← GitHub Actions
│   └── package.json              ← Root package config
│
└── 📊 PROJECT FILES
    ├── project-manifest.json     ← Project metadata
    ├── ETAPES_COMPLETEES.md      ← Completed steps (FR)
    └── SETUP_COMPLETE.md         ← Setup completion status
```

---

## 🔍 Find Info By Topic

### Setup & Installation
- **First time?** → START_HERE.md
- **Step-by-step?** → QUICK_START.md
- **Dev setup?** → README_DEV.md
- **PowerShell commands?** → POWERSHELL_COMMANDS.md

### Development
- **Architecture?** → docs/ARCHITECTURE.md
- **Technical details?** → docs/TECHNIQUE.md
- **API endpoints?** → README_DEV.md
- **Code structure?** → docs/ARCHITECTURE.md

### Deployment
- **Production setup?** → **DEPLOYMENT_GUIDE.md** ⭐
- **Before deploying?** → FINAL_CHECKLIST.md
- **CI/CD config?** → .github/workflows/ci-cd.yml
- **Database setup?** → DEPLOYMENT_GUIDE.md (Migration section)

### User Guide
- **For end users?** → docs/UTILISATEUR.md (French)
- **Features list?** → README.md
- **Getting started?** → START_HERE.md

### Troubleshooting
- **Having issues?** → POWERSHELL_COMMANDS.md (Troubleshooting section)
- **Build errors?** → README_DEV.md (Troubleshooting)
- **Deploy problems?** → DEPLOYMENT_GUIDE.md (Troubleshooting)

---

## 📌 Most Important Documents

### 🔴 MUST READ (In Order)
1. **START_HERE.md** - Get oriented (5 min)
2. **README_DEV.md** - Setup locally (15 min)
3. **DEPLOYMENT_GUIDE.md** - Production setup (30 min before deploy)

### 🟡 SHOULD READ
4. **FINAL_CHECKLIST.md** - Before going live
5. **docs/ARCHITECTURE.md** - Understanding the system
6. **docs/UTILISATEUR.md** - User training

### 🟢 REFERENCE (As Needed)
7. **POWERSHELL_COMMANDS.md** - Command lookup
8. **docs/TECHNIQUE.md** - Deep technical details
9. **README.md** - Feature overview

---

## 🎓 Learning Path

### For Developers (2-3 hours)
```
1. START_HERE.md (5 min) → Understand project
   ↓
2. README_DEV.md (15 min) → Local setup
   ↓
3. Run .\scripts\dev-setup.ps1 (10 min) → Install & setup
   ↓
4. docs/ARCHITECTURE.md (30 min) → Code structure
   ↓
5. Explore codebase (1 hour) → Hands-on
   ↓
6. Write first feature! 🚀
```

### For DevOps/Deployment (1-2 hours)
```
1. START_HERE.md (5 min) → Overview
   ↓
2. DEPLOYMENT_GUIDE.md (1 hour) → Production setup
   ↓
3. .github/workflows/ci-cd.yml (15 min) → CI/CD config
   ↓
4. FINAL_CHECKLIST.md (10 min) → Pre-flight
   ↓
5. Deploy! 🚀
```

### For Users (30 min)
```
1. START_HERE.md (5 min) → What is OneSave?
   ↓
2. docs/UTILISATEUR.md (20 min) → How to use
   ↓
3. Get training from admin → Live walkthrough
   ↓
4. Start using! 📊
```

---

## 🔗 Quick Links

| Need | Link |
|------|------|
| **Get Started** | [START_HERE.md](./START_HERE.md) |
| **Read First** | [README.md](./README.md) |
| **Setup Dev** | [README_DEV.md](./README_DEV.md) |
| **Deploy** | [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) ⭐ |
| **Troubleshoot** | [POWERSHELL_COMMANDS.md](./POWERSHELL_COMMANDS.md) |
| **User Guide** | [docs/UTILISATEUR.md](./docs/UTILISATEUR.md) |
| **Architecture** | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| **Tech Details** | [docs/TECHNIQUE.md](./docs/TECHNIQUE.md) |
| **Features** | [README.md](./README.md) |
| **Changelog** | [CHANGELOG.md](./CHANGELOG.md) |
| **License** | [LICENSE](./LICENSE) |

---

## 🚀 Ready to Start?

1. **👉 Open:** [START_HERE.md](./START_HERE.md)
2. **Then:** [README_DEV.md](./README_DEV.md)
3. **Run:** `.\scripts\dev-setup.ps1`
4. **Build:** Your first feature! 💻

---

## 📞 Questions?

- **Setup issues?** → QUICK_START.md or README_DEV.md
- **Dev questions?** → docs/ARCHITECTURE.md or docs/TECHNIQUE.md
- **Deploy help?** → DEPLOYMENT_GUIDE.md
- **Using app?** → docs/UTILISATEUR.md
- **Other?** → Check POWERSHELL_COMMANDS.md troubleshooting

---

**Last Updated:** November 12, 2025  
**OneSave Version:** 1.0.0  
**Status:** ✅ Production Ready
