# Guide de Démarrage Rapide - OneSave

## Installation Rapide

### 1. Prérequis

Assurez-vous d'avoir installé :
- Node.js 18+ ([Télécharger](https://nodejs.org/))
- npm (inclus avec Node.js)

### 2. Installation des Dépendances

```bash
# Installation des dépendances racine
npm install

# Installation des dépendances du serveur
cd server
npm install

# Installation des dépendances du client
cd ../client
npm install
cd ..
```

### 3. Configuration

#### Backend

Créez un fichier `.env` dans le dossier `server/` :

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="votre_secret_jwt_tres_securise_changez_moi"
PORT=5000
NODE_ENV=development
```

#### Frontend

Créez un fichier `.env` dans le dossier `client/` :

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Initialisation de la Base de Données

```bash
# Générer le client Prisma
cd server
npm run prisma:generate

# Créer la base de données et appliquer les migrations
npm run prisma:migrate
cd ..
```

### 5. Démarrage de l'Application

#### Option 1 : Démarrage Combiné (Recommandé)

```bash
# Depuis la racine du projet
npm run dev
```

Cela démarre simultanément :
- Le serveur backend sur http://localhost:5000
- Le client frontend sur http://localhost:3000

#### Option 2 : Démarrage Séparé

**Terminal 1 - Backend :**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd client
npm start
```

### 6. Accès à l'Application

1. Ouvrez votre navigateur
2. Allez sur http://localhost:3000
3. Connectez-vous avec :
   - **Email** : admin@cnf.ci
   - **Mot de passe** : admin123

⚠️ **Important** : Changez le mot de passe après la première connexion !

## Commandes Utiles

### Base de Données

```bash
# Ouvrir Prisma Studio (interface graphique pour la base de données)
cd server
npm run prisma:studio
```

### Sauvegarde

```bash
# Linux/Mac
./scripts/backup.sh

# Windows (PowerShell)
.\scripts\backup.ps1
```

### Export des Données

```bash
cd server
node ../scripts/export-data.js
```

## Structure du Projet

```
OneSave/
├── client/          # Application React (Frontend)
├── server/          # API Node.js (Backend)
├── docs/            # Documentation
├── scripts/         # Scripts utilitaires
└── README.md        # Documentation principale
```

## Dépannage

### Le serveur ne démarre pas

1. Vérifiez que le port 5000 n'est pas déjà utilisé
2. Vérifiez que le fichier `.env` existe dans `server/`
3. Vérifiez que la base de données est initialisée

### Le client ne démarre pas

1. Vérifiez que le port 3000 n'est pas déjà utilisé
2. Vérifiez que le fichier `.env` existe dans `client/`
3. Vérifiez que les dépendances sont installées

### Erreur de base de données

1. Supprimez le fichier `server/prisma/dev.db` (s'il existe)
2. Réexécutez `npm run prisma:migrate`

### Erreurs d'authentification

1. Vérifiez que le serveur backend est démarré
2. Vérifiez l'URL de l'API dans `client/.env`
3. Vérifiez les logs du serveur

## Prochaines Étapes

1. ✅ Changez le mot de passe administrateur
2. ✅ Créez vos premiers projets
3. ✅ Planifiez vos événements
4. ✅ Explorez les rapports et statistiques
5. ✅ Consultez la documentation complète dans `docs/`

## Support

Pour plus d'informations, consultez :
- **Documentation Technique** : `docs/TECHNIQUE.md`
- **Guide Utilisateur** : `docs/UTILISATEUR.md`
- **Architecture** : `docs/ARCHITECTURE.md`

---

**Bonne utilisation de OneSave ! 🚀**

