# OneSave - Application de Gestion de Projets CNF

Application web locale, sécurisée et fonctionnelle hors ligne pour la gestion des projets, la planification des rencontres et la collaboration entre la CNF, l'OIF et ses partenaires (CLAC, IFADEM, GAF).

## 🚀 Fonctionnalités

- ✅ Gestion complète des projets (création, suivi, clôture)
- ✅ Planification des rencontres et événements
- ✅ Génération de rapports statistiques
- ✅ Notifications automatiques pour les échéances
- ✅ Personnalisation pour des modules spécifiques (CLAC, IFADEM, GAF)
- ✅ Mode hors ligne (PWA)
- ✅ Authentification sécurisée
- ✅ Interface 100% en français

## 🛠️ Technologies

### Frontend
- React 18 avec TypeScript
- React Router pour la navigation
- Chart.js pour les graphiques
- Tailwind CSS pour le style
- Workbox pour le service worker

### Backend
- Node.js avec Express
- Prisma ORM
- SQLite pour le stockage local
- bcrypt pour le hachage des mots de passe
- jsonwebtoken pour l'authentification

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- Git

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd OneSave
```

2. **Installer les dépendances**
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

3. **Configurer la base de données**
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. **Lancer l'application**
```bash
npm run dev
```

L'application sera disponible sur :
- Frontend : http://localhost:3000
- Backend : http://localhost:5000

## 📁 Structure du projet

```
OneSave/
├── client/                 # Application React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── context/       # Context API
│   │   └── utils/         # Utilitaires
│   ├── public/            # Fichiers publics (manifest, icons)
│   └── package.json
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── routes/        # Routes API
│   │   ├── controllers/   # Contrôleurs
│   │   ├── middleware/    # Middleware (auth, validation)
│   │   ├── models/        # Modèles Prisma
│   │   └── utils/         # Utilitaires
│   ├── prisma/            # Schéma Prisma
│   └── package.json
├── docs/                  # Documentation
└── scripts/               # Scripts d'automatisation
```

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT
- Validation des données
- Protection CORS
- Chiffrement des données sensibles

## 📱 PWA

L'application est configurée comme Progressive Web App :
- Fonctionne hors ligne
- Installable sur appareils mobiles
- Cache des ressources statiques
- Service Worker actif

## 📚 Documentation

Consultez la documentation complète dans le dossier `/docs` :
- `TECHNIQUE.md` - Documentation technique
- `UTILISATEUR.md` - Guide utilisateur
- `ARCHITECTURE.md` - Architecture du projet

## 👤 Utilisation par défaut

**Premier utilisateur (admin)**
- Email: admin@cnf.ci
- Mot de passe: admin123

⚠️ **Important** : Changez le mot de passe par défaut après la première connexion.

## 📝 Licence

MIT License - CNF Côte d'Ivoire

## 👥 Auteur

Développé pour le Campus Numérique Francophone (CNF) - Côte d'Ivoire

