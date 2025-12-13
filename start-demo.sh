#!/bin/bash

# OneSave Demo - Auto Setup Script
# This script sets up and starts OneSave for demo/presentation

set -e

RESET='\033[0m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'

echo -e "${BLUE}╔════════════════════════════════════════╗${RESET}"
echo -e "${BLUE}║   OneSave - Demo Setup & Launch        ║${RESET}"
echo -e "${BLUE}╚════════════════════════════════════════╝${RESET}"
echo ""

# Check Node.js
echo -e "${YELLOW}[1/5]${RESET} Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${RESET}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version) détecté${RESET}"
echo ""

# Setup server
echo -e "${YELLOW}[2/5]${RESET} Configuration du serveur..."
cd server
if [ ! -d "node_modules" ]; then
    echo -e "📦 Installation des dépendances..."
    npm install --quiet
fi
echo -e "${GREEN}✅ Serveur prêt${RESET}"
cd ..
echo ""

# Setup database
echo -e "${YELLOW}[3/5]${RESET} Initialisation de la base de données..."
cd server
if [ ! -f "prisma/dev.db" ]; then
    echo -e "🗄️ Création de la base de données SQLite..."
    npm run setup:db:dev --quiet
fi
npm run prisma:generate --quiet
echo -e "${GREEN}✅ Base de données SQLite initialisée${RESET}"
cd ..
echo ""

# Setup demo
echo -e "${YELLOW}[4/5]${RESET} Configuration de la démo HTML/CSS..."
cd demo
if [ ! -d "node_modules" ]; then
    echo -e "📦 Installation des dépendances..."
    npm install --quiet
fi
echo -e "${GREEN}✅ Démo prête${RESET}"
cd ..
echo ""

# Start services
echo -e "${YELLOW}[5/5]${RESET} Démarrage des services..."
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}║  Démarrage du serveur backend...       ║${RESET}"
echo -e "${GREEN}╚════════════════════════════════════════╝${RESET}"
echo ""

cd server
npm run dev &
SERVER_PID=$!
sleep 3

if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${RED}❌ Erreur: Le serveur n'a pas pu démarrer${RESET}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}║  Démarrage de la démo...              ║${RESET}"
echo -e "${GREEN}╚════════════════════════════════════════╝${RESET}"
echo ""

cd ../demo
DEMO_PORT=3001 npm run dev &
DEMO_PID=$!
sleep 2

if ! kill -0 $DEMO_PID 2>/dev/null; then
    echo -e "${RED}❌ Erreur: La démo n'a pas pu démarrer${RESET}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}║  ✅ OneSave est prêt !               ║${RESET}"
echo -e "${GREEN}╚════════════════════════════════════════╝${RESET}"
echo ""
echo -e "${BLUE}📱 Accès à l'application:${RESET}"
echo -e "   🌐 http://localhost:3001"
echo ""
echo -e "${BLUE}🔐 Identifiants:${RESET}"
echo -e "   Email:  admin@cnf.ci"
echo -e "   Mot de passe: admin123"
echo ""
echo -e "${BLUE}📊 Serveur API:${RESET}"
echo -e "   http://localhost:5000/api"
echo ""
echo -e "${YELLOW}💡 Pour arrêter:${RESET} Appuyez sur Ctrl+C"
echo ""

# Keep services running
wait
