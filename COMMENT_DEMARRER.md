# 🚀 Comment Démarrer OneSave - Guide Pratique

## 📍 Où Exécuter les Commandes ?

### Étape 1 : Ouvrir un Terminal

Vous devez ouvrir un **terminal** (PowerShell, Command Prompt, ou Terminal) dans le dossier du projet.

#### Option A : Depuis l'Explorateur de Fichiers (Windows)

1. Ouvrez l'**Explorateur de Fichiers** Windows
2. Naviguez vers : `C:\Users\DELL\Desktop\OneSave`
3. Cliquez dans la barre d'adresse et tapez : `powershell`
4. Appuyez sur **Entrée**
5. Un terminal PowerShell s'ouvrira directement dans ce dossier

#### Option B : Depuis Visual Studio Code / Cursor

1. Ouvrez le dossier `OneSave` dans VS Code/Cursor
2. Appuyez sur **Ctrl + `** (backtick) pour ouvrir le terminal intégré
3. Ou allez dans le menu : **Terminal → New Terminal**

#### Option C : Depuis le Menu Démarrer (Windows)

1. Appuyez sur **Windows + X**
2. Sélectionnez **Windows PowerShell** ou **Terminal**
3. Naviguez vers le dossier :
   ```powershell
   cd C:\Users\DELL\Desktop\OneSave
   ```

---

## 🎯 Étapes à Exécuter dans le Terminal

### Étape 1 : Vérifier que vous êtes au bon endroit

Dans le terminal, vous devriez voir quelque chose comme :
```
PS C:\Users\DELL\Desktop\OneSave>
```

Si vous n'y êtes pas, tapez :
```powershell
cd C:\Users\DELL\Desktop\OneSave
```

### Étape 2 : Installer les Dépendances

#### Option A : Installation Automatique (Recommandé) ⭐

```powershell
.\scripts\install.ps1
```

Ce script va :
- ✅ Vérifier Node.js
- ✅ Installer toutes les dépendances
- ✅ Créer les fichiers .env
- ✅ Générer Prisma Client
- ✅ Créer la base de données

#### Option B : Installation Manuelle

Si l'installation automatique ne fonctionne pas, faites étape par étape :

**2.1. Installer les dépendances racine :**
```powershell
npm install
```

**2.2. Installer les dépendances du serveur :**
```powershell
cd server
npm install
cd ..
```

**2.3. Installer les dépendances du client :**
```powershell
cd client
npm install
cd ..
```

**2.4. Générer Prisma Client :**
```powershell
cd server
npm run prisma:generate
cd ..
```

**2.5. Créer la base de données :**
```powershell
cd server
npm run prisma:migrate
cd ..
```

### Étape 3 : Lancer l'Application

Une fois l'installation terminée, lancez l'application :

```powershell
npm run dev
```

Cela va démarrer :
- ✅ Le serveur backend sur http://localhost:5000
- ✅ Le client frontend sur http://localhost:3000

**Note :** Laissez ce terminal ouvert pendant que l'application fonctionne.

### Étape 4 : Ouvrir l'Application dans le Navigateur

1. Ouvrez votre navigateur (Chrome, Edge, Firefox)
2. Allez sur : **http://localhost:3000**
3. Vous verrez la page de connexion

### Étape 5 : Se Connecter

Connectez-vous avec :
- **Email** : `admin@cnf.ci`
- **Mot de passe** : `admin123`

⚠️ **Important** : Changez le mot de passe après la première connexion !

---

## 📝 Commandes Utiles

### Lancer l'Application
```powershell
npm run dev
```

### Arrêter l'Application
Appuyez sur **Ctrl + C** dans le terminal

### Ouvrir Prisma Studio (Interface de la base de données)
```powershell
cd server
npm run prisma:studio
```

### Sauvegarder la Base de Données
```powershell
.\scripts\backup.ps1
```

---

## 🐛 Résolution de Problèmes

### Erreur : "npm n'est pas reconnu"

**Solution :** Installez Node.js depuis https://nodejs.org/
- Téléchargez la version LTS
- Installez-le
- Redémarrez le terminal

### Erreur : "Le port 5000 est déjà utilisé"

**Solution :** Modifiez le port dans `server/.env` :
```env
PORT=5001
```

Puis modifiez aussi `client/.env` :
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### Erreur : "Le port 3000 est déjà utilisé"

**Solution :** Le navigateur vous demandera automatiquement d'utiliser un autre port (comme 3001)

### Erreur : "Cannot find module"

**Solution :** Réinstallez les dépendances :
```powershell
npm install
cd server && npm install
cd ../client && npm install
```

---

## 🎯 Récapitulatif des Commandes

### Dans le Terminal PowerShell (depuis C:\Users\DELL\Desktop\OneSave)

```powershell
# 1. Installation automatique
.\scripts\install.ps1

# 2. OU installation manuelle
npm install
cd server && npm install
cd ../client && npm install
cd ../server && npm run prisma:generate && npm run prisma:migrate
cd ..

# 3. Lancer l'application
npm run dev

# 4. Ouvrir dans le navigateur
# Allez sur http://localhost:3000
```

---

## 📍 Résumé : Où Exécuter les Commandes ?

1. **Ouvrez un terminal** (PowerShell) dans le dossier :
   ```
   C:\Users\DELL\Desktop\OneSave
   ```

2. **Exécutez les commandes** une par une dans ce terminal

3. **Laissez le terminal ouvert** pendant que l'application tourne

4. **Ouvrez votre navigateur** pour accéder à l'application

---

## ✅ Checklist

- [ ] Terminal ouvert dans le dossier OneSave
- [ ] Node.js installé (vérifier avec `node --version`)
- [ ] Dépendances installées
- [ ] Base de données créée
- [ ] Application lancée (`npm run dev`)
- [ ] Navigateur ouvert sur http://localhost:3000
- [ ] Connexion réussie

---

**Besoin d'aide ?** Consultez `INSTALLATION.md` pour plus de détails.

**Bonne chance ! 🚀**

