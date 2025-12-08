# Script d'installation complète pour OneSave
# Exécutez ce script dans PowerShell : .\INSTALLER_MAINTENANT.ps1

Write-Host "🚀 Installation de OneSave" -ForegroundColor Green
Write-Host ""

# Vérifier Node.js
Write-Host "📦 Vérification de Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js n'est pas installé. Installez-le depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion détecté" -ForegroundColor Green

# Étape 1 : Installation des dépendances racine
Write-Host ""
Write-Host "📦 Étape 1/5 : Installation des dépendances racine..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances racine" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dépendances racine installées" -ForegroundColor Green

# Étape 2 : Installation des dépendances du serveur
Write-Host ""
Write-Host "📦 Étape 2/5 : Installation des dépendances du serveur..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances du serveur" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dépendances du serveur installées" -ForegroundColor Green

# Vérifier/Créer le fichier .env du serveur
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

# Étape 3 : Génération du client Prisma
Write-Host ""
Write-Host "🔧 Étape 3/5 : Génération du client Prisma..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la génération du client Prisma" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Client Prisma généré" -ForegroundColor Green

# Étape 4 : Migration de la base de données
Write-Host ""
Write-Host "🗄️  Étape 4/5 : Création de la base de données..." -ForegroundColor Yellow
npm run prisma:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la création de la base de données" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Base de données créée" -ForegroundColor Green

Set-Location ..

# Étape 5 : Installation des dépendances du client
Write-Host ""
Write-Host "📦 Étape 5/5 : Installation des dépendances du client..." -ForegroundColor Yellow
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances du client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dépendances du client installées" -ForegroundColor Green

# Vérifier/Créer le fichier .env du client
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "📝 Création du fichier .env pour le client..." -ForegroundColor Yellow
    "REACT_APP_API_URL=http://localhost:5000/api" | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Fichier .env créé" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "✅ Installation terminée avec succès !" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Lancez l'application avec :" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Ouvrez votre navigateur sur :" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Connectez-vous avec :" -ForegroundColor White
Write-Host "   Email : admin@cnf.ci" -ForegroundColor Cyan
Write-Host "   Mot de passe : admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT : Changez le mot de passe après la première connexion !" -ForegroundColor Yellow
Write-Host ""

