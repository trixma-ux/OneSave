const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

(async function () {
  const prisma = new PrismaClient();
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@cnf.ci';
    const user = await prisma.utilisateur.findUnique({ where: { email: adminEmail } });
    console.log('Admin found:', !!user);
    if (user) {
      console.log(JSON.stringify({ id: user.id, email: user.email, role: user.role }, null, 2));
    } else {
      console.log('Creating admin user with defaults...');
      const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const created = await prisma.utilisateur.create({
        data: {
          nom: 'Administrateur',
          email: adminEmail,
          motDePasseHashe: hashedPassword,
          role: 'admin',
        },
      });
      console.log('Admin user created:', JSON.stringify({ id: created.id, email: created.email }, null, 2));
    }
  } catch (err) {
    console.error('Error checking/creating admin:', err);
  } finally {
    await (await prisma).$disconnect();
  }
})();
