#!/bin/bash

# Script de sauvegarde de la base de données OneSave
# Usage: ./scripts/backup.sh

BACKUP_DIR="./backups"
DB_PATH="./server/prisma/dev.db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/onesave_backup_$TIMESTAMP.db"

# Créer le répertoire de sauvegarde s'il n'existe pas
mkdir -p "$BACKUP_DIR"

# Vérifier si la base de données existe
if [ ! -f "$DB_PATH" ]; then
    echo "❌ Erreur: La base de données n'existe pas à $DB_PATH"
    exit 1
fi

# Créer la sauvegarde
cp "$DB_PATH" "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Sauvegarde créée avec succès: $BACKUP_FILE"
    
    # Garder seulement les 10 dernières sauvegardes
    ls -t "$BACKUP_DIR"/onesave_backup_*.db | tail -n +11 | xargs -r rm
    
    echo "✅ Anciennes sauvegardes nettoyées (10 dernières conservées)"
else
    echo "❌ Erreur lors de la création de la sauvegarde"
    exit 1
fi

