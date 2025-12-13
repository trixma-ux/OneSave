# ⚡ OneSave - DÉMARRAGE EXPRESS (2 minutes)

## 🚀 Une seule commande pour tout lancer!

```bash
cd /home/stevegomon/Téléchargements/OneSave
./start-demo.sh
```

✅ Cela va:
1. Installer les dépendances
2. Initialiser la base de données SQLite
3. Démarrer le serveur API (port 5000)
4. Démarrer l'interface web (port 3001)

---

## 🌐 Accès Immédiat

```
📱 Ouvrir le navigateur:  http://localhost:3001
```

---

## 👤 Identifiants de Connexion

```
Email:    admin@cnf.ci
Mot de passe: admin123
```

---

## ✨ Fonctionnalités à Tester

✅ **Créer un projet** - Cliquer "Nouveau projet"  
✅ **Inviter un utilisateur** - Cliquer "Inviter" sur un projet  
✅ **S'inscrire** - Onglet "Inscription"  
✅ **Se connecter** - Avec différents comptes  
✅ **Voir les collaborations** - Menu gauche "En collaboration"  
✅ **Persistence** - F5 pour refresh (données conservées)  

---

## 🛠️ En Cas de Problème

### Port occupé?
```bash
# Chercher le processus
lsof -i :5000  # ou :3001
# Tuer le processus
kill -9 <PID>
# Relancer
./start-demo.sh
```

### Erreur base de données?
```bash
cd server
rm -f prisma/dev.db
npm run setup:db:dev
npm run dev
```

### Besoin de documentation complète?
- **DEMO_SETUP.md** - Guide pas à pas détaillé
- **DEMO_COMPLETE.md** - Documentation technique complète
- **FINAL_REPORT.md** - Rapport final pour le jury

---

## 💡 Conseils pour la Présentation

1. **Montrer l'inscription** - Créer un compte en direct
2. **Montrer la collaboration** - Inviter un utilisateur
3. **Montrer la persistence** - Rafraichir la page (F5)
4. **Montrer la sécurité** - Ouvrir DevTools (F12), onglet Network
5. **Montrer la base de données** - `ls -la server/prisma/dev.db`

---

## 📊 Statistiques Rapides

- **Frontend:** HTML/CSS vanille + Bootstrap 5
- **Backend:** Express.js + Prisma + TypeScript
- **Base de données:** SQLite (fichier local)
- **Authentification:** JWT + bcryptjs
- **Endpoints API:** 25+ routes complètes
- **Temps de setup:** < 5 minutes

---

**Prêt pour la présentation! 🎓**

*Besoin d'aide? Vérifier la documentation complète dans les fichiers .md*
