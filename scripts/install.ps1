# Script d'installation automatique pour OneSave (PowerShell)
# Usage: .\scripts\install.ps1

Write-Host "🚀 Installation de OneSave" -ForegroundColor Green
Write-Host ""

# Vérifier Node.js
Write-Host "📦 Vérification de Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion détecté" -ForegroundColor Green

# Installation des dépendances racine
Write-Host ""
Write-Host "📦 Installation des dépendances racine..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances racine" -ForegroundColor Red
    exit 1
}

# Installation des dépendances du serveur
Write-Host ""
Write-Host "📦 Installation des dépendances du serveur..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances du serveur" -ForegroundColor Red
    exit 1
}

# Créer le fichier .env pour le serveur s'il n'existe pas
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "📝 Création du fichier .env pour le serveur..." -ForegroundColor Yellow
    @"
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="onesave_jwt_secret_2024_changez_moi_en_production"
PORT=5000
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Fichier .env créé" -ForegroundColor Green
}

# Génération du client Prisma
Write-Host ""
Write-Host "🔧 Génération du client Prisma..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la génération du client Prisma" -ForegroundColor Red
    exit 1
}

# Migration de la base de données
Write-Host ""
Write-Host "🗄️  Migration de la base de données..." -ForegroundColor Yellow
npm run prisma:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la migration de la base de données" -ForegroundColor Red
    exit 1
}

# Installation des dépendances du client
Write-Host ""
Write-Host "📦 Installation des dépendances du client..." -ForegroundColor Yellow
Set-Location ../client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances du client" -ForegroundColor Red
    exit 1
}

# Créer le fichier .env pour le client s'il n'existe pas
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "📝 Création du fichier .env pour le client..." -ForegroundColor Yellow
    @"
REACT_APP_API_URL=http://localhost:5000/api
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Fichier .env créé" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "✅ Installation terminée avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "   1. Lancez l'application avec: npm run dev" -ForegroundColor White
Write-Host "   2. Ouvrez http://localhost:3000 dans votre navigateur" -ForegroundColor White
Write-Host "   3. Connectez-vous avec: admin@cnf.ci / admin123" -ForegroundColor White
Write-Host "   4. Changez le mot de passe après la première connexion !" -ForegroundColor Yellow
Write-Host ""

