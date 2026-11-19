import prisma from './prisma';
import bcrypt from 'bcryptjs';
import { isDevLikeEnv } from './config';

const INSECURE_DEFAULT_PASSWORDS = ['admin123', 'admin', 'password', 'changeme'];

/**
 * Crée l'administrateur initial à partir de DEFAULT_ADMIN_EMAIL / DEFAULT_ADMIN_PASSWORD.
 * - development/test : valeurs de démo admin@cnf.ci / admin123 si non définies.
 * - production : les deux variables sont obligatoires et un mot de passe faible
 *   (admin123, etc.) est refusé ; aucun admin n'est alors créé.
 */
export async function initializeAdminUser() {
  const dev = isDevLikeEnv();
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || (dev ? 'admin@cnf.ci' : '');
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || (dev ? 'admin123' : '');

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️  DEFAULT_ADMIN_EMAIL / DEFAULT_ADMIN_PASSWORD non définis : aucun admin initial créé.');
    return;
  }
  if (!dev && (INSECURE_DEFAULT_PASSWORDS.includes(adminPassword) || adminPassword.length < 10)) {
    console.error('❌ DEFAULT_ADMIN_PASSWORD trop faible pour la production (ex. admin123 refusé, 10 caractères min.) : admin non créé.');
    return;
  }

  try {
    const existingAdmin = await prisma.utilisateur.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.utilisateur.create({
        data: {
          nom: 'Administrateur',
          email: adminEmail,
          motDePasseHashe: hashedPassword,
          role: 'admin',
        },
      });
      console.log(`✅ Utilisateur administrateur créé (${adminEmail})`);
      if (dev) console.log('⚠️  Identifiants de démo : à ne jamais utiliser en production');
    } else {
      console.log('ℹ️  Utilisateur administrateur existe déjà');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de l\'admin:', error);
  }
}
