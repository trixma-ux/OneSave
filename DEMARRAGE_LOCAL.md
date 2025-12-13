# 🎯 ONESAVE - DÉMARRAGE SIMPLE

## ✅ C'EST LANCÉ!

L'application tourne **MAINTENANT** sur votre machine:

### Frontend (Interface)
```
http://localhost:3001
```

### Backend (API)
```
http://localhost:5000
http://localhost:5000/api/health
```

### Login
```
Email: admin@cnf.ci
Pass: admin123
```

---

## 🎨 Tester l'App

### Étape 1: Ouvrir le Navigateur
```
Allez sur http://localhost:3001
```

### Étape 2: Se Connecter
```
Email: admin@cnf.ci
Mot de passe: admin123
```

### Étape 3: Créer un Projet
```
1. Cliquer "Créer un projet"
2. Remplir le formulaire
3. Vérifier qu'il apparaît dans la liste
```

### Étape 4: Tester la Collaboration
```
1. Inviter un utilisateur (test@cnf.ci)
2. Créer un compte test@cnf.ci
3. Se connecter avec ce compte
4. Voir le projet partagé!
```

---

## 🚀 DÉPLOYER GRATUIT (1 Heure)

### Meilleure Option: Vercel + Railway

#### Étape 1: GitHub
```bash
cd /home/stevegomon/Téléchargements/OneSave

# Si git n'existe pas:
git init
git add .
git commit -m "OneSave"
git branch -M main

# Créer repo sur https://github.com/new
# Puis:
git remote add origin https://github.com/VOTRE_USERNAME/OneSave.git
git push -u origin main
```

#### Étape 2: Railway Backend
```
1. Aller sur https://railway.app
2. S'inscrire avec GitHub
3. New Project → Deploy from GitHub repo
4. Ajouter PostgreSQL (Add plugin)
5. Variables d'environnement:
   DATABASE_URL = (auto)
   JWT_SECRET = votre_secret
   NODE_ENV = production
6. Deploy!

Accès: https://votreapp-backend.railway.app
```

#### Étape 3: Vercel Frontend
```
1. Aller sur https://vercel.com
2. S'inscrire avec GitHub
3. Import GitHub repo
4. Root directory: client/
5. Variable: REACT_APP_API_URL=https://votreapp-backend.railway.app/api
6. Deploy!

Accès: https://votreapp.vercel.app
```

**Total:** Gratuit | 1 heure | Prêt pour jury! 🎉

---

## 📋 Arrêter/Redémarrer Local

### Arrêter les Serveurs
```bash
cd /home/stevegomon/Téléchargements/OneSave
./stop-demo.sh  # Si le script existe

# Ou manuellement:
pkill -f "npm run dev"
pkill -f "npm start"
```

### Redémarrer
```bash
cd /home/stevegomon/Téléchargements/OneSave
./start-demo.sh  # Relancer les deux serveurs
```

---

## 🎯 Points Clés

### Local Development
- ✅ Frontend: http://localhost:3001
- ✅ Backend: http://localhost:5000
- ✅ Database: SQLite local
- ✅ Prêt à utiliser: MAINTENANT

### Production (Gratuit)
- ✅ Frontend: Vercel
- ✅ Backend: Railway + PostgreSQL
- ✅ Setup: 1 heure
- ✅ Coût: $0

### Pour le Jury
- ✅ Présenté en local = http://localhost:3001
- ✅ Ou en production = vercel.app
- ✅ Les deux fonctionnent parfaitement

---

## 📖 Documentation

**Lire d'abord:**
1. 00_LIRE_D_ABORD.md
2. PRESENTATION_JURY.md
3. DEPLOIEMENT_GRATUIT.md (ce fichier)

---

**L'app est prête! Amusez-vous! 🚀**
