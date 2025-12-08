#!/bin/bash

# Script d'installation automatique pour OneSave (Linux/Mac)
# Usage: ./scripts/install.sh

echo "🚀 Installation de OneSave"
echo ""

# Vérifier Node.js
echo "📦 Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION détecté"

# Installation des dépendances racine
echo ""
echo "📦 Installation des dépendances racine..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances racine"
    exit 1
fi

# Installation des dépendances du serveur
echo ""
echo "📦 Installation des dépendances du serveur..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances du serveur"
    exit 1
fi

# Créer le fichier .env pour le serveur s'il n'existe pas
if [ ! -f ".env" ]; then
    echo ""
    echo "📝 Création du fichier .env pour le serveur..."
    cat > .env << EOF
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="onesave_jwt_secret_2024_changez_moi_en_production"
PORT=5000
NODE_ENV=development
EOF
    echo "✅ Fichier .env créé"
fi

# Génération du client Prisma
echo ""
echo "🔧 Génération du client Prisma..."
npm run prisma:generate
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la génération du client Prisma"
    exit 1
fi

# Migration de la base de données
echo ""
echo "🗄️  Migration de la base de données..."
npm run prisma:migrate
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la migration de la base de données"
    exit 1
fi

# Installation des dépendances du client
echo ""
echo "📦 Installation des dépendances du client..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances du client"
    exit 1
fi

# Créer le fichier .env pour le client s'il n'existe pas
if [ ! -f ".env" ]; then
    echo ""
    echo "📝 Création du fichier .env pour le client..."
    echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
    echo "✅ Fichier .env créé"
fi

cd ..

echo ""
echo "✅ Installation terminée avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Lancez l'application avec: npm run dev"
echo "   2. Ouvrez http://localhost:3000 dans votre navigateur"
echo "   3. Connectez-vous avec: admin@cnf.ci / admin123"
echo "   4. Changez le mot de passe après la première connexion !"
echo ""

