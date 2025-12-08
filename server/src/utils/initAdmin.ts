import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function initializeAdminUser(prisma: PrismaClient) {
  const adminEmail = 'admin@cnf.ci';
  const adminPassword = 'admin123';

  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.utilisateur.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      // Créer l'utilisateur admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.utilisateur.create({
        data: {
          nom: 'Administrateur',
          email: adminEmail,
          motDePasseHashe: hashedPassword,
          role: 'admin',
        },
      });
      console.log('✅ Utilisateur administrateur créé avec succès');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Mot de passe: ${adminPassword}`);
      console.log('⚠️  Veuillez changer le mot de passe après la première connexion');
    } else {
      console.log('ℹ️  Utilisateur administrateur existe déjà');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de l\'admin:', error);
  }
}

