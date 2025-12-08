# Guide d'Installation - OneSave

## 🚀 Installation Rapide

### Prérequis
- ✅ Node.js v22.21.0 (déjà installé)
- ✅ npm (inclus avec Node.js)

### Étapes d'Installation

#### Étape 1 : Installer les dépendances racine
```powershell
npm install
```

#### Étape 2 : Installer les dépendances du serveur
```powershell
cd server
npm install
cd ..
```

#### Étape 3 : Installer les dépendances du client
```powershell
cd client
npm install
cd ..
```

#### Étape 4 : Générer le client Prisma
```powershell
cd server
npm run prisma:generate
cd ..
```

#### Étape 5 : Créer la base de données
```powershell
cd server
npm run prisma:migrate
cd ..
```

#### Étape 6 : Lancer l'application
```powershell
npm run dev
```

## 📋 Installation en Une Commande (Script Automatique)

Exécutez simplement :
```powershell
.\scripts\install.ps1
```

Ce script effectue automatiquement toutes les étapes ci-dessus.

## ✅ Vérification

Après l'installation, vérifiez que tout est en place :

1. Les dossiers `node_modules` existent dans :
   - `server/node_modules/`
   - `client/node_modules/`

2. La base de données existe :
   - `server/prisma/dev.db`

3. Les fichiers `.env` existent :
   - `server/.env`
   - `client/.env`

## 🎯 Démarrage

Une fois l'installation terminée :

1. Lancez l'application :
   ```powershell
   npm run dev
   ```

2. Ouvrez votre navigateur :
   - Frontend : http://localhost:3000
   - Backend : http://localhost:5000

3. Connectez-vous :
   - Email : `admin@cnf.ci`
   - Mot de passe : `admin123`

⚠️ **Important** : Changez le mot de passe après la première connexion !

## 🐛 Résolution de Problèmes

### Erreur : "npm n'est pas reconnu"
- Installez Node.js depuis https://nodejs.org/

### Erreur : "Port déjà utilisé"
- Modifiez le port dans `server/.env` (PORT=5001)
- Modifiez aussi `client/.env` (REACT_APP_API_URL=http://localhost:5001/api)

### Erreur : "Cannot find module"
- Réinstallez les dépendances :
  ```powershell
  npm install
  cd server && npm install
  cd ../client && npm install
  ```

## 📚 Documentation

- `README.md` - Documentation principale
- `QUICK_START.md` - Guide de démarrage rapide
- `COMMENT_DEMARRER.md` - Comment démarrer
- `docs/TECHNIQUE.md` - Documentation technique
- `docs/UTILISATEUR.md` - Guide utilisateur

---

**OneSave** - Application de gestion de projets pour le Campus Numérique Francophone
