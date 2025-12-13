#!/bin/bash

# Script de déploiement Vercel pour OneSave
# Usage: bash vercel-deploy.sh

set -e

echo "╔══════════════════════════════════════════════════════╗"
echo "║  🚀 DÉPLOIEMENT VERCEL AUTOMATISÉ                   ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installé"
fi

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Exécutez ce script à la racine du projet OneSave"
    exit 1
fi

echo ""
echo "📋 ÉTAPES:"
echo "1️⃣  Connexion à Vercel"
echo "2️⃣  Déploiement du frontend"
echo "3️⃣  Configuration des variables"
echo "4️⃣  Vérification du déploiement"
echo ""

# Étape 1: Connexion Vercel
echo "🔐 Connexion à Vercel..."
echo "   ⚠️  Un navigateur va s'ouvrir pour authentification"
echo ""
vercel login

# Récupérer le username Vercel
VERCEL_USER=$(vercel whoami)
echo "✅ Connecté en tant que: $VERCEL_USER"

# Étape 2: Déploiement
echo ""
echo "📤 Déploiement du frontend sur Vercel..."
echo "   (C'est normal si c'est la première fois, cela prendra 1-2 min)"
echo ""

# Déployer en production
cd "$(pwd)"
VERCEL_OUTPUT=$(vercel --prod --yes 2>&1 || true)
VERCEL_URL=$(echo "$VERCEL_OUTPUT" | grep -oE 'https://[^ ]+\.vercel\.app' | head -1)

if [ -z "$VERCEL_URL" ]; then
    echo "⚠️  Impossible de récupérer l'URL Vercel"
    echo "   Exécutez manuellement: vercel --prod"
    echo ""
else
    echo "✅ Frontend déployé: $VERCEL_URL"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 PROCHAINES ÉTAPES:"
echo ""
echo "1️⃣  Configurer Railway pour le backend:"
echo "   • Allez sur https://railway.app"
echo "   • Créer une nouvelle app"
echo "   • Importer le repo GitHub"
echo "   • Ajouter PostgreSQL"
echo "   • Notez l'URL du service"
echo ""
echo "2️⃣  Configurer les variables Vercel:"
echo "   • Dashboard Vercel → Votre projet"
echo "   • Settings → Environment Variables"
echo "   • Ajouter: REACT_APP_API_URL=<URL_RAILWAY>"
echo ""
echo "3️⃣  Redéployer après changement:"
echo "   • git push → Vercel redéploie automatiquement!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 URLs:"
if [ -n "$VERCEL_URL" ]; then
    echo "   Frontend: $VERCEL_URL"
else
    echo "   Frontend: https://onesave.vercel.app (ou votre URL)"
fi
echo "   Backend: À configurer sur Railway"
echo ""
echo "✨ Déploiement Vercel terminé!"
echo ""
