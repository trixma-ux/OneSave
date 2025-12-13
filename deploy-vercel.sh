#!/bin/bash

# Script de déploiement Vercel automatisé
# Usage: bash deploy-vercel.sh

set -e

echo "🚀 Déploiement OneSave sur Vercel"
echo "=================================="

# Vérifier si vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Exécutez ce script à la racine du projet"
    exit 1
fi

# Étape 1: Se connecter à Vercel
echo ""
echo "🔐 Connexion à Vercel..."
vercel login

# Étape 2: Déployer le frontend (client)
echo ""
echo "📤 Déploiement du frontend (client)..."
cd client
vercel --prod

# Récupérer l'URL du frontend
FRONTEND_URL=$(vercel list --prod | grep "onesave" | awk '{print $2}')
echo "✅ Frontend déployé: $FRONTEND_URL"

# Étape 3: Instructions pour le backend
echo ""
echo "⚠️  PROCHAINES ÉTAPES:"
echo "1. Déployer le backend sur Railway (gratuit):"
echo "   - Visitez: https://railway.app"
echo "   - Importez votre repo GitHub"
echo "   - Ajoutez une database PostgreSQL"
echo "   - Notez l'URL du backend"
echo ""
echo "2. Mettre à jour l'URL de l'API:"
echo "   - Dans Vercel Dashboard → Settings → Environment Variables"
echo "   - Ajoutez: REACT_APP_API_URL=<URL_DE_VOTRE_BACKEND>/api"
echo ""
echo "3. Redéployer après changement:"
echo "   vercel --prod"
echo ""
echo "🎉 Déploiement terminé!"
