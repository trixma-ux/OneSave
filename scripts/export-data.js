/**
 * Script d'export des données OneSave en JSON
 * Usage: node scripts/export-data.js [output-file]
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const outputFile = process.argv[2] || `onesave_export_${Date.now()}.json`;

async function exportData() {
  try {
    console.log('🔄 Export des données en cours...');

    // Exporter toutes les données
    const data = {
      exportDate: new Date().toISOString(),
      utilisateurs: await prisma.utilisateur.findMany({
        select: {
          id: true,
          nom: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      projets: await prisma.projet.findMany({
        include: {
          moduleSpecifique: true,
        },
      }),
      evenements: await prisma.evenement.findMany(),
      notifications: await prisma.notification.findMany(),
      modules: await prisma.moduleSpecifique.findMany(),
    };

    // Écrire le fichier JSON
    const outputPath = path.join(process.cwd(), outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');

    console.log(`✅ Export terminé: ${outputPath}`);
    console.log(`📊 Statistiques:`);
    console.log(`   - Utilisateurs: ${data.utilisateurs.length}`);
    console.log(`   - Projets: ${data.projets.length}`);
    console.log(`   - Événements: ${data.evenements.length}`);
    console.log(`   - Notifications: ${data.notifications.length}`);
    console.log(`   - Modules: ${data.modules.length}`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'export:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();

