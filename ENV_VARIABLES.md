# Configuration des variables d'environnement pour Vercel et Railway

## 📦 Variables Vercel (Frontend)

Allez dans **Vercel Dashboard** → **Votre Projet** → **Settings** → **Environment Variables**

Ajoutez ces variables pour tous les environnements (Production, Preview, Development):

```
REACT_APP_API_URL=https://votre-backend-railway.up.railway.app/api
```

## 🔧 Variables Railway (Backend)

Allez dans **Railway Dashboard** → **Votre Projet** → **Variables**

Le fichier `.env` doit contenir:

```env
# Base de données (Auto-généré par Railway pour PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Authentification
JWT_SECRET=votre_secret_tres_securise_changez_ceci

# Environnement
NODE_ENV=production

# Admin par défaut
DEFAULT_ADMIN_EMAIL=admin@cnf.ci
DEFAULT_ADMIN_PASSWORD=admin123

# Port (Railway gère cela automatiquement)
PORT=5000
```

## ✅ Configuration étape par étape

### Sur Vercel:

1. Dashboard → Your Project → Settings
2. Onglet "Environment Variables"
3. Ajouter une variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend.railway.app/api`
   - **Production ✓, Preview ✓, Development ✓**
4. Cliquer "Save"
5. Redéployer (ou wait for next push)

### Sur Railway:

1. Dashboard → Your Service
2. Onglet "Variables"
3. "New Variable" pour chaque:
   - `DATABASE_URL` = la valeur auto-générée
   - `JWT_SECRET` = générer avec: `openssl rand -base64 32`
   - `NODE_ENV` = `production`
   - `DEFAULT_ADMIN_EMAIL` = `admin@cnf.ci`
   - `DEFAULT_ADMIN_PASSWORD` = `admin123`

## 🔐 Générer un JWT_SECRET sécurisé

Option 1 (Linux/Mac):
```bash
openssl rand -base64 32
```

Option 2 (Node.js):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Option 3 (Python):
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

## 📝 Exemple de configuration complète

**Vercel Environment Variables:**
```
REACT_APP_API_URL=https://onesave-backend.railway.app/api
```

**Railway Environment Variables:**
```
DATABASE_URL=postgresql://postgres:abc123xyz@containers-us-west-10.railway.app:5432/railway
JWT_SECRET=abc123xyz+/==def456uvw+/==ghi789stuv+/==
NODE_ENV=production
DEFAULT_ADMIN_EMAIL=admin@cnf.ci
DEFAULT_ADMIN_PASSWORD=admin123
```

## ✨ Vérification

Après configuration, testez:

```bash
# Test du frontend
curl -I https://onesave.vercel.app

# Test du backend
curl https://onesave-backend.railway.app/api/health

# Test de l'authentification
curl -X POST https://onesave-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cnf.ci","motDePasse":"admin123"}'
```

## ⚠️ Problèmes courants

### "CORS error" au login
- Vérifiez que `REACT_APP_API_URL` est correct dans Vercel
- Vérifiez que le backend CORS autorise Vercel

### "Cannot connect to database"
- Vérifiez que `DATABASE_URL` sur Railway est correcte
- Exécutez les migrations: `railway run npm run prisma:migrate`

### "JWT_SECRET not found"
- Vérifiez que la variable est bien définie sur Railway
- Redéployez après ajout

### Frontend affiche pages blanches
- Vérifiez les logs Vercel: `vercel logs`
- Vérifiez `REACT_APP_API_URL`

## 🔄 Redéploiement après changement

**Vercel**: Auto après `git push` ou via Dashboard
**Railway**: Auto après `git push` ou `railway up`

Si besoin de forcer:
```bash
# Vercel
vercel deploy --prod

# Railway  
railway up
```

