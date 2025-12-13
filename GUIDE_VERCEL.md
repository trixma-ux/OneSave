# 🚀 Guide de Déploiement sur Vercel

## Option 1: Déployer le Frontend uniquement sur Vercel (Recommandé)

### Étape 1: Créer un compte Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up"
3. Connectez-vous avec GitHub, GitLab ou Bitbucket (recommandé)

### Étape 2: Préparer votre repo Git
```bash
cd /home/stevegomon/Téléchargements/OneSave
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/OneSave.git
git push -u origin main
```

### Étape 3: Importer le projet dans Vercel
1. Dans votre dashboard Vercel, cliquez sur "New Project"
2. Sélectionnez "Import Git Repository"
3. Cherchez et sélectionnez votre repo `OneSave`
4. Configurez le projet:
   - **Root Directory**: `client`
   - **Framework Preset**: `Create React App`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Étape 4: Configurer les variables d'environnement
Dans les paramètres du projet Vercel, allez à "Settings" → "Environment Variables" et ajoutez:

```
REACT_APP_API_URL=https://votre-backend.com/api
```

### Étape 5: Déployer
Cliquez sur "Deploy" - Vercel va automatiquement:
- Builder votre projet React
- Uploader sur les CDN globaux
- Configurer les domaines SSL/HTTPS

---

## Option 2: Déployer le Backend sur Railway (gratuit pendant 5$)

### Étape 1: Créer un compte Railway
1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec GitHub

### Étape 2: Créer une nouvelle application
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser le projet
cd /home/stevegomon/Téléchargements/OneSave/server
railway init
```

### Étape 3: Créer une base de données PostgreSQL
1. Dans le dashboard Railway
2. Cliquez sur "New" → "Database" → "PostgreSQL"
3. Railway génère automatiquement `DATABASE_URL`

### Étape 4: Configurer les variables
```bash
railway variables set JWT_SECRET=votre_secret_securise
railway variables set NODE_ENV=production
railway variables set DEFAULT_ADMIN_EMAIL=admin@cnf.ci
railway variables set DEFAULT_ADMIN_PASSWORD=admin123
```

### Étape 5: Ajouter le script de démarrage
Ajoutez à `server/package.json`:
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

### Étape 6: Déployer
```bash
railway up
```

Railway va afficher l'URL de votre backend.

---

## Option 3: Déployer tout sur Vercel (Backend comme Serverless Function)

Cette option nécessite de restructurer le backend en serverless functions.

### Étape 1: Installer Vercel CLI
```bash
npm install -g vercel
```

### Étape 2: Authentification
```bash
vercel login
```

### Étape 3: Configurer le backend pour Vercel
Créez `/api/index.ts` avec votre serveur Express configuré pour serverless.

### Étape 4: Déployer
```bash
vercel --prod
```

---

## Configuration finale après déploiement

### Mettre à jour l'URL de l'API dans le frontend
Après avoir votre backend en production, mettez à jour:

**client/.env.production**
```
REACT_APP_API_URL=https://votre-api-railway.com/api
```

ou modifiez directement dans Vercel:
1. Settings → Environment Variables
2. Ajoutez `REACT_APP_API_URL` avec l'URL de votre backend

---

## ✅ Checklist avant déploiement

- [ ] Compte Vercel créé
- [ ] Repo Git créé et synchronisé
- [ ] Variables d'environnement configurées
- [ ] Backend déployé (Railway/Render)
- [ ] URL de l'API mise à jour dans le frontend
- [ ] Base de données configurée
- [ ] Tests d'authentification effectués
- [ ] CORS configuré correctement

---

## 🔗 URLs de déploiement

- **Frontend Vercel**: `https://onesave.vercel.app`
- **Backend Railway**: `https://your-app-railway.com/api`

---

## Support et Assistance

Si vous avez des problèmes:
1. Vérifiez les logs dans Vercel Dashboard
2. Vérifiez les logs dans Railway Dashboard
3. Vérifiez que les variables d'environnement sont correctement définies
4. Testez l'API avec Postman/curl depuis votre machine locale

