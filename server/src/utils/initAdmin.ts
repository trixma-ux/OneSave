import prisma from './prisma';
import bcrypt from 'bcryptjs';

// Lis les valeurs par défaut depuis l'environnement pour faciliter les tests
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@cnf.ci';
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

export async function initializeAdminUser() {
  const adminEmail = DEFAULT_ADMIN_EMAIL;
  const adminPassword = DEFAULT_ADMIN_PASSWORD;

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
      // N'afficher le mot de passe que si la valeur par défaut est utilisée
      console.log(`🔑 Mot de passe: ${adminPassword}`);
      console.log('⚠️  Veuillez changer le mot de passe après la première connexion');
    } else {
      console.log('ℹ️  Utilisateur administrateur existe déjà');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de l\'admin:', error);
  }
}

