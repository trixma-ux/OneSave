# 🆘 GUIDE DÉPANNAGE RAPIDE

*Solutions pour les problèmes les plus courants*

---

## 🔴 L'APP NE DÉMARRE PAS

### Problème: `EADDRINUSE: address already in use :::5000`

**Cause:** Un process utilise déjà le port 5000  
**Solution:**

```bash
# Kill tous les processes sur le port 5000
sudo lsof -ti:5000 | xargs kill -9

# ou avec netstat
sudo netstat -tulpn | grep 5000
sudo kill -9 <PID>

# Relancer
./start-demo.sh
```

---

### Problème: `EADDRINUSE: address already in use :::3001`

**Cause:** Un process utilise déjà le port 3001  
**Solution:**

```bash
# Kill tous les processes sur le port 3001
sudo lsof -ti:3001 | xargs kill -9

# ou simplement relancer le script
./start-demo.sh
```

---

### Problème: `DATABASE_URL not provided`

**Cause:** Le fichier `.env` n'existe pas ou mal configuré  
**Solution:**

```bash
# Vérifier que server/.env existe
cat server/.env

# Si absent, le créer:
cd server
cat > .env << 'EOF'
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=dev_secret_change_in_production
PORT=5000
NODE_ENV=development
DEFAULT_ADMIN_EMAIL=admin@cnf.ci
DEFAULT_ADMIN_PASSWORD=admin123
EOF

# Relancer
../start-demo.sh
```

---

### Problème: `Cannot find module '@prisma/client'`

**Cause:** npm dependencies pas installées  
**Solution:**

```bash
# Installer les dépendances backend
cd server
npm install

# Installer les dépendances demo
cd ../demo
npm install

# Relancer
cd ..
./start-demo.sh
```

---

### Problème: `ERR_MODULE_NOT_FOUND: No module named 'express'`

**Cause:** Node.js pas installé ou paths incorrects  
**Solution:**

```bash
# Vérifier que Node.js est installé
node -v  # Doit afficher v18+
npm -v   # Doit afficher 9+

# Si non installé, installer Node.js:
# macOS: brew install node
# Linux: sudo apt install nodejs npm
# Windows: Télécharger depuis nodejs.org

# Réinstaller les deps
cd /home/stevegomon/Téléchargements/OneSave/server
npm install
npm install -g prisma

cd ../demo
npm install

./start-demo.sh
```

---

### Problème: `Prisma schema not found`

**Cause:** Fichier schema.prisma manquant  
**Solution:**

```bash
# Vérifier que le fichier existe
ls -la server/prisma/schema.prisma

# S'il manque, créer un nouveau:
cd server
npx prisma init

# Puis ajouter la config DATABASE_URL et redémarrer
./start-demo.sh
```

---

### Problème: `ENOENT: no such file or directory, open 'start-demo.sh'`

**Cause:** Le script n'existe pas ou n'est pas exécutable  
**Solution:**

```bash
# Vérifier que le fichier existe
ls -la start-demo.sh

# Le rendre exécutable
chmod +x start-demo.sh

# Relancer
./start-demo.sh
```

---

## 🟠 CONNEXION NE FONCTIONNE PAS

### Problème: "Email ou mot de passe incorrect"

**Cause:** Admin user pas seeded dans la DB  
**Solution:**

```bash
# Vérifier que l'admin existe
cd server
node scripts/checkAdmin.js

# Si absent, seed l'admin:
npx prisma db seed

# Ou le créer manuellement:
npx prisma studio  # Interface graphique
# Créer utilisateur: admin@cnf.ci / admin123
# Puis relancer l'app

./start-demo.sh
```

---

### Problème: "Le serveur ne répond pas"

**Cause:** Backend pas lancé  
**Solution:**

```bash
# Vérifier que le backend est lancé
curl http://localhost:5000/api/health

# Si erreur, vérifier les logs:
ps aux | grep "node"

# Relancer:
cd server
npm start

# Ou simplement:
./start-demo.sh
```

---

### Problème: "CORS error in browser console"

**Cause:** Frontend et backend sur ports différents, CORS pas configuré  
**Solution:**

```bash
# Vérifier que demo/server.js existe:
cat demo/server.js | grep "cors"

# S'il y a une erreur CORS, ajouter:
const cors = require('cors');
app.use(cors());

# Relancer:
./start-demo.sh
```

---

## 🟡 DONNÉES NE SONT PAS SAUVEGARDÉES

### Problème: "Les projets disparaissent après refresh"

**Cause:** Frontend stocke localement mais l'API ne sauvegarde pas  
**Solution:**

```bash
# Vérifier que la DB SQLite existe:
ls -la server/prisma/dev.db

# Si absent, créer une nouvelle:
cd server
npx prisma migrate dev --name init

# Relancer:
./start-demo.sh
```

---

### Problème: "Base de données bloquée ou corrompue"

**Cause:** SQLite DB corrompue ou multiple instances en écriture  
**Solution:**

```bash
# Backup l'ancienne DB:
cp server/prisma/dev.db server/prisma/dev.db.backup

# Supprimer et recréer:
rm server/prisma/dev.db

# Réappliquer migrations:
cd server
npx prisma migrate deploy

# Relancer:
./start-demo.sh
```

---

## 🟢 LES LOGS NE MONTRENT RIEN

### Problème: "Je ne vois pas les errors"

**Solution:**

```bash
# Activer les logs détaillés:
DEBUG=* ./start-demo.sh

# Ou rediriger vers un fichier:
./start-demo.sh > app.log 2>&1

# Regarder les logs en direct:
tail -f app.log

# Ou voir les 50 dernières lignes:
tail -n 50 app.log
```

---

### Problème: "Où sont les logs du serveur?"

**Solution:**

```bash
# Les logs affichent directement dans le terminal

# Ou les sauvegarder:
./start-demo.sh 2>&1 | tee server.log

# Puis les lire:
cat server.log
```

---

## 🔵 PROBLÈMES DE DÉVELOPPEMENT

### Problème: "Je modifie le code mais ça ne change rien"

**Cause:** Le serveur ne reload pas automatiquement  
**Solution:**

```bash
# Installer nodemon (auto-reload):
cd server
npm install --save-dev nodemon

# Ajouter dans package.json:
"scripts": {
  "dev": "nodemon src/index.ts",
  "start": "ts-node src/index.ts"
}

# Relancer en mode dev:
npm run dev
```

---

### Problème: "TypeScript errors mais l'app fonctionne"

**Cause:** Les types ne sont pas stricts  
**Solution:**

```bash
# Vérifier la config TypeScript:
cat tsconfig.json

# Compiler et voir les erreurs:
npx tsc --noEmit

# Les corriger dans le code
```

---

### Problème: "Je veux voir la requête API complète"

**Solution:**

```bash
# Ouvrir DevTools (F12)
# Onglet Network
# Faire l'action dans l'app
# Cliquer sur la requête POST/GET
# Voir les headers et body

# Ou dans le terminal:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cnf.ci","motDePasse":"admin123"}'
```

---

## 🟣 RÉINITIALISER COMPLÈTEMENT

### "Je veux repartir from scratch"

```bash
# 1. Tuer tous les processes
sudo lsof -ti:5000 | xargs kill -9 2>/dev/null
sudo lsof -ti:3001 | xargs kill -9 2>/dev/null

# 2. Réinitialiser la base de données
cd /home/stevegomon/Téléchargements/OneSave/server
rm -f prisma/dev.db
npx prisma migrate deploy

# 3. Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

cd ../demo
rm -rf node_modules package-lock.json
npm install

# 4. Relancer
cd ..
./start-demo.sh
```

---

## ✅ VÉRIFICATION SYSTÈME

### "Comment vérifier que tout est OK?"

```bash
# 1. Vérifier Node.js
node -v  # Doit être v18+
npm -v   # Doit être 9+

# 2. Vérifier les ports sont libres
lsof -i :5000  # Doit être vide
lsof -i :3001  # Doit être vide

# 3. Vérifier les fichiers existent
ls -la server/.env
ls -la server/prisma/dev.db
ls -la demo/public/index.html
ls -la start-demo.sh

# 4. Vérifier l'API répond
curl http://localhost:5000/api/health

# 5. Vérifier l'app répond
curl http://localhost:3001
```

---

## 📞 SI RIEN NE MARCHE

### Option 1: Utiliser Docker (si installé)

```bash
# Créer un Dockerfile simple:
cd /home/stevegomon/Téléchargements/OneSave

# Puis:
docker build -t onesave .
docker run -p 5000:5000 -p 3001:3001 onesave
```

### Option 2: Installer Node.js proprement

```bash
# Supprimer l'ancienne install:
sudo apt remove nodejs npm

# Installer version LTS:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier:
node -v && npm -v

# Relancer:
./start-demo.sh
```

### Option 3: Support

Si rien n'a marché, consultez les documents:

```
1. DEMO_SETUP.md → Section "Dépannage"
2. README_DEV.md → Section "Troubleshooting"
3. DEMO_COMPLETE.md → Section "Common Issues"
```

---

## 🎯 CHECKLIST DÉPANNAGE

Avant de vous alarmer, vérifier dans cet ordre:

- [ ] Les ports 5000 et 3001 sont libres? (lsof -i :5000)
- [ ] Node.js est installé? (node -v)
- [ ] npm dependencies installées? (npm install)
- [ ] .env files existent? (cat server/.env)
- [ ] La DB existe? (ls server/prisma/dev.db)
- [ ] L'admin user existe? (node scripts/checkAdmin.js)
- [ ] Le script est exécutable? (chmod +x start-demo.sh)
- [ ] Les logs montrent des erreurs? (tail -f app.log)

---

## 💡 ASTUCES FINALE

1. **Toujours kill les anciens processes**
   ```bash
   sudo lsof -ti:5000,3001 | xargs kill -9
   ```

2. **Réinstaller en cas de doute**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Réinitialiser la DB en cas de problème**
   ```bash
   rm server/prisma/dev.db
   npx prisma migrate deploy
   ```

4. **Vérifier l'API en direct**
   ```bash
   curl http://localhost:5000/api/health
   ```

5. **Regarder les logs réels**
   ```bash
   tail -f app.log
   ```

---

**Bon courage! Vous avez tous les outils pour réussir! 🚀**

*Guide dépannage - 13 Décembre 2025*
