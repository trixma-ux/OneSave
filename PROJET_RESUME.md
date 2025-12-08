# Résumé du Projet OneSave

## 🎯 Objectif

Créer une application web locale, sécurisée, rapide et fonctionnelle hors ligne pour la gestion des projets, la planification des rencontres et la collaboration entre la CNF, l'OIF et ses partenaires (CLAC, IFADEM, GAF).

## ✅ Fonctionnalités Implémentées

### 1. Authentification
- ✅ Connexion/Inscription sécurisée
- ✅ Hachage des mots de passe (bcrypt)
- ✅ Authentification JWT
- ✅ Gestion des rôles (admin, utilisateur)
- ✅ Changement de mot de passe

### 2. Gestion des Projets
- ✅ CRUD complet (Créer, Lire, Modifier, Supprimer)
- ✅ Suivi de l'avancement (pourcentage)
- ✅ Statuts (planifié, en cours, terminé, annulé)
- ✅ Dates de début et de fin
- ✅ Description détaillée

### 3. Gestion des Événements
- ✅ CRUD complet
- ✅ Liaison avec les projets
- ✅ Dates et heures
- ✅ Description
- ✅ Affichage des événements à venir

### 4. Modules Spécifiques
- ✅ Modules CLAC, IFADEM, GAF
- ✅ Association avec les projets
- ✅ Détails personnalisés

### 5. Notifications
- ✅ Notifications automatiques
- ✅ Échéances proches (3 jours)
- ✅ Projets en retard
- ✅ Événements à venir (24h)
- ✅ Marquer comme lues

### 6. Rapports et Statistiques
- ✅ Tableau de bord avec vue d'ensemble
- ✅ Graphiques (Chart.js)
- ✅ Statistiques par statut
- ✅ Statistiques par type de module
- ✅ Évolution des projets par mois

### 7. PWA (Progressive Web App)
- ✅ Service Worker
- ✅ Manifest.json
- ✅ Fonctionne hors ligne
- ✅ Installable

### 8. Interface Utilisateur
- ✅ Design moderne (Tailwind CSS)
- ✅ Responsive (desktop, tablette, mobile)
- ✅ Navigation intuitive
- ✅ 100% en français
- ✅ Notifications toast

## 📁 Structure du Projet

```
OneSave/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── context/       # Context API
│   │   ├── services/      # Services API
│   │   └── App.tsx        # Composant principal
│   ├── public/            # Fichiers publics
│   └── package.json
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── routes/        # Routes API
│   │   ├── middleware/    # Middleware
│   │   ├── utils/         # Utilitaires
│   │   └── index.ts       # Point d'entrée
│   ├── prisma/            # Schéma Prisma
│   └── package.json
├── docs/                  # Documentation
│   ├── TECHNIQUE.md       # Documentation technique
│   ├── UTILISATEUR.md     # Guide utilisateur
│   └── ARCHITECTURE.md    # Architecture
├── scripts/               # Scripts utilitaires
│   ├── backup.sh          # Sauvegarde (Linux/Mac)
│   ├── backup.ps1         # Sauvegarde (Windows)
│   └── export-data.js     # Export des données
├── README.md              # Documentation principale
├── QUICK_START.md         # Guide de démarrage rapide
└── CHANGELOG.md           # Historique des versions
```

## 🗄️ Base de Données

### Tables
1. **utilisateurs** - Authentification et profils
2. **projets** - Gestion des projets
3. **evenements** - Planification des événements
4. **notifications** - Notifications automatiques
5. **modules_specifiques** - Modules CLAC, IFADEM, GAF

### Relations
- Utilisateur → Projets (1-N)
- Projet → Événements (1-N)
- Projet → Module Spécifique (1-1)
- Utilisateur → Notifications (1-N)
- Utilisateur → Événements (1-N)

## 🔒 Sécurité

- ✅ Mots de passe hashés (bcrypt)
- ✅ Authentification JWT
- ✅ Protection CORS
- ✅ Validation des données
- ✅ Isolation des données par utilisateur
- ✅ Protection contre les injections SQL (Prisma)

## 🚀 Démarrage

### Installation
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### Configuration
1. Créer `.env` dans `server/`
2. Créer `.env` dans `client/`
3. Initialiser la base de données :
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

### Lancement
```bash
npm run dev
```

### Accès
- Frontend : http://localhost:3000
- Backend : http://localhost:5000
- Compte admin : admin@cnf.ci / admin123

## 📊 Technologies Utilisées

### Frontend
- React 18 + TypeScript
- React Router
- Tailwind CSS
- Chart.js
- Axios
- React Toastify

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite
- bcryptjs
- jsonwebtoken

## 📚 Documentation

- **README.md** - Documentation principale
- **QUICK_START.md** - Guide de démarrage rapide
- **docs/TECHNIQUE.md** - Documentation technique détaillée
- **docs/UTILISATEUR.md** - Guide utilisateur complet
- **docs/ARCHITECTURE.md** - Architecture du système

## 🎨 Interface

- Design moderne et épuré
- Couleurs : Bleu (#2563eb) comme couleur principale
- Typography : Système de polices par défaut
- Icons : Heroicons
- Responsive : Mobile-first

## 🔄 Notifications Automatiques

Le système vérifie automatiquement :
- Échéances de projets (3 jours avant)
- Projets en retard
- Événements à venir (24h avant)

Vérification toutes les heures.

## 📱 PWA

- Service Worker actif
- Cache des ressources
- Fonctionne hors ligne
- Installable sur appareils

## 🛠️ Scripts Utilitaires

- **backup.sh / backup.ps1** - Sauvegarde de la base de données
- **export-data.js** - Export des données en JSON

## ✅ Statut du Projet

### Complété
- ✅ Authentification
- ✅ Gestion des projets
- ✅ Gestion des événements
- ✅ Modules spécifiques
- ✅ Notifications
- ✅ Rapports
- ✅ PWA
- ✅ Documentation

### À Améliorer (Futures Versions)
- [ ] Tests unitaires et d'intégration
- [ ] Export/Import sécurisé
- [ ] Recherche avancée
- [ ] Notifications push
- [ ] Mode sombre
- [ ] Gestion des pièces jointes
- [ ] Export PDF

## 📞 Support

Pour toute question :
1. Consultez la documentation
2. Vérifiez les logs
3. Contactez l'administrateur

## 📄 Licence

MIT License - CNF Côte d'Ivoire

---

**OneSave** - Application de gestion de projets pour le Campus Numérique Francophone
Développé avec ❤️ pour la promotion de la Francophonie en Côte d'Ivoire

