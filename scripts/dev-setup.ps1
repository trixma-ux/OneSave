#!/usr/bin/env pwsh
<#
.SYNOPSIS
    OneSave Local Development Setup & Launcher
.DESCRIPTION
    Automates setup, database initialization, and starts backend + frontend
.EXAMPLE
    .\scripts\dev-setup.ps1
    .\scripts\dev-setup.ps1 -SkipInstall
.NOTES
    Requires: Node.js 18+, npm 9+, PowerShell 5.1+
#>

param(
    [switch]$SkipInstall,
    [switch]$SkipDb,
    [switch]$BackendOnly,
    [switch]$FrontendOnly
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "  ✅ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "  ℹ️  $Message" -ForegroundColor Blue
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "  ❌ $Message" -ForegroundColor Red
}

# Check Node.js version
Write-Header "Checking Prerequisites"

$nodeVersion = node --version
$npmVersion = npm --version

Write-Info "Node.js: $nodeVersion (required: v18+)"
Write-Info "npm: $npmVersion (required: v9+)"

if ($nodeVersion -lt "v18.0.0") {
    Write-Error-Custom "Node.js 18+ required. Current: $nodeVersion"
    exit 1
}

# Install dependencies
if (-not $SkipInstall) {
    Write-Header "Installing Dependencies"
    
    Write-Info "Root dependencies..."
    npm install
    
    Write-Info "Server dependencies..."
    cd server
    npm install
    cd ..
    
    Write-Info "Client dependencies..."
    cd client
    npm install
    cd ..
    
    Write-Success "All dependencies installed"
} else {
    Write-Success "Skipping dependency installation (--SkipInstall)"
}

# Setup .env files
Write-Header "Checking Environment Variables"

if (-not (Test-Path "server/.env")) {
    Write-Info "Creating server/.env..."
    @"
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="dev_secret_$(Get-Random -Minimum 1000 -Maximum 9999)"
PORT=5000
NODE_ENV=development
"@ | Out-File -FilePath "server/.env" -Encoding UTF8
    Write-Success "server/.env created"
} else {
    Write-Success "server/.env exists"
}

if (-not (Test-Path "client/.env")) {
    Write-Info "Creating client/.env..."
    @"
REACT_APP_API_URL=http://localhost:5000/api
"@ | Out-File -FilePath "client/.env" -Encoding UTF8
    Write-Success "client/.env created"
} else {
    Write-Success "client/.env exists"
}

# Initialize database
if (-not $SkipDb) {
    Write-Header "Initializing Database"
    
    cd server
    
    Write-Info "Generating Prisma Client..."
    npm run prisma:generate
    
    Write-Info "Running migrations..."
    npm run prisma:migrate -- --name initial-schema
    
    cd ..
    
    Write-Success "Database initialized (SQLite: server/prisma/dev.db)"
} else {
    Write-Success "Skipping database initialization (--SkipDb)"
}

# Start services
Write-Header "Starting OneSave"

if ($FrontendOnly) {
    Write-Info "Starting Frontend only..."
    cd client
    npm start
} elseif ($BackendOnly) {
    Write-Info "Starting Backend only..."
    cd server
    npm run dev
} else {
    Write-Info "Starting Backend & Frontend..."
    Write-Host ""
    Write-Host "  📌 This will open Backend + Frontend in the same PowerShell window."
    Write-Host "     Use npm's concurrent command to run both."
    Write-Host ""
    Write-Info "Starting Backend (Terminal 1)..."
    Write-Info "Opening Frontend (Terminal 2)..."
    
    # Start backend in background (if supported)
    # For now, show instructions
    Write-Host ""
    Write-Host "  Open 2 terminals and run:" -ForegroundColor Yellow
    Write-Host "    Terminal 1: cd server && npm run dev" -ForegroundColor White
    Write-Host "    Terminal 2: cd client && npm start" -ForegroundColor White
    Write-Host ""
    Write-Host "  URLs:" -ForegroundColor Yellow
    Write-Host "    Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "    Backend:  http://localhost:5000" -ForegroundColor White
    Write-Host "    API:      http://localhost:5000/api" -ForegroundColor White
    Write-Host "    Studio:   http://localhost:5555" -ForegroundColor White
    Write-Host ""
}
