#!/bin/bash

# Script pour connecter le repo local à GitHub et pousser le code
# Usage: bash github-setup.sh

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║  🚀 Configuration GitHub pour OneSave                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Demander le username GitHub
read -p "👤 Entrez votre username GitHub: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Username GitHub requis"
    exit 1
fi

REPO_URL="https://github.com/$GITHUB_USERNAME/OneSave.git"

echo ""
echo "📋 Informations de configuration:"
echo "   • Repo: $REPO_URL"
echo "   • Branche: main"
echo ""

# Vérifier si le remote origin existe déjà
if git remote get-url origin 2>/dev/null; then
    echo "⚠️  Un remote 'origin' existe déjà"
    read -p "Voulez-vous le remplacer? (y/n): " REPLACE
    if [[ "$REPLACE" =~ ^[Yy]$ ]]; then
        git remote remove origin
        echo "✅ Remote origin supprimé"
    else
        echo "❌ Opération annulée"
        exit 1
    fi
fi

# Ajouter le remote origin
echo ""
echo "🔗 Connexion au repo GitHub..."
git remote add origin "$REPO_URL"
echo "✅ Remote origin configuré"

# Vérifier la connexion
echo ""
echo "🧪 Test de connexion..."
if git ls-remote --heads "$REPO_URL" &>/dev/null; then
    echo "✅ Connexion au repo réussie"
else
    echo "⚠️  Impossible de vérifier le repo (peut être normal si vide)"
fi

# Afficher le status
echo ""
echo "📊 Status Git:"
git remote -v
git log --oneline -3

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📤 PRÊT À POUSSER LE CODE!"
echo ""
echo "Exécutez pour pousser:"
echo "  git push -u origin main"
echo ""
echo "⚠️  SI VOUS N'AVEZ PAS ENCORE CRÉÉ LE REPO:"
echo "  1. Allez sur https://github.com/new"
echo "  2. Créez un repo nommé 'OneSave'"
echo "  3. NE COCHEZ PAS 'Initialize with README'"
echo "  4. Puis exécutez: git push -u origin main"
echo ""
