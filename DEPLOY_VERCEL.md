# 🚀 Déploiement OneSave sur Vercel (Gratuit)

## 📋 Prérequis

- Compte GitHub, GitLab ou Bitbucket
- Compte Vercel (gratuit): https://vercel.com
- Compte Railway (gratuit 5$): https://railway.app

## 🎯 Architecture de déploiement

```
┌─────────────────────┐
│   Vercel (Frontend) │  ← React App
│   onesave.vercel.app│
└──────────┬──────────┘
           │
           │ API Calls
           ▼
┌─────────────────────┐
│  Railway (Backend)  │  ← Node.js/Express
│  your-api.railway   │
│   ├─ Database       │  ← PostgreSQL
│   └─ API Routes     │
└─────────────────────┘
```

## 🚀 Déploiement rapide (5 minutes)

### 1️⃣ Créer un repo GitHub

```bash
cd /home/stevegomon/Téléchargements/OneSave

# Initialiser git si pas déjà fait
git init

# Ajouter tous les fichiers
git add .
git commit -m "OneSave - Initial commit"

# Créer un repo sur github.com puis:
git remote add origin https://github.com/VOTRE_USERNAME/OneSave.git
git branch -M main
git push -u origin main
```

### 2️⃣ Déployer le frontend sur Vercel

**Option A: Automatique (via Vercel Dashboard)**
1. Allez sur https://vercel.com/new
2. Importez votre repo GitHub `OneSave`
3. Configurez:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Cliquez sur "Deploy"

**Option B: CLI**
```bash
npm install -g vercel
vercel login
cd /home/stevegomon/Téléchargements/OneSave
vercel --prod
```

### 3️⃣ Déployer le backend sur Railway

```bash
npm install -g @railway/cli
cd server
railway login
railway init

# Ajouter PostgreSQL
railway add postgresql

# Configurer les variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# Déployer
railway up
```

**OU utiliser l'interface Railway.app:**
1. https://railway.app
2. Créer un nouveau projet
3. Importer depuis GitHub
4. Ajouter une base PostgreSQL
5. Configurer les variables d'environnement

### 4️⃣ Connecter le frontend au backend

Après déploiement du backend, vous aurez une URL Railway (ex: `https://your-api.railway.app`)

**Dans Vercel Dashboard:**
1. Allez à votre projet
2. Settings → Environment Variables
3. Ajoutez:
   ```
   REACT_APP_API_URL=https://your-api.railway.app/api
   ```
4. Redéployez (git push déclenche auto le redéploiement)

## 📊 Coûts

| Service | Plan | Coût | Notes |
|---------|------|------|-------|
| **Vercel** | Hobby | **Gratuit** ✅ | Frontend illimité |
| **Railway** | Starter | **5$/mois** | Puis $0.50 par hour |
| **PostgreSQL** | Inclus | **Gratuit** ✅ | Avec Railway |
| **Total** | - | **$5/mois** | très abordable |

## 📝 Commandes utiles

```bash
# Voir le déploiement actuel
vercel --prod

# Voir les logs Vercel
vercel logs <url>

# Redéployer
git push origin main  # Auto-redéploiement Vercel

# Voir les logs Railway
railway logs
```

## ✅ Checklist de déploiement

- [ ] Repo GitHub créé et synchronisé
- [ ] Vercel CLI installé (`npm install -g vercel`)
- [ ] Railway CLI installé (`npm install -g @railway/cli`)
- [ ] Frontend déployé sur Vercel
- [ ] Backend déployé sur Railway
- [ ] PostgreSQL configurée sur Railway
- [ ] Variables d'environnement Vercel définies
- [ ] REACT_APP_API_URL pointe vers Railway
- [ ] Tests d'authentification réussis

## 🔗 URLs finales

```
Frontend:  https://onesave.vercel.app
Backend:   https://your-api.railway.app
```

## ⚡ Optimisations supplémentaires

### Ajouter un domaine personnalisé (Vercel)
1. Settings → Domains
2. Connectez votre domaine
3. Configurez les DNS

### Configurer CORS (Backend)
Modifiez `server/src/index.ts`:
```typescript
app.use(cors({
  origin: 'https://onesave.vercel.app',
  credentials: true
}));
```

### Configurer les webhooks GitHub
Vercel redéploie automatiquement à chaque `git push` sur `main`

## 🐛 Dépannage

### "Vercel Command not found"
```bash
npm install -g vercel
```

### "PostgreSQL connection failed"
- Vérifiez la variable `DATABASE_URL` sur Railway
- Exécutez les migrations: `railway run npm run prisma:migrate`

### "Frontend appelle pas le backend"
- Vérifiez `REACT_APP_API_URL` dans Vercel Environment Variables
- Vérifiez CORS dans le backend

### Voir les logs
```bash
# Vercel
vercel logs --follow

# Railway
railway logs --follow
```

## 📚 Ressources

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Prisma PostgreSQL](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases-typescript-postgresql)

## 🎉 Succès!

Une fois déployé, votre application sera accessible worldwide sur:
```
https://onesave.vercel.app
```

Partagez l'URL avec vos utilisateurs!

