# ⚡ Démarrage Rapide - OneSave

## 🎯 Installation en 3 Étapes

### Option 1 : Installation Automatique (Recommandé) ⭐

1. **Ouvrez PowerShell** dans le dossier OneSave
2. **Exécutez** :
   ```powershell
   .\INSTALLER_MAINTENANT.ps1
   ```
3. **Attendez** que l'installation se termine

### Option 2 : Installation Manuelle

#### Étape 1 : Installer les dépendances
```powershell
# Dépendances racine
npm install

# Dépendances serveur
cd server
npm install

# Dépendances client
cd ../client
npm install
```

#### Étape 2 : Configurer la base de données
```powershell
cd ../server
npm run prisma:generate
npm run prisma:migrate
```

#### Étape 3 : Lancer l'application
```powershell
cd ..
npm run dev
```

## 🚀 Lancer l'Application

Une fois l'installation terminée :

```powershell
npm run dev
```

Cela démarre :
- ✅ Serveur backend sur http://localhost:5000
- ✅ Client frontend sur http://localhost:3000

## 🌐 Accéder à l'Application

1. Ouvrez votre navigateur
2. Allez sur : **http://localhost:3000**
3. Connectez-vous avec :
   - **Email** : `admin@cnf.ci`
   - **Mot de passe** : `admin123`

⚠️ **Changez le mot de passe après la première connexion !**

## 📋 Commandes Utiles

### Lancer l'application
```powershell
npm run dev
```

### Arrêter l'application
Appuyez sur **Ctrl + C** dans le terminal

### Ouvrir Prisma Studio
```powershell
cd server
npm run prisma:studio
```

### Sauvegarder la base de données
```powershell
.\scripts\backup.ps1
```

## 🐛 Problèmes Courants

### Port déjà utilisé
- Modifiez `PORT` dans `server/.env`
- Modifiez `REACT_APP_API_URL` dans `client/.env`

### Erreur de modules
```powershell
# Réinstaller les dépendances
npm install
cd server && npm install
cd ../client && npm install
```

## ✅ Checklist

- [ ] Node.js installé
- [ ] Dépendances installées
- [ ] Base de données créée
- [ ] Application lancée
- [ ] Navigateur ouvert
- [ ] Connexion réussie

---

**Besoin d'aide ?** Consultez `INSTALLATION.md` ou `COMMENT_DEMARRER.md`

**Bonne utilisation ! 🚀**

