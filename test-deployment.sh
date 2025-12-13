#!/bin/bash

# Script de test post-déploiement
# Teste la connectivity des serveurs déployés

echo "🧪 Test du déploiement OneSave"
echo "=============================="
echo ""

# Demander l'URL du frontend
read -p "Entrez l'URL du frontend Vercel (ex: https://onesave.vercel.app): " FRONTEND_URL
read -p "Entrez l'URL du backend Railway (ex: https://your-api.railway.app): " BACKEND_URL

echo ""
echo "🔍 Test du frontend..."
if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q "200"; then
    echo "✅ Frontend accessible"
else
    echo "❌ Frontend non accessible"
fi

echo ""
echo "🔍 Test du backend..."
if curl -s "$BACKEND_URL/api/health" | grep -q "ok"; then
    echo "✅ Backend opérationnel"
else
    echo "⚠️  Impossible de contacter le backend"
fi

echo ""
echo "🧪 Test d'authentification..."
RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cnf.ci","motDePasse":"admin123"}')

if echo "$RESPONSE" | grep -q "token"; then
    echo "✅ Authentification fonctionne"
    TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "   Token: ${TOKEN:0:20}..."
else
    echo "❌ Authentification échouée"
    echo "   Réponse: $RESPONSE"
fi

echo ""
echo "🎉 Tests terminés!"
