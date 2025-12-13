#!/bin/bash

# Script simple pour pousser vers GitHub
# Usage: bash push-to-github.sh

set -e

echo "📤 Vérification du repo GitHub..."

# Vérifier que origin est configuré
if ! git remote get-url origin &>/dev/null; then
    echo "❌ Erreur: Aucun remote 'origin' configuré"
    echo "   Exécutez d'abord: bash github-setup.sh"
    exit 1
fi

REMOTE_URL=$(git remote get-url origin)
echo "✅ Remote trouvé: $REMOTE_URL"

echo ""
echo "📝 Ajout des fichiers..."
git add .

echo "✅ Fichiers ajoutés"

echo ""
echo "💬 Message de commit: "
read -p "Entrez le message (défaut: 'Update project'): " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-"Update project"}

echo ""
echo "📦 Création du commit..."
git commit -m "$COMMIT_MSG" --allow-empty
echo "✅ Commit créé"

echo ""
echo "🚀 Push vers GitHub..."
git push -u origin main

echo ""
echo "✨ Terminé!"
echo "🌐 Votre repo est maintenant sur: $REMOTE_URL"
