# 🚀 Déploiement Vercel - Guide Rapide

Votre projet GitHub est prêt! Maintenant, déployez sur Vercel en **2 minutes**.

## 📋 Prérequis

✅ Repo GitHub créé: `github.com/trixma-ux/OneSave`
✅ Code pushé sur GitHub
⏳ Compte Vercel (gratuit)

## 🎯 Option 1: Déploiement automatique (Recommandé)

### Étape 1: Se connecter à Vercel
```bash
npm install -g vercel
vercel login
```

### Étape 2: Déployer avec le script
```bash
bash vercel-deploy.sh
```

Le script va:
1. Vous authentifier sur Vercel
2. Déployer le frontend automatiquement
3. Vous donner l'URL publique

## 🎯 Option 2: Déploiement via Dashboard Vercel

### Étape 1: Aller sur Vercel
https://vercel.com/new

### Étape 2: Importer depuis GitHub
1. Cliquez "Import Git Repository"
2. Cherchez `OneSave`
3. Sélectionnez votre repo

### Étape 3: Configurer le projet
- **Framework**: Create React App
- **Root Directory**: `client` ← IMPORTANT!
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### Étape 4: Variables d'environnement
Ajouter **APRÈS** le déploiement du backend:
```
REACT_APP_API_URL=https://votre-backend-railway.com/api
```

### Étape 5: Deploy!
Cliquez "Deploy" - Vercel va builder et déployer automatiquement.

## ✨ Résultat

Quelques secondes après... votre app est en ligne! 🎉

**URL**: `https://onesave.vercel.app` (ou votre domaine)

## 🔗 Vérifications

```bash
# Voir votre projet Vercel
vercel

# Voir les logs de déploiement
vercel logs --follow

# Redéployer manuellement
vercel --prod
```

## 🔄 Redéploiement automatique

À chaque `git push`:
1. GitHub notifie Vercel
2. Vercel rebuild le projet
3. Nouvelle version en ligne en 30-60 secondes

**Aucune action requise!**

## ⚙️ Configuration des variables

Après déploiement du backend Railroad:

1. **Dashboard Vercel**: https://vercel.com/dashboard
2. Cliquez sur votre projet
3. **Settings** → **Environment Variables**
4. Ajouter:
   ```
   REACT_APP_API_URL=https://votre-railway-app.com/api
   ```
5. Redéployer (ou juste faire un `git push`)

## 🚀 Prochaines étapes

1. ✅ Déployer le frontend sur Vercel (CETTE ÉTAPE)
2. 👉 Configurer le backend sur Railway
3. 👉 Connecter frontend + backend
4. 👉 Tester en production

## 📚 Ressources

- [Vercel Docs](https://vercel.com/docs)
- [Vercel React Guide](https://vercel.com/guides/deploying-react-with-vercel)
- Fichier `.vercelignore` pour ignorer des fichiers

## ✅ Checklist final

- [ ] Compte Vercel créé
- [ ] Repo GitHub avec code
- [ ] Frontend déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Backend sur Railway
- [ ] URLs configurées
- [ ] Tests fonctionnels

## 🎉 Vous avez terminé!

Votre application est maintenant:
✅ Accessible mondialement
✅ Avec HTTPS automatique
✅ Sur CDN global
✅ Avec déploiement automatique

Félicitations! 🎊

