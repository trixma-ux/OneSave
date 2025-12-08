# Documentation Technique - OneSave

## Vue d'ensemble

OneSave est une application web locale de gestion de projets développée pour le Campus Numérique Francophone (CNF). L'application utilise une architecture full-stack avec React pour le frontend et Node.js/Express pour le backend, avec SQLite comme base de données locale.

## Architecture

### Stack Technique

#### Frontend
- **React 18** avec TypeScript
- **React Router** pour la navigation
- **Tailwind CSS** pour le style
- **Chart.js** pour les graphiques
- **Axios** pour les appels API
- **React Toastify** pour les notifications

#### Backend
- **Node.js** avec Express
- **TypeScript** pour la sécurité de types
- **Prisma ORM** pour la gestion de la base de données
- **SQLite** comme base de données locale
- **bcryptjs** pour le hachage des mots de passe
- **jsonwebtoken** pour l'authentification

### Structure du Projet

```
OneSave/
├── client/                 # Application React
│   ├── src/
│   │   ├── components/    # Composants React réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── context/       # Context API (AuthContext)
│   │   ├── services/      # Services API
│   │   └── utils/         # Utilitaires
│   ├── public/            # Fichiers publics (manifest, service worker)
│   └── package.json
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── routes/        # Routes API
│   │   ├── middleware/    # Middleware (authentification)
│   │   ├── utils/         # Utilitaires (notifications, init admin)
│   │   └── index.ts       # Point d'entrée
│   ├── prisma/            # Schéma Prisma
│   └── package.json
├── docs/                  # Documentation
└── scripts/               # Scripts d'automatisation
```

## Base de Données

### Schéma Prisma

#### Utilisateur
- `id` (String, CUID)
- `nom` (String)
- `email` (String, unique)
- `motDePasseHashe` (String)
- `role` (String: "admin" | "utilisateur")
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### Projet
- `id` (String, CUID)
- `titre` (String)
- `description` (String?)
- `dateDebut` (DateTime)
- `dateFin` (DateTime?)
- `statut` (String: "en_cours" | "termine" | "annule" | "planifie")
- `pourcentageAvancement` (Int, 0-100)
- `utilisateurId` (String, FK)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### Evenement
- `id` (String, CUID)
- `nom` (String)
- `date` (DateTime)
- `description` (String?)
- `projetId` (String?, FK)
- `utilisateurId` (String, FK)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### Notification
- `id` (String, CUID)
- `message` (String)
- `dateEcheance` (DateTime?)
- `type` (String: "info" | "warning" | "error" | "success")
- `lu` (Boolean)
- `utilisateurId` (String, FK)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### ModuleSpecifique
- `id` (String, CUID)
- `nomModule` (String)
- `typeProgramme` (String: "CLAC" | "IFADEM" | "GAF")
- `details` (String?)
- `projetId` (String, FK, unique)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## API Routes

### Authentification (`/api/auth`)
- `POST /login` - Connexion
- `POST /register` - Inscription
- `GET /me` - Obtenir l'utilisateur courant
- `PUT /change-password` - Changer le mot de passe

### Projets (`/api/projets`)
- `GET /` - Liste des projets
- `GET /:id` - Détails d'un projet
- `POST /` - Créer un projet
- `PUT /:id` - Mettre à jour un projet
- `DELETE /:id` - Supprimer un projet

### Événements (`/api/evenements`)
- `GET /` - Liste des événements
- `GET /:id` - Détails d'un événement
- `GET /prochain/upcoming` - Événements à venir
- `POST /` - Créer un événement
- `PUT /:id` - Mettre à jour un événement
- `DELETE /:id` - Supprimer un événement

### Notifications (`/api/notifications`)
- `GET /` - Liste des notifications
- `GET /non-lues` - Notifications non lues
- `PUT /:id/lire` - Marquer comme lue
- `PUT /lire-toutes` - Marquer toutes comme lues
- `DELETE /:id` - Supprimer une notification

### Modules (`/api/modules`)
- `GET /` - Liste des modules
- `GET /:id` - Détails d'un module
- `POST /` - Créer un module
- `PUT /:id` - Mettre à jour un module
- `DELETE /:id` - Supprimer un module

### Rapports (`/api/rapports`)
- `GET /statistiques` - Statistiques générales
- `GET /projets-par-mois` - Projets par mois
- `GET /modules-par-type` - Modules par type

## Sécurité

### Authentification
- Utilisation de JWT (JSON Web Tokens) pour l'authentification
- Tokens stockés dans le localStorage du client
- Middleware `authenticateToken` pour protéger les routes
- Tokens expirent après 7 jours

### Hachage des mots de passe
- Utilisation de bcryptjs avec un salt de 10 rounds
- Mots de passe jamais stockés en clair

### Validation
- Validation des données côté serveur
- Protection contre les injections SQL (via Prisma)
- Protection CORS configurée

## PWA (Progressive Web App)

### Service Worker
- Cache des ressources statiques
- Stratégie Network First, puis Cache
- Fonctionne hors ligne pour les ressources mises en cache

### Manifest
- Configuration pour l'installation
- Icônes et thème configurés
- Mode standalone

## Notifications Automatiques

Le service de notifications vérifie périodiquement :
- Les projets dont l'échéance est dans les 3 prochains jours
- Les projets en retard (date de fin dépassée)
- Les événements à venir dans les 24 prochaines heures

Les vérifications s'exécutent toutes les heures.

## Installation et Déploiement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
1. Cloner le projet
2. Installer les dépendances :
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```
3. Configurer les variables d'environnement :
   - Créer `.env` dans `server/` à partir de `.env.example`
4. Initialiser la base de données :
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
5. Lancer l'application :
   ```bash
   npm run dev
   ```

### Build de Production
```bash
cd client && npm run build
cd ../server && npm run build
```

## Tests

### Backend
Les tests peuvent être ajoutés avec Jest ou Mocha.

### Frontend
Les tests peuvent être ajoutés avec React Testing Library.

## Performance

### Optimisations
- Chargement asynchrone des données
- Mise en cache côté client
- Service Worker pour le cache offline
- Lazy loading des composants (à implémenter)

### Base de données
- Index sur les champs fréquemment recherchés
- Relations optimisées avec Prisma

## Maintenance

### Sauvegarde
- La base de données SQLite peut être sauvegardée manuellement
- Scripts de sauvegarde automatique recommandés (à implémenter)

### Logs
- Logs côté serveur pour le débogage
- Gestion des erreurs avec try/catch

## Prochaines Étapes

- [ ] Tests unitaires et d'intégration
- [ ] Export/Import de données (JSON sécurisé)
- [ ] Recherche et filtres avancés
- [ ] Notifications push (si en ligne)
- [ ] Mode sombre
- [ ] Multi-langues (au-delà du français)
- [ ] Gestion des pièces jointes
- [ ] Export PDF des rapports

