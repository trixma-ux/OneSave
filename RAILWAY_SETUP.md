# 🚀 Déploiement Railway - Backend

Déployez votre serveur Node.js sur Railway en **5 minutes**.

## 💰 Coûts

- **Starter Plan**: $5/mois (puis $0.50/heure)
- **PostgreSQL**: Inclus gratuitement
- **Total**: ~$5/mois pour le backend

## 📋 Prérequis

✅ Repo GitHub avec code du serveur
✅ Compte Railway (gratuit avec GitHub)

## 🎯 Étape 1: Créer un compte Railway

1. Allez sur https://railway.app
2. Cliquez "Sign Up"
3. Connectez avec GitHub
4. Autorisez Railway à accéder à votre GitHub

## 🎯 Étape 2: Créer une nouvelle app

1. Dashboard Railway → "New Project"
2. Cliquez "Deploy from GitHub repo"
3. Sélectionnez `trixma-ux/OneSave`
4. Sélectionnez le **service backend** (optional, Railway l'auto-détecte)

## 🎯 Étape 3: Ajouter PostgreSQL

1. Dans le dashboard du projet
2. Cliquez "New Service"
3. Sélectionnez "PostgreSQL"
4. Railway va créer une instance PostgreSQL

✅ Une variable `DATABASE_URL` est automatiquement générée!

## 🎯 Étape 4: Configurer les variables

Dans le service Node.js, allez à "Variables":

Ajouter ces variables:

```
NODE_ENV=production
JWT_SECRET=votre_secret_tres_securise_changez_ceci
DEFAULT_ADMIN_EMAIL=admin@cnf.ci
DEFAULT_ADMIN_PASSWORD=admin123
```

### Générer un JWT_SECRET sécurisé

```bash
# Linux/Mac
openssl rand -base64 32

# Ou avec Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copiez la sortie et collez-la dans `JWT_SECRET`.

## 🎯 Étape 5: Exécuter les migrations

Railway va auto-starter votre app, mais vous devez d'abord faire les migrations:

### Option A: Via le terminal Railway (recommandé)

1. Dashboard → Onglet "Deployments"
2. Sélectionnez le dernier déploiement
3. Cliquez "Logs"
4. Attendez que l'app se lance
5. Exécutez dans le terminal Railway:
   ```bash
   npm run prisma:migrate -- --skip-generate
   ```

### Option B: Via un déploiement local test

```bash
# Récupérer DATABASE_URL depuis Railway
# (Dashboard → PostgreSQL → Variables)

# Localement
DATABASE_URL="postgresql://..." npm run prisma:migrate
```

## 📊 Récupérer votre URL Railway

Après déploiement:

1. Dashboard Railway → Votre projet
2. Sélectionnez le service Node.js
3. Onglet "Networking"
4. Vous avez un domaine public: `https://your-service.railway.app`

C'est votre **URL de backend**! 📌

## ✅ Vérifier que tout fonctionne

```bash
# Test de l'API
curl https://your-service.railway.app/api/health

# Devrait retourner: {"status":"ok"}
```

## 🔧 Configuration finale

### Mettre à jour Vercel avec l'URL Railway

1. **Dashboard Vercel** → Votre projet
2. **Settings** → **Environment Variables**
3. Ajouter:
   ```
   REACT_APP_API_URL=https://your-service.railway.app/api
   ```
4. Redéployer (ou `git push`)

## 📝 Variables complètes après configuration

### Railway (Backend)
```
DATABASE_URL=postgresql://user:pass@...
NODE_ENV=production
JWT_SECRET=abc123xyz...
DEFAULT_ADMIN_EMAIL=admin@cnf.ci
DEFAULT_ADMIN_PASSWORD=admin123
PORT=3000  (optionnel, Railway gère)
```

### Vercel (Frontend)
```
REACT_APP_API_URL=https://your-service.railway.app/api
```

## 🔄 Déploiements automatiques

- **Vercel**: À chaque `git push`
- **Railway**: À chaque `git push` aussi!

Aucune configuration supplémentaire.

## ⚠️ Dépannage

### "Database connection failed"
- Vérifiez que PostgreSQL est démarré (Railway → Services)
- Vérifiez `DATABASE_URL` est correct
- Exécutez les migrations

### "Cannot find module"
```bash
# Dans le terminal Railway
npm install
npm run prisma:generate
npm run build
```

### Port en conflit
Railway gère les ports automatiquement, ne pas modifier.

### Logs de l'app
- Dashboard Railway → Deployments → Logs
- Vous voyez le stderr et stdout en temps réel

## 📚 Ressources

- [Railway Docs](https://docs.railway.app)
- [Railway Pricing](https://railway.app/pricing)
- [PostgreSQL on Railway](https://docs.railway.app/databases/postgres)

## ✨ Vous avez terminé!

Votre backend est maintenant:
✅ En production sur Railway
✅ Avec PostgreSQL incluse
✅ Avec déploiement automatique
✅ Avec URL publique stable

## 🎊 Étape suivante

Configurer Vercel avec l'URL Railway pour connecter frontend + backend!

