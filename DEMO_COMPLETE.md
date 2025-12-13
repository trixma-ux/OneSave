# 🎯 OneSave - Application Complète de Gestion de Projets

**Version:** 1.0.0 (Production Ready)  
**Date:** 13 Décembre 2025  
**Pour:** Présentation BTS - Campus Numérique Francophone

---

## 📋 Vue d'ensemble

OneSave est une application web collaborative de gestion de projets, conçue pour permettre à plusieurs utilisateurs de :

✅ **S'inscrire et se connecter** avec authentification JWT sécurisée  
✅ **Créer et gérer des projets** avec progression et statuts  
✅ **Collaborer** en invitant d'autres utilisateurs sur les projets  
✅ **Consulter les événements** et rapports liés aux projets  
✅ **Conserver les données** grâce à SQLite persistant  

---

## 🚀 Lancement en 2 Minutes

### Méthode Rapide (Recommandée)

```bash
cd /home/stevegomon/Téléchargements/OneSave
./start-demo.sh
```

**Accès :** http://localhost:3001

### Méthode Manuelle

**Terminal 1 - Backend:**
```bash
cd /home/stevegomon/Téléchargements/OneSave/server
npm run dev
```

**Terminal 2 - Frontend Demo:**
```bash
cd /home/stevegomon/Téléchargements/OneSave/demo
npm install  # Premier démarrage seulement
npm run dev
```

---

## 👤 Comptes de Test

| Role | Email | Mot de passe | Détails |
|------|-------|-------------|---------|
| **Admin** | `admin@cnf.ci` | `admin123` | Créé automatiquement, tous droits |
| **Demo** | `demo@example.com` | `demo123` | Pour tester l'inscription |
| **Nouveau** | Créez-en un | Votre choix | Inscription en direct dans l'appli |

---

## 🎨 Architecture Technique

### Frontend (Demo)
- **Technologie:** HTML5 + CSS3 + Bootstrap 5 + JavaScript Vanilla
- **Port:** 3001
- **Fichiers:** `demo/public/index.html`, `demo/public/js/main.js`, `demo/css/styles.css`
- **Rôle:** Interface utilisateur, proxy API

### Backend (API)
- **Technologie:** Node.js + Express.js + Prisma ORM
- **Port:** 5000
- **Base de données:** SQLite (`server/prisma/dev.db`)
- **Authentification:** JWT (7 jours de validité)
- **Sécurité:** Hachage bcryptjs des mots de passe

### Base de Données
```
Utilisateurs (email, mot de passe hashé, rôle)
├── Projets (titre, description, dates, statut, progression)
│   ├── Événements (nom, date, description)
│   └── Modules Spécifiques (CLAC, IFADEM, GAF)
├── Notifications (pour tâches et échéances)
└── Rapports (statistiques et analyses)
```

---

## 📚 Fonctionnalités Complètes

### 1. Authentification
- **Inscription:** Créer un compte avec nom, email, mot de passe
- **Connexion:** Email + mot de passe avec JWT
- **Déconnexion:** Effacement du token et du localStorage
- **Profil:** Affichage des infos utilisateur (nom, email, rôle)

### 2. Gestion de Projets
- **Créer:** Nouveau projet avec titre, description, dates, statut
- **Lister:** Vue de tous les projets personnels
- **Détails:** Accès aux informations complètes du projet
- **Modifier:** Changement de statut (planifié → en cours → terminé)
- **Progression:** Suivi du pourcentage d'avancement
- **Supprimer:** Suppression avec confirmation
- **Inviter:** Partage du projet avec d'autres utilisateurs

### 3. Collaboration
- **Invitations:** Envoyer des invitations pour rejoindre un projet
- **Projets Partagés:** Accès aux projets en collaboration
- **Permissions:** Gestion des droits d'accès (lecture/écriture)
- **Notifications:** Alertes pour les changements d'état

### 4. Événements
- **Créer:** Ajouter des événements à un projet
- **Planifier:** Dates et heures d'événements
- **Associer:** Lier les événements aux projets
- **Consulter:** Liste des événements chronologiques

### 5. Rapports
- **Générer:** Création de rapports de progression
- **Statistiques:** Nombre de projets, avancement moyen
- **Exporter:** (Fonction future) Télécharger en PDF/Excel

---

## 🔒 Sécurité

### Authentification JWT
```typescript
// Génération du token
const token = jwt.sign(
  { userId: utilisateur.id, role: utilisateur.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Vérification à chaque requête
Authorization: Bearer <token>
```

### Hachage des Mots de Passe
```typescript
// Hachage avec bcryptjs (salt: 10 rounds)
const hashedPassword = await bcrypt.hash(password, 10);

// Vérification lors de la connexion
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### Protection des Données
- ✅ Validation des inputs (Zod schema)
- ✅ CORS activé pour communications sécurisées
- ✅ Environnement de développement isolé (SQLite local)
- ✅ Mots de passe jamais stockés en clair

---

## 📊 Scenario de Démonstration (15 min)

### Préparation (2 min)
1. Lancer `./start-demo.sh`
2. Attendre les messages ✅
3. Ouvrir http://localhost:3001

### Démonstration (10 min)

**[2-3 min] Authentification**
- Montrer page login
- Se connecter: `admin@cnf.ci` / `admin123`
- Afficher le profil

**[3-4 min] Créer un Projet**
1. Cliquer "Nouveau projet"
2. Remplir:
   - Titre: "Projet Digital CNF 2025"
   - Description: "Transformation numérique du CNF"
   - Date de début: aujourd'hui
   - Statut: "En cours"
3. Créer le projet
4. Montrer dans la liste

**[2-3 min] Collaboration**
1. Cliquer "Inviter" sur le projet
2. Entrer: "demo@example.com"
3. Déconnecter (Logout)
4. Se connecter: `demo@example.com` / `demo123`
5. Montrer le projet en "Collaboration"

**[Bonus - 2 min] Créer un Compte**
1. Aller à inscription
2. Créer: "Marie Durand" / "marie@cnf.ci" / "password123"
3. Montrer le nouveau compte actif

---

## 🛠️ Dépannage

### ❌ Port 5000 ou 3001 utilisé

```bash
# Trouver le processus
lsof -i :5000  # ou :3001

# Tuer le processus
kill -9 <PID>

# Relancer
./start-demo.sh
```

### ❌ Erreur base de données

```bash
cd server
rm -f prisma/dev.db
npm run setup:db:dev
npm run dev
```

### ❌ Modules npm manquants

```bash
cd server && npm install
cd ../demo && npm install
./start-demo.sh
```

### ✅ Vérifier la connexion API

```bash
curl http://localhost:5000/api/health
```

---

## 📁 Structure des Fichiers

```
OneSave/
├── 📄 DEMO_SETUP.md              # Guide détaillé de configuration
├── 📄 README.md                  # Documentation générale
├── 🔧 start-demo.sh              # Script automatisé
│
├── server/                        # Backend API
│   ├── src/
│   │   ├── 📝 index.ts           # Point d'entrée serveur
│   │   ├── utils/
│   │   │   ├── initAdmin.ts      # Création admin auto
│   │   │   └── notificationService.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts    # Login, inscription, profil
│   │   │   ├── projet.routes.ts  # CRUD projets
│   │   │   ├── evenement.routes.ts
│   │   │   └── rapport.routes.ts
│   │   └── middleware/
│   │       └── auth.middleware.ts # Vérification JWT
│   ├── prisma/
│   │   ├── schema.prisma         # Modèle de données
│   │   ├── dev.db               # 📊 Base de données SQLite
│   │   └── migrations/           # Historique changements DB
│   ├── .env                      # Variables d'environnement
│   └── package.json
│
├── demo/                          # Interface HTML/CSS
│   ├── public/
│   │   ├── 🎨 index.html         # Structure HTML complète
│   │   └── js/
│   │       └── main.js           # Logique métier JavaScript
│   ├── css/
│   │   └── styles.css            # Styling Bootstrap + custom
│   ├── 🖥️ server.js              # Serveur Express + proxy
│   └── package.json
│
└── client/                        # (Optionnel) App React
    ├── src/
    │   ├── pages/
    │   ├── context/AuthContext.tsx
    │   └── services/api.ts
    └── .env
```

---

## 🔧 Configuration Personnalisable

### Changer les identifiants admin

**1. Modifier `server/.env` :**
```bash
DEFAULT_ADMIN_EMAIL=votre@email.com
DEFAULT_ADMIN_PASSWORD=VotreMotDePasse123!
```

**2. Supprimer l'ancienne base de données :**
```bash
rm server/prisma/dev.db
```

**3. Redémarrer :**
```bash
./start-demo.sh
```

### Changer les ports

**Backend (port 5000) :**
```bash
PORT=5001 npm run dev  # Dans server/
```

**Frontend (port 3001) :**
```bash
DEMO_PORT=3002 npm run dev  # Dans demo/
```

---

## 📈 Statistiques du Projet

| Métrique | Valeur |
|----------|--------|
| **Lignes de code** | ~2,500 |
| **Fichiers** | 40+ |
| **Endpoints API** | 25+ |
| **Modèles DB** | 6 tables |
| **Dépendances** | 30+ packages |
| **Temps de setup** | < 5 minutes |

---

## 🎓 Pour le Jury BTS

### Points Forts à Présenter

✅ **Architecture moderne:** Séparation frontend/backend, JWT, Prisma ORM  
✅ **Base de données:** SQLite persistant, migrations Prisma, modèle relationnel  
✅ **Authentification:** Sécurisée avec JWT et bcryptjs  
✅ **Collaboration:** Invitation d'utilisateurs, gestion des droits  
✅ **UX/UI:** Interface responsive, Bootstrap 5, animations CSS  
✅ **Fonctionnalités:** CRUD complet, gestion d'état, notifications  
✅ **Code:** TypeScript, middleware, validation, gestion erreurs  
✅ **DevOps:** Scripts d'installation, .env, configuration flexible  

### Points Techniques à Défendre

1. **Pourquoi SQLite?** Léger, aucune dépendance serveur, synchrone, parfait pour local
2. **Pourquoi JWT?** Stateless, sécurisé, compatible avec les APIs modernes
3. **Pourquoi Prisma?** Type-safe, migrations auto, performance, développeur-friendly
4. **Pourquoi HTML/CSS vanille?** Léger, pas de dépendance complexe, performant
5. **Pourquoi cette architecture?** Scalable, testable, maintenable, profesionnelle

---

## 📞 Support & Contact

En cas de problème lors de la présentation:

1. **Vérifier les logs :**
   ```bash
   ps aux | grep node  # Voir les processus
   tail -f /tmp/onesave-server.log
   ```

2. **Redémarrer :**
   ```bash
   pkill -f "node\|npm"
   ./start-demo.sh
   ```

3. **Recréer la base :**
   ```bash
   cd server
   rm -f prisma/dev.db prisma/*.db-shm prisma/*.db-wal
   npm run setup:db:dev
   npm run dev
   ```

---

## ✨ Améliorations Futures

- [ ] Rôles et permissions granulaires
- [ ] Notifications real-time (WebSocket)
- [ ] Intégration calendrier (Google Calendar, Outlook)
- [ ] Téléchargement rapports (PDF, Excel)
- [ ] Commentaires et discussions sur projets
- [ ] Dashboard avec graphiques avancés
- [ ] Export/Import données (CSV, JSON)
- [ ] Mode hors ligne (PWA Service Worker)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Tests unitaires complets (Jest, Cypress)

---

## 📄 Licences

**OneSave** © 2025 - MIT License  
CNF Côte d'Ivoire

**Dépendances principales :**
- Express.js (MIT)
- Prisma (Apache 2.0)
- Bootstrap 5 (MIT)
- bcryptjs (MIT)
- jsonwebtoken (MIT)

---

**Prêt pour la présentation! Bon courage! 🎓**

*Dernière mise à jour: 13 Décembre 2025*
