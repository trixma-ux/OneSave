# 🎴 OneSave Quick Reference Card

**Print this or keep it open while developing!**

---

## 🚀 First 5 Minutes

```
1. Open PowerShell
2. cd C:\Users\DELL\Desktop\OneSave
3. .\scripts\dev-setup.ps1
4. Wait ~5 minutes for installation
5. Open 2 terminals when ready
```

---

## 📱 Daily Workflow

### Terminal 1 (Backend)
```powershell
cd server
npm run dev
```
✅ Runs on `http://localhost:5000`  
✅ Auto-restarts on file changes

### Terminal 2 (Frontend)
```powershell
cd client
npm start
```
✅ Runs on `http://localhost:3000`  
✅ Auto-reloads on file changes

**Then: Open** `http://localhost:3000` in browser

---

## 🔐 Test Account

| Field | Value |
|-------|-------|
| **Email** | admin@example.com |
| **Password** | AdminPassword123! |
| **Role** | Administrator |

---

## 📍 Key URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | React app (client) |
| Backend | http://localhost:5000 | Express API |
| API | http://localhost:5000/api | API endpoints |
| Database GUI | http://localhost:5555 | Prisma Studio |
| Health | http://localhost:5000/api/health | API health check |

---

## 📂 Important Files

| File | Location | Purpose |
|------|----------|---------|
| **Frontend** | `client/src/App.tsx` | Main React component |
| **Backend** | `server/src/index.ts` | Server entry point |
| **Database Schema** | `server/prisma/schema.prisma` | Data models |
| **Database** | `server/prisma/dev.db` | SQLite database |
| **.env (Backend)** | `server/.env` | Backend config |
| **.env (Frontend)** | `client/.env` | Frontend config |

---

## 🛠️ Most Common Commands

### Setup & Install
```powershell
.\scripts\dev-setup.ps1              # Auto-setup everything
npm install                          # Install root deps
cd server; npm install               # Install backend
cd client; npm install               # Install frontend
```

### Development
```powershell
cd server; npm run dev               # Start backend
cd client; npm start                 # Start frontend
cd server; npx prisma studio         # View database
```

### Building
```powershell
npm run build                        # Build both
cd server; npm run build             # Build backend only
cd client; npm run build             # Build frontend only
```

### Testing
```powershell
cd server; npm run test:e2e          # Run E2E tests
cd server; npm run test              # Run unit tests
```

### Database
```powershell
cd server; npx prisma studio              # GUI view
cd server; npx prisma migrate dev --name x  # Create migration
cd server; npx prisma migrate reset       # ⚠️ Reset DB
```

---

## 🧪 Quick Testing

### Test API Health
```powershell
Invoke-RestMethod http://localhost:5000/api/health | ConvertTo-Json
```

### Test Login
```powershell
$body = @{ email = "admin@example.com"; password = "AdminPassword123!" } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/auth/login -Method Post -ContentType "application/json" -Body $body | ConvertTo-Json
```

### Test Protected Route
```powershell
# First: Get token from login response above
$token = "YOUR_TOKEN_HERE"
Invoke-RestMethod -Uri http://localhost:5000/api/auth/me -Headers @{"Authorization"="Bearer $token"} | ConvertTo-Json
```

---

## ⚡ Quick Fixes

### Port Already In Use
```powershell
# Kill port 5000 (backend)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Kill port 3000 (frontend)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Dependencies Missing
```powershell
# Reinstall everything
npm install
cd server; npm install
cd client; npm install
```

### Build Failing
```powershell
# Clean rebuild
cd client
rm -Recurse build
npm run build
```

### Database Issues
```powershell
# Reset database (⚠️ loses all data)
cd server
npx prisma migrate reset
```

---

## 🎯 Development Checklist

Before committing:
- [ ] Code compiles without errors
- [ ] Build is successful (`npm run build`)
- [ ] Tests pass (`npm run test:e2e`)
- [ ] No console warnings
- [ ] No ESLint errors
- [ ] Tested in browser

---

## 📊 Project Structure

```
OneSave/
├── server/              ← Node.js backend (Express)
│   ├── src/
│   │   ├── index.ts    ← Main server file
│   │   ├── routes/     ← API endpoints
│   │   └── middleware/ ← Auth, CORS, etc
│   └── prisma/         ← Database
│       └── dev.db      ← SQLite file
│
├── client/              ← React frontend
│   ├── src/
│   │   ├── App.tsx     ← Main component
│   │   ├── pages/      ← Page components
│   │   └── services/   ← API calls
│   └── public/         ← Static files
│
└── docs/                ← Documentation
    ├── ARCHITECTURE.md
    ├── TECHNIQUE.md
    └── UTILISATEUR.md
```

---

## 🔄 Git Workflow

```powershell
# Make changes...

# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "describe what changed"

# Push to main (triggers deployment)
git push origin main
```

---

## 🚀 Deployment Reminder

### Before Deploying to Production
1. ✅ Run all tests: `npm run test:e2e`
2. ✅ Build succeeds: `npm run build`
3. ✅ No console errors
4. ✅ Tested on localhost
5. ✅ Read DEPLOYMENT_GUIDE.md

### Production URLs (After Deploy)
- **Frontend:** https://your-vercel-domain.vercel.app
- **Backend:** https://your-railway-domain.up.railway.app
- **API:** https://your-railway-domain.up.railway.app/api

---

## 📞 Documentation Links

| Need Help? | Read | Time |
|------------|------|------|
| Just starting? | START_HERE.md | 5 min |
| Setup issues? | README_DEV.md | 15 min |
| Want to deploy? | DEPLOYMENT_GUIDE.md | 30 min |
| All commands? | ESSENTIAL_COMMANDS.md | 10 min |
| Need to validate? | VALIDATION.md | 20 min |
| More details? | docs/TECHNIQUE.md | 1 hour |

---

## 🆘 When Things Break

1. **Check logs first**
   - Backend terminal output
   - Browser console (F12)
   - Railway/Vercel logs

2. **Restart everything**
   ```powershell
   # Kill all processes
   Get-Process node | Stop-Process
   
   # Start fresh
   cd server; npm run dev    # Terminal 1
   cd client; npm start      # Terminal 2
   ```

3. **Read the error message carefully**
   - Scroll up to find the actual error
   - Google the error message
   - Check documentation

4. **Ask for help**
   - Include full error message
   - Mention what you were doing
   - Include screenshots if needed

---

## 💾 Important Database Info

- **Dev Database:** `server/prisma/dev.db` (SQLite)
- **Size:** ~1-5 MB (varies with data)
- **Backup:** `Copy-Item server/prisma/dev.db server/prisma/dev.db.backup`
- **GUI:** `cd server; npx prisma studio`
- **Reset:** `npx prisma migrate reset` (⚠️ deletes all data)

---

## 🔐 Security Reminders

- ✅ Never commit `.env` files (use `.env.example`)
- ✅ Never hardcode secrets in code
- ✅ Passwords are hashed with bcryptjs
- ✅ Tokens expire after 7 days
- ✅ Use HTTPS in production (Vercel/Railway do this)

---

## 📈 Performance Notes

- **API Target:** <200ms response time
- **Frontend Target:** <3 seconds load
- **Build Size:** ~150KB (gzipped)
- **Database:** SQLite for dev, PostgreSQL for prod
- **Memory:** ~100-200MB for backend, ~200-300MB for frontend

---

## 📅 Common Timeframes

| Activity | Time | Notes |
|----------|------|-------|
| **Setup** | 5-10 min | First time only |
| **Development** | 1+ hours | Depends on feature |
| **Build** | 1-2 min | Both frontend & backend |
| **Testing** | 2-3 min | E2E tests |
| **Deployment** | 5-10 min | Auto via GitHub Actions |

---

## 🎓 Learning Path

```
Day 1: Setup + explore
  └─ Run setup script
  └─ Start frontend/backend
  └─ Login as admin
  └─ Click around and explore

Day 2: Make your first feature
  └─ Read ARCHITECTURE.md
  └─ Pick a small feature
  └─ Make changes
  └─ Test locally
  └─ Commit & push

Day 3: Deploy to production
  └─ Read DEPLOYMENT_GUIDE.md
  └─ Create Railway account
  └─ Create Vercel account
  └─ Setup GitHub Secrets
  └─ Push to main
  └─ Watch it deploy!
```

---

## ✨ Quick Tips

1. **Use VSCode** - Install recommended extensions
2. **Keep terminals open** - Easy to see logs
3. **Read error messages** - They tell you what's wrong
4. **Test as you code** - Don't wait until the end
5. **Commit often** - Easier to rollback if needed
6. **Use Prisma Studio** - GUI view of database
7. **Check localhost URLs** - Bookmark them
8. **Read the docs** - Most answers are there

---

**Print This! 🖨️ | Bookmark This! 🔖 | Share This! ✉️**

Last Updated: November 12, 2025  
Version: 1.0  
Status: ✅ Production Ready
