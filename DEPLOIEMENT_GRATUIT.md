# ✅ ONESAVE EN LOCAL + DÉPLOIEMENT GRATUIT

## 🚀 ACCÈS LOCAL (ACTIF MAINTENANT!)

### Frontend
```
http://localhost:3001
```

### Backend API
```
http://localhost:5000
http://localhost:5000/api/health
```

### Identifiants
```
Email: admin@cnf.ci
Mot de passe: admin123
```

**Statut:** ✅ **EN LIGNE MAINTENANT** - Les deux serveurs tournent en background

---

## 🎯 DÉPLOIEMENT GRATUIT (Choix recommandés)

### Option 1: Vercel + Railway (MEILLEURE)
**Coût:** Gratuit pour démarrer | **Facilité:** ⭐⭐⭐⭐⭐

#### Étape 1: Préparer GitHub
```bash
# 1. Aller sur https://github.com/new
# 2. Créer un repo "OneSave"
# 3. Initialiser git localement:

cd /home/stevegomon/Téléchargements/OneSave
git init
git add .
git commit -m "Initial commit - OneSave complete"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/OneSave.git
git push -u origin main
```

#### Étape 2: Déployer Backend sur Railway
```bash
# 1. Aller sur https://railway.app
# 2. S'inscrire avec GitHub
# 3. Créer un nouveau projet
# 4. Connecter votre repo GitHub
# 5. Ajouter une base PostgreSQL
# 6. Configurer les variables d'environnement:
#    DATABASE_URL=postgresql://...
#    JWT_SECRET=votre_secret
#    NODE_ENV=production
# 7. Déployer!

# Résultat: https://votreapp-backend.railway.app
```

#### Étape 3: Déployer Frontend sur Vercel
```bash
# 1. Aller sur https://vercel.com
# 2. S'inscrire avec GitHub
# 3. Importer votre repo GitHub
# 4. Choisir le dossier: client/
# 5. Ajouter variable d'environnement:
#    REACT_APP_API_URL=https://votreapp-backend.railway.app/api
# 6. Déployer!

# Résultat: https://votreapp.vercel.app
```

**Coût:** $0/mois (limites gratuites suffisent)  
**Temps:** 15 minutes  
**Performance:** Excellent ⭐⭐⭐⭐⭐

---

### Option 2: Heroku (Simple mais payant)
**Coût:** Payant (à partir de $7/mois) | **Facilité:** ⭐⭐⭐⭐

```bash
# Installer Heroku CLI
npm install -g heroku

# Se connecter
heroku login

# Créer l'app backend
heroku create votreapp-backend
heroku addons:create heroku-postgresql:hobby-dev

# Configurer environment
heroku config:set DATABASE_URL=<postgresql-url>
heroku config:set JWT_SECRET=votre_secret

# Déployer
git push heroku main

# Accès: https://votreapp-backend.herokuapp.com
```

---

### Option 3: Render (Gratuit mais avec limitation de CPU)
**Coût:** Gratuit | **Facilité:** ⭐⭐⭐⭐

1. Aller sur https://render.com
2. S'inscrire avec GitHub
3. New Web Service
4. Connecter votre repo
5. Configuration:
   - Build command: `cd server && npm install`
   - Start command: `npm start`
   - Environment: Node
6. Ajouter PostgreSQL gratuit
7. Déployer!

**Résultat:** https://votreapp.onrender.com

---

### Option 4: DigitalOcean App Platform (Gratuit 3 mois)
**Coût:** Gratuit 3 mois, puis ~$5/mois | **Facilité:** ⭐⭐⭐

1. https://www.digitalocean.com
2. App Platform → Create App
3. Connecter GitHub
4. Ajouter PostgreSQL
5. Configuration automatique
6. Déployer

---

## 🔄 COMPARAISON PLATFORMS

| Platform | Coût | Facilité | Performance | Recommandé |
|----------|------|---------|-------------|-----------|
| **Vercel + Railway** | Gratuit | ⭐⭐⭐⭐⭐ | Excellent | ✅ OUI! |
| **Heroku** | $7+/mois | ⭐⭐⭐⭐ | Bon | Payant |
| **Render** | Gratuit | ⭐⭐⭐⭐ | Bon | Peut être lent |
| **DigitalOcean** | Gratuit 3m | ⭐⭐⭐ | Excellent | Bon long terme |

---

## ✨ MIGRATION VERS PRODUCTION

### Base de Données
```javascript
// Changement simple dans .env:

// Développement (local):
DATABASE_URL=file:./prisma/dev.db

// Production (PostgreSQL):
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Déploiement Facile
Grâce à Prisma, **pas besoin de changer le code!**

```bash
# Juste mettre à jour DATABASE_URL et relancer
DATABASE_URL=postgresql://... npm start
```

### Variables d'Environnement Production
```
DATABASE_URL=postgresql://...        # PostgreSQL cloud
JWT_SECRET=secret_tres_long_et_random # Générateur: openssl rand -base64 32
NODE_ENV=production
PORT=80 (fourni par la plateforme)
API_URL=https://votreapi.com
FRONTEND_URL=https://votreapp.com
```

---

## 🎯 PLAN RECOMMANDÉ (Gratuit + Rapide)

### 1. Local Development (DÉJÀ FAIT! ✅)
```
✅ Backend sur port 5000
✅ Frontend sur port 3001
✅ SQLite local
✅ Prêt à déployer
```

### 2. GitHub (Gratuit)
```bash
# Créer repo sur https://github.com/new
# Puis:
cd /home/stevegomon/Téléchargements/OneSave
git init
git add .
git commit -m "OneSave complete"
git remote add origin https://github.com/VOTRE_USERNAME/OneSave.git
git push -u origin main
```

### 3. Déployer Backend sur Railway (Gratuit)
```
- https://railway.app
- Import GitHub repo
- Add PostgreSQL (gratuit)
- Set environment variables
- Deploy!
- Résultat: https://yourapp.railway.app
```

### 4. Déployer Frontend sur Vercel (Gratuit)
```
- https://vercel.com
- Import GitHub repo
- Choose folder: client/
- Add REACT_APP_API_URL=<railway-backend-url>
- Deploy!
- Résultat: https://yourapp.vercel.app
```

**Total temps:** 1 heure  
**Total coût:** $0  
**Performance:** Excellent

---

## 📋 CHECKLIST DÉPLOIEMENT

### Avant déploiement
- [ ] Code vérifié localement (http://localhost:3001 fonctionne)
- [ ] Tous les secrets dans .env (pas en dur dans le code)
- [ ] Git repo créé et commité
- [ ] PostgreSQL préparé en cloud

### Variables d'Environnement Production
```bash
DATABASE_URL=postgresql://username:password@host/dbname
JWT_SECRET=<32 caractères aléatoires>
NODE_ENV=production
PORT=<fourni par plateforme>
API_URL=https://votreapi.com
FRONTEND_URL=https://votreapp.vercel.app
```

### Après déploiement
- [ ] Tester https://votreapp.vercel.app
- [ ] Tester la connexion (admin@cnf.ci / admin123)
- [ ] Vérifier l'API: https://votreapi.railway.app/api/health
- [ ] Créer un test de projet
- [ ] Tester la collaboration

---

## 🚨 PROBLÈMES COURANTS

### "Database not found"
Solution: Vérifier DATABASE_URL dans les variables d'environnement

### "CORS error"
Solution: Ajouter FRONTEND_URL aux headers CORS

```javascript
// Dans server/src/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
```

### "Port already in use"
Solution: Changez le port dans .env

### "Node version incompatible"
Solution: Spécifier version dans package.json
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

---

## 📞 SUPPORT DÉPLOIEMENT

**Railway:** https://railway.app/docs  
**Vercel:** https://vercel.com/docs  
**Render:** https://render.com/docs  
**DigitalOcean:** https://docs.digitalocean.com/products/app-platform/

---

## 🎉 RÉSUMÉ

### Vous Avez
✅ Application prête en local (http://localhost:3001)  
✅ Code complet et testé  
✅ Database SQLite fonctionnelle  
✅ Configuration prête pour production  

### Vous Pouvez Faire
✅ Utiliser localement = maintenant (gratuit, illimité)  
✅ Déployer gratuitement = 1 heure (Vercel + Railway)  
✅ Passer en production = quelques clicks  

### Prochaines Étapes
1. Utiliser localement = **DÉJÀ LIVE! 🚀**
2. Créer GitHub repo (5 min)
3. Déployer sur Vercel + Railway (30 min)
4. Partager le lien avec le jury!

---

**Créé:** 13 Décembre 2025  
**Statut:** ✅ Prêt local + Guide déploiement complet  
**Recommandation:** Vercel + Railway = Meilleur ratio gratuit/qualité

*Allez lancer votre app! 🚀*
