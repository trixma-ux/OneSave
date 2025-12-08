# Script de sauvegarde de la base de données OneSave (PowerShell)
# Usage: .\scripts\backup.ps1

$BackupDir = ".\backups"
$DbPath = ".\server\prisma\dev.db"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = Join-Path $BackupDir "onesave_backup_$Timestamp.db"

# Créer le répertoire de sauvegarde s'il n'existe pas
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

# Vérifier si la base de données existe
if (-not (Test-Path $DbPath)) {
    Write-Host "❌ Erreur: La base de données n'existe pas à $DbPath" -ForegroundColor Red
    exit 1
}

# Créer la sauvegarde
Copy-Item $DbPath $BackupFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Sauvegarde créée avec succès: $BackupFile" -ForegroundColor Green
    
    # Garder seulement les 10 dernières sauvegardes
    Get-ChildItem -Path $BackupDir -Filter "onesave_backup_*.db" | 
        Sort-Object LastWriteTime -Descending | 
        Select-Object -Skip 10 | 
        Remove-Item -Force
    
    Write-Host "✅ Anciennes sauvegardes nettoyées (10 dernières conservées)" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de la création de la sauvegarde" -ForegroundColor Red
    exit 1
}

