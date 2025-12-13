# 🚀 OneSave - Guide de Lancement Local pour la Présentation BTS

## Démarrage Rapide (5 minutes)

### Prérequis
- **Node.js 18+** et **npm** installés
- Port **5000** et **3001** disponibles
- Terminal/CMD

### Option 1: Lancement Automatique (Recommandé)

```bash
cd /home/stevegomon/Téléchargements/OneSave

# Terminal 1 - Démarrer le serveur backend
cd server
npm run dev

# Attendre le message: "✅ OneSave Server Started"
```

```bash
# Terminal 2 - Démarrer la démo HTML/CSS
cd demo
npm install
npm run dev

# Le serveur démarrera sur http://localhost:3001
```

### Option 2: Lancement Manuel Étape par Étape

#### Étape 1 : Vérifier la configuration
```bash
cd /home/stevegomon/Téléchargements/OneSave
echo "Server .env:" && cat server/.env
echo "Client .env:" && cat client/.env
```

#### Étape 2 : Démarrer le serveur API
```bash
cd server
npm run dev
```

**Logs attendus :**
```
🚀 OneSave Server Started
  📊 Environment: development
  🔗 API URL: http://localhost:5000/api
📊 Base de données: file:./prisma/dev.db
🔔 Service de notifications activé
ℹ️  Utilisateur administrateur existe déjà
```

#### Étape 3 : Dans un autre terminal, démarrer la démo
```bash
cd demo
npm install  # Premier démarrage seulement
npm run dev
```

**Logs attendus :**
```
✅ OneSave Demo Server démarré sur http://localhost:3001
📊 API URL: http://localhost:5000/api
```

---

## 🎯 Accès à l'Application

### 1. **Ouvrir le navigateur**
```
http://localhost:3001
```

### 2. **Comptes de test disponibles**

#### Admin (Créé automatiquement)
- **Email :** `admin@cnf.ci`
- **Mot de passe :** `admin123`

#### Compte démo (Pour tester l'inscription)
- **Email :** `demo@example.com`
- **Mot de passe :** `demo123`

---

## ✨ Fonctionnalités Testables

### 1. **Authentification**
- ✅ Inscription d'un nouvel utilisateur
- ✅ Connexion avec email/mot de passe
- ✅ Déconnexion
- ✅ Affichage du profil utilisateur

### 2. **Gestion de Projets**
- ✅ Créer un nouveau projet
- ✅ Voir la liste des projets personnels
- ✅ Consulter les détails d'un projet
- ✅ Modifier le statut (Planifié → En cours → Terminé)
- ✅ Suivre la progression en pourcentage
- ✅ Supprimer un projet

### 3. **Collaboration**
- ✅ Inviter un utilisateur à un projet
- ✅ Voir les projets en collaboration
- ✅ Accéder aux projets partagés

### 4. **Événements et Rapports**
- ✅ Consulter les événements liés aux projets
- ✅ Générer des rapports de progression
- ✅ Afficher les statistiques

### 5. **Base de Données SQLite**
- ✅ Données persistantes en `server/prisma/dev.db`
- ✅ Authentification JWT sécurisée
- ✅ Hachage de mots de passe avec bcryptjs

---

## 🧪 Scénario de Démonstration Recommandé

### Pour le Jury (10-15 minutes)

**Étape 1 : Montrer l'inscription**
1. Aller à http://localhost:3001
2. Cliquer sur l'onglet "Inscription"
3. Créer un compte :
   - Nom : "Jean Dupont"
   - Email : "jean@example.com"
   - Mot de passe : "password123"
4. Montrer que l'utilisateur est connecté

**Étape 2 : Créer un projet**
1. Cliquer sur "Nouveau projet"
2. Remplir le formulaire :
   - Titre : "Projet Pilote CNF"
   - Description : "Gestion collaborative des projets"
   - Date de début : (date d'aujourd'hui)
   - Statut : "En cours"
3. Cliquer sur "Créer le projet"
4. Montrer le projet créé dans la liste

**Étape 3 : Inviter un collaborateur**
1. Cliquer sur "Inviter" sur le projet
2. Entrer : "admin@cnf.ci"
3. Montrer le message de confirmation

**Étape 4 : Se connecter avec un autre compte**
1. Cliquer sur "Déconnexion"
2. Se connecter avec : admin@cnf.ci / admin123
3. Naviguer dans "En collaboration"
4. Montrer le projet partagé

**Étape 5 : Montrer les données persistantes**
1. Actualiser la page (F5)
2. Montrer que les données sont toujours présentes
3. Vérifier la base de données :
   ```bash
   ls -la server/prisma/dev.db
   ```

---

## 🛠️ Dépannage

### Problème : Port 5000 ou 3001 déjà utilisé

**Solution 1 :**
```bash
# Trouver les processus utilisant le port
lsof -i :5000
lsof -i :3001

# Tuer le processus (remplacer PID)
kill -9 <PID>
```

**Solution 2 :** Utiliser des ports différents
```bash
# Server sur port 5001
cd server
PORT=5001 npm run dev

# Demo sur port 3002
cd demo
DEMO_PORT=3002 API_URL=http://localhost:5001/api npm run dev
```

### Problème : Connexion refusée au serveur API

**Vérifications :**
1. Le serveur backend est-il démarré sur le port 5000 ?
   ```bash
   curl http://localhost:5000/api/health
   ```
2. Les ports sont-ils corrects dans la démo ?
   ```bash
   grep API_URL demo/public/js/main.js
   ```
3. Relancer les deux services

### Problème : Erreur de base de données

**Solutions :**
```bash
# Régénérer la base de données
cd server
rm -f prisma/dev.db
npm run setup:db:dev

# Redémarrer le serveur
npm run dev
```

---

## 📊 Architecture de la Démo

```
OneSave/
├── server/                          # API Express + Prisma + SQLite
│   ├── src/
│   │   ├── index.ts                # Point d'entrée serveur
│   │   ├── utils/initAdmin.ts      # Initialisation admin
│   │   ├── routes/auth.routes.ts   # Authentification JWT
│   │   └── routes/projet.routes.ts # Gestion des projets
│   ├── prisma/
│   │   ├── schema.prisma           # Modèle de données
│   │   └── dev.db                  # Base de données SQLite
│   ├── .env                        # Configuration serveur
│   └── package.json
│
├── demo/                            # Interface HTML/CSS + Proxy API
│   ├── public/
│   │   ├── index.html              # Page principale
│   │   └── js/main.js              # Logique métier JavaScript
│   ├── css/
│   │   └── styles.css              # Styles personnalisés
│   ├── server.js                   # Serveur Express + proxy
│   └── package.json
│
└── client/                          # Application React (optionnelle)
    ├── src/
    │   ├── context/AuthContext.tsx # Gestion d'authentification
    │   └── pages/                  # Pages React
    ├── .env                        # Configuration client
    └── package.json
```

---

## 🔐 Informations de Sécurité

### Base de Données
- **Type :** SQLite (fichier local `server/prisma/dev.db`)
- **Schéma :** Prisma ORM avec migrations
- **Données :** Sauvegardées automatiquement

### Authentification
- **Système :** JWT (JSON Web Token)
- **Durée :** 7 jours
- **Hachage :** bcryptjs avec salt 10 rounds
- **Variable :** `JWT_SECRET` dans `server/.env`

### Compte Admin
- **Email :** `admin@cnf.ci` (configurable via `DEFAULT_ADMIN_EMAIL`)
- **Mot de passe :** `admin123` (configurable via `DEFAULT_ADMIN_PASSWORD`)
- **Créé :** Automatiquement au premier démarrage du serveur

---

## 📝 Logs Utiles pour le Débogage

### Vérifier l'admin utilisateur
```bash
cd server
DATABASE_URL='file:./prisma/dev.db' node scripts/checkAdmin.js
```

**Résultat attendu :**
```
Admin found: true
{
  "id": "cmhurpsjz0001vuzuhopzm90n",
  "email": "admin@cnf.ci",
  "role": "admin"
}
```

### Vérifier la connectivité API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@cnf.ci","motDePasse":"admin123"}'
```

---

## 🎨 Personnalisation pour la Présentation

### Changer les identifiants par défaut

1. **Modifier le serveur** (`server/.env`) :
   ```
   DEFAULT_ADMIN_EMAIL=votre@email.com
   DEFAULT_ADMIN_PASSWORD=votreMotDePasse123
   ```

2. **Modifier l'affichage dans la démo** (`demo/public/js/main.js`) :
   ```javascript
   // Ligne 70
   Mot de passe: ${defaultAdminPassword}
   ```

3. **Redémarrer les services :**
   ```bash
   # Supprimer la base de données existante
   rm server/prisma/dev.db
   
   # Redémarrer le serveur
   npm run dev
   ```

---

## ✅ Checklist pour la Présentation

- [ ] Les deux services (backend et demo) sont démarrés
- [ ] http://localhost:3001 est accessible
- [ ] Inscription fonctionne
- [ ] Connexion avec les identifiants par défaut fonctionne
- [ ] Création de projet fonctionne
- [ ] Invitation de collaborateur fonctionne
- [ ] Base de données SQLite est présente et fonctionnelle
- [ ] Actualisation de page conserve les données
- [ ] Tous les boutons de navigation fonctionnent

---

## 📞 Support

En cas de problème :

1. **Vérifier les logs du serveur** :
   ```bash
   tail -f /tmp/onesave-server.log
   tail -f /tmp/onesave-client.log
   ```

2. **Recréer la base de données** :
   ```bash
   cd server
   rm -f prisma/dev.db
   npm run setup:db:dev
   npm run dev
   ```

3. **Réinstaller les dépendances** :
   ```bash
   cd server
   rm -rf node_modules package-lock.json
   npm install
   
   cd ../demo
   rm -rf node_modules package-lock.json
   npm install
   ```

---

**Bon courage pour votre présentation BTS! 🎓**
