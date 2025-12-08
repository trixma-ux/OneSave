# Architecture - OneSave

## Vue d'Ensemble de l'Architecture

OneSave suit une architecture full-stack modulaire avec séparation claire entre le frontend et le backend.

## Architecture Frontend (React)

### Structure des Composants

```
src/
├── components/          # Composants réutilisables
│   ├── Layout.tsx      # Layout principal avec sidebar
│   └── PrivateRoute.tsx # Route protégée par authentification
├── pages/              # Pages de l'application
│   ├── Dashboard.tsx   # Tableau de bord
│   ├── Projets.tsx     # Liste des projets
│   ├── ProjetDetail.tsx # Détails d'un projet
│   ├── Evenements.tsx  # Gestion des événements
│   ├── Rapports.tsx    # Statistiques et rapports
│   ├── Profile.tsx     # Profil utilisateur
│   ├── Login.tsx       # Page de connexion
│   └── Register.tsx    # Page d'inscription
├── context/            # Context API
│   └── AuthContext.tsx # Gestion de l'authentification
├── services/           # Services API
│   └── api.ts          # Client API Axios
└── App.tsx             # Composant principal
```

### Flux de Données

1. **Authentification** : Gérée via Context API (AuthContext)
2. **Appels API** : Centralisés dans le service `api.ts`
3. **État Local** : Géré avec React Hooks (useState, useEffect)
4. **Navigation** : React Router pour le routage

### Gestion d'État

- **Context API** : Pour l'authentification globale
- **État Local** : Pour les données spécifiques à chaque composant
- **Props** : Pour la communication entre composants

## Architecture Backend (Node.js/Express)

### Structure du Serveur

```
server/
├── src/
│   ├── index.ts              # Point d'entrée
│   ├── routes/               # Routes API
│   │   ├── auth.routes.ts    # Routes d'authentification
│   │   ├── projet.routes.ts  # Routes des projets
│   │   ├── evenement.routes.ts # Routes des événements
│   │   ├── notification.routes.ts # Routes des notifications
│   │   ├── module.routes.ts  # Routes des modules
│   │   └── rapport.routes.ts # Routes des rapports
│   ├── middleware/           # Middleware
│   │   └── auth.middleware.ts # Authentification JWT
│   └── utils/                # Utilitaires
│       ├── initAdmin.ts      # Initialisation admin
│       └── notificationService.ts # Service de notifications
└── prisma/                   # Schéma Prisma
    └── schema.prisma         # Modèle de données
```

### Flux de Requêtes

1. **Requête Client** → Express Router
2. **Middleware d'Authentification** → Vérification du JWT
3. **Route Handler** → Traitement de la requête
4. **Prisma ORM** → Interaction avec SQLite
5. **Réponse** → Retour au client

### Sécurité

- **JWT** : Authentification stateless
- **bcrypt** : Hachage des mots de passe
- **CORS** : Protection cross-origin
- **Validation** : Validation des données entrantes

## Base de Données (SQLite)

### Relations

```
Utilisateur (1) ──── (N) Projet
Projet (1) ──── (N) Evenement
Projet (1) ──── (1) ModuleSpecifique
Utilisateur (1) ──── (N) Notification
Utilisateur (1) ──── (N) Evenement
```

### Index

- Index sur `email` (Utilisateur) pour les recherches rapides
- Index sur `utilisateurId` pour les jointures
- Index sur `date` (Evenement) pour les requêtes de dates
- Index sur `dateFin` (Projet) pour les vérifications d'échéances

## PWA (Progressive Web App)

### Service Worker

- **Cache Strategy** : Network First, puis Cache
- **Installation** : Via manifest.json
- **Offline** : Fonctionne hors ligne pour les ressources mises en cache

### Manifest

- Configuration pour l'installation
- Icônes et thème
- Mode standalone

## Notifications Automatiques

### Système de Notifications

Le service de notifications s'exécute en arrière-plan :
1. **Vérification périodique** : Toutes les heures
2. **Détection des échéances** : Projets se terminant dans 3 jours
3. **Détection des retards** : Projets en retard
4. **Événements à venir** : Dans les 24 prochaines heures
5. **Création de notifications** : Stockées en base de données

## Sécurité

### Authentification

1. **Login** : Vérification email/mot de passe
2. **Génération JWT** : Token valide 7 jours
3. **Stockage** : Token dans localStorage (client)
4. **Vérification** : Middleware sur chaque requête protégée

### Autorisation

- **Rôles** : Admin et Utilisateur
- **Isolation** : Chaque utilisateur ne voit que ses propres données
- **Validation** : Vérification de propriété avant modification/suppression

## Performance

### Optimisations Frontend

- **Lazy Loading** : Chargement différé des composants (à implémenter)
- **Memoization** : Utilisation de React.memo (à implémenter)
- **Code Splitting** : Division du code en chunks (à implémenter)

### Optimisations Backend

- **Requêtes Optimisées** : Utilisation de Prisma pour des requêtes efficaces
- **Cache** : Mise en cache des données fréquemment accédées (à implémenter)
- **Pagination** : Pour les grandes listes (à implémenter)

## Scalabilité

### Limitations Actuelles

- **SQLite** : Base de données locale, limitée à un seul utilisateur simultané
- **Pas de clustering** : Application monolithique
- **Pas de load balancing** : Serveur unique

### Améliorations Possibles

- Migration vers PostgreSQL/MySQL pour le multi-utilisateurs
- Microservices pour la scalabilité
- Redis pour le cache
- CDN pour les assets statiques

## Déploiement

### Développement

- Frontend : `npm start` (port 3000)
- Backend : `npm run dev` (port 5000)
- Base de données : SQLite locale

### Production

- Build frontend : `npm run build`
- Build backend : `npm run build`
- Serveur : Node.js avec PM2 recommandé
- Base de données : SQLite (ou migration vers PostgreSQL)

## Monitoring et Logs

### Logs

- **Console** : Logs de développement
- **Fichiers** : Logs de production (à implémenter)
- **Erreurs** : Gestion avec try/catch

### Monitoring

- **Santé** : Route `/api/health`
- **Métriques** : À implémenter (Prometheus, etc.)

## Tests

### Tests Unitaires

- Frontend : React Testing Library (à implémenter)
- Backend : Jest (à implémenter)

### Tests d'Intégration

- Tests API : Supertest (à implémenter)
- Tests E2E : Cypress ou Playwright (à implémenter)

## Maintenance

### Sauvegarde

- **Base de données** : Sauvegarde manuelle du fichier SQLite
- **Automatisation** : Scripts de sauvegarde (à implémenter)

### Mises à Jour

- **Dépendances** : Mise à jour régulière
- **Sécurité** : Patchs de sécurité
- **Fonctionnalités** : Ajouts progressifs

## Conclusion

L'architecture de OneSave est conçue pour être :
- **Modulaire** : Facile à maintenir et étendre
- **Sécurisée** : Authentification et autorisation robustes
- **Performante** : Optimisée pour une utilisation locale
- **Évolutive** : Prête pour des améliorations futures

