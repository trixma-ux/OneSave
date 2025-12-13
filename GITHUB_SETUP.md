# 🚀 Guide GitHub & Déploiement OneSave

## ✅ État actuel

Votre projet **est déjà** initialisé avec Git:
- ✅ Branche `main` créée
- ✅ 2 commits effectués
- ✅ Tous les fichiers ajoutés

## 📋 Étapes pour déployer sur GitHub

### Étape 1️⃣: Créer un repo vide sur GitHub.com

1. Allez sur [github.com/new](https://github.com/new)
2. **Repository name**: `OneSave`
3. **Description**: `Collaborative project management application`
4. **Visibilité**: Public (recommandé pour Vercel gratuit) ou Private
5. **⚠️ IMPORTANT**: NE COCHEZ PAS "Initialize this repository with"
6. Cliquez "Create repository"

### Étape 2️⃣: Connecter votre repo local à GitHub

#### Option A: Script automatisé (Recommandé)

```bash
cd /home/stevegomon/Téléchargements/OneSave
bash github-setup.sh
```

Le script va:
- Demander votre username GitHub
- Configurer le remote `origin`
- Vérifier la connexion

#### Option B: Commandes manuelles

```bash
cd /home/stevegomon/Téléchargements/OneSave

# Remplacer VOTRE_USERNAME par votre username GitHub
git remote add origin https://github.com/VOTRE_USERNAME/OneSave.git
git branch -M main
git push -u origin main
```

### Étape 3️⃣: Pousser le code

```bash
# Option A: Script automatisé
bash push-to-github.sh

# Option B: Commandes manuelles
git add .
git commit -m "Initial commit: OneSave project"
git push -u origin main
```

**Vous serez demandé pour:**
- **Username GitHub**: Votre username
- **Password**: Votre token GitHub (voir section "Authentification")

## 🔐 Authentification GitHub

Si vous avez une erreur "Authentication failed", créez un token:

### Créer un Personal Access Token

1. Allez sur [github.com/settings/tokens](https://github.com/settings/tokens)
2. Cliquez "Generate new token (classic)"
3. **Token name**: `OneSave Deploy`
4. **Expiration**: 90 jours (ou plus)
5. **Scopes à sélectionner**:
   - ☑ `repo` (Full control of private repositories)
   - ☑ `admin:repo_hook` (Full control of repository hooks)
6. Cliquez "Generate token"
7. **Copiez le token** (vous ne pourrez plus le voir après)

### Utiliser le token

Quand Git demande le password:
- **Username**: Votre username GitHub
- **Password**: Le token que vous avez copié (coller avec Ctrl+Shift+V ou Cmd+V)

### Mémoriser le token (optionnel)

```bash
# Sur Linux/Mac
git config --global credential.helper store
git push  # Entrez une fois, ensuite c'est sauvegardé

# Sur Windows
git config --global credential.helper wincred
```

## ✅ Vérifier la connexion

Après le push, vérifiez:

```bash
# Voir les remotes configurés
git remote -v

# Vérifier les derniers commits
git log --oneline -3
```

Vous devriez voir quelque chose comme:
```
origin  https://github.com/VOTRE_USERNAME/OneSave.git (fetch)
origin  https://github.com/VOTRE_USERNAME/OneSave.git (push)
```

## 🌐 Vérifier sur GitHub

1. Allez sur `https://github.com/VOTRE_USERNAME/OneSave`
2. Vous devriez voir tous vos fichiers:
   - `client/` - Frontend React
   - `server/` - Backend Node.js
   - `docs/` - Documentation
   - Tous les fichiers README, scripts, etc.

## 🚀 Déploiement Vercel (Prochaine étape)

Une fois que votre repo est sur GitHub:

1. Allez sur [vercel.com/new](https://vercel.com/new)
2. Cliquez "Import Git Repository"
3. Connectez votre compte GitHub
4. Sélectionnez le repo `OneSave`
5. Vercel va automatiquement:
   - Configurer le build pour React
   - Déployer à chaque push
   - Générer une URL publique

## 📝 Workflow Git quotidien

Après modifications:

```bash
# 1. Voir les changements
git status

# 2. Ajouter les fichiers
git add .

# 3. Créer un commit
git commit -m "Description de vos changements"

# 4. Pousser vers GitHub
git push

# ✨ Vercel redéploie automatiquement!
```

## 🔄 Synchroniser depuis GitHub

Si vous modifiez directement sur GitHub:

```bash
git pull origin main
```

## ⚡ Commandes utiles

```bash
# Voir l'état
git status

# Voir les fichiers à commiter
git diff

# Voir l'historique
git log --oneline

# Voir les remotes
git remote -v

# Changer de branche
git checkout -b nouvelle-branche

# Créer un commit sans pousser
git commit -m "Message"

# Pousser une branche spécifique
git push origin ma-branche
```

## 🐛 Dépannage

### "fatal: 'origin' does not appear to be a 'git' repository"
```bash
git remote add origin https://github.com/VOTRE_USERNAME/OneSave.git
```

### "permission denied" ou "Authentication failed"
- Vérifiez votre token GitHub
- Vérifiez que vous avez créé le repo vide sur GitHub

### "The requested URL returned error: 401"
- Le token a expiré
- Créez un nouveau token: https://github.com/settings/tokens

### Push très lent ou bloqué
- Vérifiez votre connexion internet
- Essayez avec `--verbose`: `git push -u origin main --verbose`

## ✨ Prochaines étapes

1. ✅ Créer repo GitHub
2. ✅ Pousser le code
3. 👉 Connecter Vercel
4. 👉 Configurer le backend (Railway)
5. 👉 Tester en production

Consultez `DEPLOY_VERCEL.md` pour les prochaines étapes!

