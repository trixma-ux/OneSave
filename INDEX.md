# 🎯 OneSave - Your Complete Setup

Welcome to **OneSave**! 👋

This file will guide you through everything you need to know.

---

## ⚡ First Time? Start Here!

### Option 1: Automatic Setup (Recommended) ⭐
```powershell
.\scripts\dev-setup.ps1
```
This script will:
- ✅ Check Node.js is installed
- ✅ Install all dependencies
- ✅ Setup environment files
- ✅ Initialize database
- ✅ Show you what to do next

**Time:** ~5-10 minutes  
**Difficulty:** Easy ✅

---

### Option 2: Manual Setup
If the script fails, follow these steps:

1. **Install dependencies**
   ```powershell
   npm install
   cd server; npm install
   cd client; npm install
   ```

2. **Setup environment files**
   ```powershell
   # Copy templates (they're already there with defaults)
   # Just make sure .env files exist in server/ and client/
   ```

3. **Initialize database**
   ```powershell
   cd server
   npx prisma migrate dev --name initial-schema
   ```

4. **Continue to next section →**

---

## 🚀 Start Developing

### Open 2 Terminals

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
# Waits for: http://localhost:5000/api/health
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm start
# Browser will open to: http://localhost:3000
```

### Login
- **Email:** admin@example.com
- **Password:** AdminPassword123!

---

## 📚 Documentation Overview

### Quick Start Guides
| File | Purpose | Read Time |
|------|---------|-----------|
| **[START_HERE.md](./START_HERE.md)** | Visual overview of project | 5 min |
| **[README.md](./README.md)** | Full project description | 10 min |
| **[QUICK_REF.md](./QUICK_REF.md)** | Cheat sheet (bookmark this!) | 3 min |
| **[ESSENTIAL_COMMANDS.md](./ESSENTIAL_COMMANDS.md)** | All commands reference | 5 min |

### Developer Guides
| File | Purpose | Read Time |
|------|---------|-----------|
| **[README_DEV.md](./README_DEV.md)** | Developer quickstart | 15 min |
| **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | System architecture | 20 min |
| **[docs/TECHNIQUE.md](./docs/TECHNIQUE.md)** | Technical details | 30 min |

### Deployment & Operations
| File | Purpose | Read Time |
|------|---------|-----------|
| **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** ⭐ | Deploy to Railway + Vercel | 30 min |
| **[VALIDATION.md](./VALIDATION.md)** | Validate after deployment | 15 min |
| **[FINAL_CHECKLIST.md](./FINAL_CHECKLIST.md)** | Completion checklist | 5 min |

### Other Resources
| File | Purpose |
|------|---------|
| **[DOCUMENTATION.md](./DOCUMENTATION.md)** | Complete doc index |
| **[POWERSHELL_COMMANDS.md](./POWERSHELL_COMMANDS.md)** | PowerShell reference |
| **[docs/UTILISATEUR.md](./docs/UTILISATEUR.md)** | User guide (French) |

---

## 🎓 Learning Paths

### Path 1: First Development Session (2 hours)
```
1. Read: START_HERE.md (5 min)
2. Run: .\scripts\dev-setup.ps1 (10 min)
3. Read: README_DEV.md (15 min)
4. Explore: Run the app locally (10 min)
5. Read: docs/ARCHITECTURE.md (30 min)
6. Code: Make your first change (45 min)
```

### Path 2: Deploy to Production (1-2 hours)
```
1. Ensure: npm run test:e2e passes
2. Ensure: npm run build succeeds
3. Read: DEPLOYMENT_GUIDE.md (must read!)
4. Create: Railway account + PostgreSQL
5. Create: Vercel account
6. Setup: GitHub Secrets
7. Deploy: Push to main branch
8. Validate: Run VALIDATION.md checklist
```

### Path 3: Deep Dive (3-4 hours)
```
1. Read: docs/ARCHITECTURE.md (30 min)
2. Read: docs/TECHNIQUE.md (45 min)
3. Explore: Browse server/src (30 min)
4. Explore: Browse client/src (30 min)
5. Experiment: Make changes & see what breaks
6. Test: Run npm run test:e2e
7. Deploy: Try deploying locally (30 min)
```

---

## 🔥 Most Important Commands

```powershell
# Setup (first time)
.\scripts\dev-setup.ps1

# Daily development
cd server; npm run dev              # Terminal 1
cd client; npm start                # Terminal 2

# Build for production
npm run build                       # Builds both

# Testing
cd server; npm run test:e2e         # Run all tests

# Database management
cd server; npx prisma studio        # Open database GUI

# Deployment
git push origin main                # Triggers GitHub Actions
```

**⭐ Bookmark [QUICK_REF.md](./QUICK_REF.md) for daily reference!**

---

## 🌐 Important URLs

### Development (Local)
| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:3000 | React app |
| Backend | http://localhost:5000 | Express API |
| Database | http://localhost:5555 | Prisma Studio |
| API Health | http://localhost:5000/api/health | Test endpoint |

### Production (After Deploy)
| Service | URL | Platform |
|---------|-----|----------|
| Frontend | https://your-domain.vercel.app | Vercel |
| Backend | https://your-domain.up.railway.app | Railway |

---

## 🏗️ Project Structure

```
OneSave/
│
├── 📚 Documentation (Start here!)
│   ├── INDEX.md                  ← You are here
│   ├── START_HERE.md             ← Visual guide
│   ├── README.md                 ← Overview
│   ├── QUICK_REF.md              ← Quick reference ⭐
│   ├── ESSENTIAL_COMMANDS.md     ← All commands
│   ├── DEPLOYMENT_GUIDE.md       ← Deploy to prod
│   └── [more docs...]
│
├── 💻 Server (Node.js + Express)
│   ├── src/
│   │   ├── index.ts              ← Start here
│   │   ├── routes/               ← API endpoints
│   │   └── middleware/           ← Auth, etc
│   ├── prisma/
│   │   ├── schema.prisma         ← Database schema
│   │   └── dev.db                ← SQLite database
│   └── package.json              ← Dependencies
│
├── ⚛️  Client (React + TypeScript)
│   ├── src/
│   │   ├── App.tsx               ← Main component
│   │   ├── pages/                ← Page screens
│   │   ├── components/           ← Reusable components
│   │   └── services/             ← API client
│   ├── public/                   ← Static files
│   └── package.json              ← Dependencies
│
├── ⚙️  Configuration
│   ├── .env.example              ← Env template
│   └── .github/workflows/ci-cd.yml ← Auto deploy
│
└── 📦 Other
    ├── scripts/dev-setup.ps1     ← Setup automation
    ├── package.json              ← Root config
    └── [other files...]
```

---

## 💡 Quick Tips

### Tip #1: Use 2 Terminals During Development
```powershell
# Terminal 1: Backend (keeps running, auto-restarts)
cd server; npm run dev

# Terminal 2: Frontend (keeps running, auto-reloads)
cd client; npm start

# Terminal 3 (optional): Database or Git commands
cd server; npx prisma studio
```

### Tip #2: Check Browser Console for Errors
- Press F12 in browser
- Check "Console" tab
- Most issues are obvious there

### Tip #3: Read Error Messages Carefully
- Don't panic! 😅
- Scroll up in terminal to find the error
- Copy-paste the error into Google
- Check POWERSHELL_COMMANDS.md troubleshooting

### Tip #4: Test Your Changes Locally
```powershell
# Before pushing to production:
npm run build      # Verify it builds
npm run test:e2e   # Run tests
# Then test in browser manually
```

### Tip #5: Backup Your Database
```powershell
# Before making big changes:
Copy-Item server/prisma/dev.db server/prisma/dev.db.backup
```

---

## 🚀 Ready to Code?

### Your Next Steps:

1. **👉 Open Terminal**
   ```powershell
   cd C:\Users\DELL\Desktop\OneSave
   ```

2. **Run Setup**
   ```powershell
   .\scripts\dev-setup.ps1
   ```

3. **Open 2 More Terminals**
   ```powershell
   # Terminal 1
   cd server; npm run dev
   
   # Terminal 2
   cd client; npm start
   ```

4. **Open Browser**
   - Go to http://localhost:3000
   - Login with admin@example.com / AdminPassword123!

5. **Start Coding! 🎉**

---

## 📖 Documentation Structure

**If you're looking for something specific:**

### "I'm new to this project"
→ Start with [START_HERE.md](./START_HERE.md)

### "I want to set up locally"
→ Read [README_DEV.md](./README_DEV.md)

### "I need a command"
→ Check [ESSENTIAL_COMMANDS.md](./ESSENTIAL_COMMANDS.md)

### "I want to understand the code"
→ Read [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

### "I'm ready to deploy"
→ **Must read:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### "I need quick reference"
→ Use [QUICK_REF.md](./QUICK_REF.md) (bookmark this!)

### "I need all commands"
→ Check [POWERSHELL_COMMANDS.md](./POWERSHELL_COMMANDS.md)

### "I want to validate deployment"
→ Use [VALIDATION.md](./VALIDATION.md)

---

## ❓ Frequently Asked Questions

### Q: I'm getting "port already in use" error
**A:** Kill the process using that port:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

### Q: The setup script failed
**A:** Follow the manual setup steps above, or check [README_DEV.md](./README_DEV.md)

### Q: How do I reset the database?
**A:** (⚠️ This deletes all data!)
```powershell
cd server
npx prisma migrate reset
```

### Q: How do I deploy to production?
**A:** Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) (important!)

### Q: Where's the test account?
**A:**
- Email: admin@example.com
- Password: AdminPassword123!

### Q: What's the tech stack?
**A:** Check [START_HERE.md](./START_HERE.md) or [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

### Q: How do I add a new feature?
**A:** Follow the architecture in [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 🎯 Quick Navigation

| I want to... | Go to... | Time |
|---|---|---|
| Get started | [START_HERE.md](./START_HERE.md) | 5 min |
| Setup locally | [README_DEV.md](./README_DEV.md) | 15 min |
| Find a command | [ESSENTIAL_COMMANDS.md](./ESSENTIAL_COMMANDS.md) | 3 min |
| Understand code | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | 20 min |
| Deploy to prod | [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | 30 min |
| Quick reference | [QUICK_REF.md](./QUICK_REF.md) | 2 min ⭐ |
| Check all docs | [DOCUMENTATION.md](./DOCUMENTATION.md) | 5 min |

---

## 📞 Need Help?

1. **Check the docs** - Most answers are there!
2. **Search the code** - Use Ctrl+Shift+F in VS Code
3. **Google the error** - Copy the error message
4. **Read the logs** - Terminal output tells you what's wrong
5. **Ask a colleague** - Fresh eyes help!

---

## ✅ Success Checklist

After setup, you should have:
- [ ] Node.js installed (check: `node --version`)
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can login with admin account
- [ ] Can create/view projects
- [ ] Database GUI works (http://localhost:5555)
- [ ] Tests pass (`npm run test:e2e`)

---

## 🎉 You're Ready!

Everything is set up and ready to go.

**Next step:** Open a terminal and run:
```powershell
.\scripts\dev-setup.ps1
```

**Then:** Follow the instructions on screen.

**Questions?** Check the appropriate doc above.

---

**Happy coding! 🚀**

Last Updated: November 12, 2025  
OneSave v1.0  
Status: ✅ Production Ready
