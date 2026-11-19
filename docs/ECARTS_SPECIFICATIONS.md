# OneSave : écarts entre la documentation et le code (audit du 19/11/2026)

Il n'existe pas de cahier des charges formel (aucun PDF, DOCX ni fichier « cahier ») dans le dépôt.
Référentiel utilisé : README.md, PROJET_RESUME.md, docs/ARCHITECTURE.md, docs/TECHNIQUE.md et docs/UTILISATEUR.md.

| Exigence documentée | État réel | Gravité |
|---|---|---|
| Collaboration CNF/OIF/partenaires | Les invitations existent (`/projets/:id/invite`, `members`), mais `GET /api/projets` ne renvoie que les projets dont l'utilisateur est propriétaire. Un collaborateur invité ne voit donc jamais le projet partagé. Le statut d'invitation vaut `acceptee` par défaut, sans workflow d'acceptation. Aucun modèle Organisation/partenaire n'existe. | Majeure |
| Notifications automatiques | Le backend (scheduler et routes `/api/notifications`) existe, mais aucune page ni aucun badge côté client ne les affiche. | Majeure |
| Mode hors ligne (PWA) | Le service worker met en cache `/static/js/main.js` et `/static/css/main.css`, des noms qui n'existent pas (les fichiers CRA sont hachés). Il n'y a ni cache des données ni file d'attente hors ligne : l'app ne fonctionne pas hors ligne. | Majeure |
| Modules CLAC/IFADEM/GAF | Seule la création existe (depuis ProjetDetail). Aucun écran ne permet de lister, modifier ou supprimer un module, alors que l'API le permet. | Moyenne |
| Gestion des rôles (admin) | `requireAdmin` n'est utilisé nulle part. Il n'y a ni administration des utilisateurs ni vue globale pour l'admin. | Moyenne |
| Rapports | Les statistiques et graphiques fonctionnent. Il n'y a pas d'export PDF/CSV depuis l'interface : `scripts/export-data.js` est uniquement en CLI. | Moyenne |
| Validation des données | `zod` est installé mais jamais utilisé. La validation se limite à des tests de champs manquants. | Moyenne |
| Chiffrement des données sensibles | Non implémenté (seuls les mots de passe sont hachés). | Moyenne |
| Base de données et déploiement | Il n'y a pas de dossier `prisma/migrations`, alors que le README et le CI appellent `prisma migrate`. SQLite est incompatible avec Vercel serverless. Le client utilise `localhost:5000` par défaut si `REACT_APP_API_URL` n'est pas défini. | Majeure (prod) |
| Structure annoncée (controllers/, models/, hooks/, utils/ côté client) | Absente : la logique est dans les fichiers de routes. | Faible |

Points conformes : authentification JWT/bcrypt, changement de mot de passe, CRUD des projets et des événements, tableau de bord, graphiques Chart.js, interface en français et responsive.
