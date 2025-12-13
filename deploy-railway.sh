#!/bin/bash

# Script de déploiement Railway automatisé
# Usage: bash deploy-railway.sh

set -e

echo "🚀 Déploiement OneSave Backend sur Railway"
echo "=========================================="

# Vérifier si railway CLI est installé
if ! command -v railway &> /dev/null; then
    echo "📦 Installation de Railway CLI..."
    npm install -g @railway/cli
fi

# Vérifier si on est dans le bon répertoire
if [ ! -f "server/package.json" ]; then
    echo "❌ Erreur: Exécutez ce script à la racine du projet"
    exit 1
fi

# Étape 1: Se connecter à Railway
echo ""
echo "🔐 Connexion à Railway..."
railway login

# Étape 2: Créer le projet Railway
echo ""
echo "📝 Créer une nouvelle application Railway..."
cd server
railway init

# Étape 3: Ajouter une base de données PostgreSQL
echo ""
echo "🗄️  Ajout d'une base de données PostgreSQL..."
echo "⚠️  Allez dans le dashboard Railway et ajoutez une database PostgreSQL"
echo "   ou exécutez: railway add postgresql"

# Étape 4: Configurer les variables d'environnement
echo ""
echo "🔐 Configuration des variables d'environnement..."
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set DEFAULT_ADMIN_EMAIL=admin@cnf.ci
railway variables set DEFAULT_ADMIN_PASSWORD=admin123

# Étape 5: Exécuter les migrations
echo ""
echo "📊 Exécution des migrations de base de données..."
railway run npm run prisma:migrate -- --skip-generate

# Étape 6: Déployer
echo ""
echo "📤 Déploiement du backend..."
railway up

echo ""
echo "✅ Backend déployé sur Railway!"
echo ""
echo "🔗 Votre URL Railway: railway.app/dashboard"
echo "   (consultez le domaine de votre service)"
echo ""
