# 🎯 OneSave Essential Commands

**For the impatient developer: All commands you need in one place.**

---

## 🚀 Get Started (First Time)

### Fastest Way (Automated)
```powershell
# One-liner to setup everything
.\scripts\dev-setup.ps1
```

**What it does:**
- ✅ Installs Node.js (if missing)
- ✅ Installs all dependencies
- ✅ Creates .env files
- ✅ Initializes database
- ✅ Shows you what to do next

---

## 💻 Development (Daily Use)

### Start Backend
```powershell
cd server
npm run dev
# Runs on http://localhost:5000
# Auto-restarts on file changes
```

### Start Frontend
```powershell
cd client
npm start
# Runs on http://localhost:3000
# Auto-reloads on file changes
```

### Best Practice: Open 2 Terminals
```powershell
# Terminal 1:
cd server; npm run dev

# Terminal 2:
cd client; npm start

# Terminal 3 (optional - for db operations):
cd server; npx prisma studio
```

---

## 🏗️ Building

### Build Backend
```powershell
cd server
npm run build
# Creates: server/dist/
```

### Build Frontend
```powershell
cd client
npm run build
# Creates: client/build/
# Size: ~150KB gzipped
```

### Build Both
```powershell
npm run build     # From root
# Builds server, then client
```

---

## 🧪 Testing

### Run E2E Tests
```powershell
cd server
npm run test:e2e
# Runs authentication tests
# Creates test.db temporarily
```

### Run Unit Tests (When Available)
```powershell
cd server
npm run test
```

### Watch Mode (During Development)
```powershell
cd server
npm run test:e2e -- --watch
```

---

## 🗄️ Database

### View Database GUI
```powershell
cd server
npx prisma studio
# Opens browser to http://localhost:5555
# Can view/edit data visually
```

### Create Migration (After Schema Changes)
```powershell
cd server
npx prisma migrate dev --name describe_your_change
# Example: npx prisma migrate dev --name add_user_roles
```

### Apply Migration to Production
```powershell
# Set environment first:
$env:DATABASE_URL = "postgresql://user:pass@host/dbname"
$env:NODE_ENV = "production"

# Then apply:
cd server
npx prisma migrate deploy
```

### Reset Database (Development Only!)
```powershell
cd server
npx prisma migrate reset
# ⚠️ WARNING: Deletes all data!
# Only use in development
```

### View Database File Location
```powershell
Get-ChildItem server/prisma/dev.db
# Shows: C:\Users\...\OneSave\server\prisma\dev.db
```

---

## 📦 Dependencies

### Install All Dependencies
```powershell
npm install        # Root packages
cd server; npm install     # Backend packages
cd client; npm install     # Frontend packages
```

### Install Single Package (Backend)
```powershell
cd server
npm install package-name
```

### Install Single Package (Frontend)
```powershell
cd client
npm install package-name
```

### Check for Vulnerabilities
```powershell
npm audit
cd server; npm audit
cd client; npm audit
```

### Update Dependencies (Careful!)
```powershell
cd server
npm update
npm outdated    # See what can be updated
```

---

## 🔗 API Testing (Without Frontend)

### Health Check
```powershell
Invoke-RestMethod http://localhost:5000/api/health | ConvertTo-Json
```

### Register User
```powershell
$body = @{
    email = "testuser@example.com"
    password = "TestPassword123!"
    nomComplet = "Test User"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri http://localhost:5000/api/auth/register `
    -Method Post `
    -ContentType "application/json" `
    -Body $body | ConvertTo-Json
```

### Login User
```powershell
$body = @{
    email = "admin@example.com"
    password = "AdminPassword123!"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri http://localhost:5000/api/auth/login `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

$token = $response.token
"Token: $token"
```

### Get Current User (Needs Token)
```powershell
$token = "YOUR_TOKEN_HERE"  # From login above

Invoke-RestMethod `
    -Uri http://localhost:5000/api/auth/me `
    -Headers @{ "Authorization" = "Bearer $token" } | ConvertTo-Json
```

### List All Projects
```powershell
$token = "YOUR_TOKEN_HERE"

Invoke-RestMethod `
    -Uri http://localhost:5000/api/projects `
    -Headers @{ "Authorization" = "Bearer $token" } | ConvertTo-Json
```

---

## 🐛 Debugging

### Check What's Running
```powershell
netstat -ano | findstr :5000    # Backend port
netstat -ano | findstr :3000    # Frontend port
```

### Kill Process on Port
```powershell
# Kill backend
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Kill frontend
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### View Backend Logs
```powershell
cd server
npm run dev 2>&1 | Tee-Object backend.log
# Runs backend and saves logs to backend.log
```

### View Frontend Logs
```powershell
cd client
npm start 2>&1 | Tee-Object frontend.log
```

### Check Environment Variables
```powershell
# View .env file
Get-Content server/.env

# View specific variable
$env:NODE_ENV
$env:DATABASE_URL
```

---

## 📁 File Operations

### View Project Structure
```powershell
tree /F          # Full tree (Windows)
ls -Recurse      # All files (PowerShell)
```

### Find Files
```powershell
Get-ChildItem -Recurse -Filter "*.tsx"        # All React components
Get-ChildItem -Recurse -Filter "*.ts" | ? {$_.FullName -notlike "*node_modules*"}
```

### View File Size
```powershell
Get-ChildItem server/prisma/dev.db | Format-Table Name, @{Name="Size(MB)";Expression={$_.Length/1MB}}
```

### Backup Database
```powershell
Copy-Item server/prisma/dev.db server/prisma/dev.db.backup
"Database backed up!"
```

---

## 🚀 Deployment

### Deploy to Railway (Backend)
```powershell
# Requires: railway.app account + RAILWAY_TOKEN

cd server

# Login to Railway
railway login

# Deploy
railway up
```

### Deploy to Vercel (Frontend)
```powershell
# Requires: vercel.com account + Vercel CLI

cd client

# Login to Vercel
vercel login

# Deploy
vercel
```

### Automatic Deployment (GitHub Actions)
```powershell
# Just push to main branch
git add .
git commit -m "my changes"
git push origin main

# GitHub Actions automatically:
# 1. Runs tests
# 2. Builds backend & frontend
# 3. Deploys to Railway & Vercel
```

---

## 🧹 Cleanup & Maintenance

### Clear Node Modules (Free Space)
```powershell
# Remove all node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force server/node_modules
Remove-Item -Recurse -Force client/node_modules

# Reinstall when ready
npm install
```

### Clear Build Artifacts
```powershell
# Remove builds
Remove-Item -Recurse -Force server/dist
Remove-Item -Recurse -Force client/build
```

### Reset Everything to Clean State
```powershell
# ⚠️ WARNING: This deletes everything!
# Only do if you need a fresh start

Remove-Item -Recurse -Force node_modules, server/node_modules, client/node_modules
Remove-Item -Recurse -Force server/dist, client/build
Remove-Item -Force server/prisma/dev.db

npm install
# Then: cd server; npm install
# Then: cd client; npm install
```

---

## 📊 Useful Information

### Check Node/npm Versions
```powershell
node --version      # Should be ≥16.x (ideally 18+ or 20+)
npm --version       # Should be ≥8.x
npx --version       # Should work
```

### View npm Scripts Available
```powershell
# Root
npm run        # List all available scripts

# Backend
cd server; npm run

# Frontend
cd client; npm run
```

### Check Installed Packages
```powershell
npm list --depth=0              # Root packages
cd server; npm list --depth=0
cd client; npm list --depth=0
```

---

## 🎯 Cheat Sheet (Quickest Reference)

| Task | Command |
|------|---------|
| **Setup** | `.\scripts\dev-setup.ps1` |
| **Start backend** | `cd server; npm run dev` |
| **Start frontend** | `cd client; npm start` |
| **Run tests** | `cd server; npm run test:e2e` |
| **View database** | `cd server; npx prisma studio` |
| **Build all** | `npm run build` |
| **Deploy** | Push to main → GitHub Actions |
| **Kill port 5000** | `Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess \| Stop-Process` |
| **Check health** | `Invoke-RestMethod http://localhost:5000/api/health` |

---

## 🔥 Pro Tips

### Tip 1: Use Multiple Terminals
```powershell
# Keep 3 terminals open during development:
# Terminal 1: Backend (npm run dev)
# Terminal 2: Frontend (npm start)  
# Terminal 3: Database (npx prisma studio) OR Git
```

### Tip 2: Auto-Format Code
```powershell
# Before committing, format your code:
cd client
npm run build   # Catches TypeScript errors
```

### Tip 3: Check Logs Regularly
```powershell
# During development, always check:
# - Browser console (F12)
# - Backend terminal output
# - Network tab (F12 → Network)
```

### Tip 4: Use Environment Variables
```powershell
# Never hardcode API URLs, use:
$env:REACT_APP_API_URL = "http://localhost:5000"

# Or create .env file:
# REACT_APP_API_URL=http://localhost:5000
```

### Tip 5: Backup Before Major Changes
```powershell
# Before big refactors:
git commit -am "before-refactor"
Copy-Item server/prisma/dev.db server/prisma/dev.db.backup
```

---

## ❓ Frequently Used Commands by Scenario

### "I just cloned the project"
```powershell
.\scripts\dev-setup.ps1
```

### "I changed something in the database schema"
```powershell
cd server
npx prisma migrate dev --name my_change
```

### "Tests are failing"
```powershell
cd server
npm run test:e2e -- --verbose
# Check output for specific errors
```

### "Port 5000 is already in use"
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

### "Frontend won't build"
```powershell
cd client
npm run build
# Scroll up to find the actual error message
```

### "Something is very broken"
```powershell
# Nuclear option (resets everything):
Remove-Item -Recurse -Force node_modules, server/node_modules, client/node_modules, server/dist, client/build, server/prisma/dev.db
npm install; cd server; npm install; cd ../client; npm install
# Then: cd server; npm install; cd ../server; npx prisma migrate dev
```

---

**Last Updated:** November 12, 2025  
**Version:** 1.0  
**Status:** ✅ Ready for daily use

💡 **Bookmark this page!** You'll need it often. 📌
