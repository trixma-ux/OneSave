import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import prisma from './utils/prisma';
import authRoutes from './routes/auth.routes';
import projetRoutes from './routes/projet.routes';
import evenementRoutes from './routes/evenement.routes';
import notificationRoutes from './routes/notification.routes';
import moduleRoutes from './routes/module.routes';
import rapportRoutes from './routes/rapport.routes';
import { initializeAdminUser } from './utils/initAdmin';
import { startNotificationScheduler } from './utils/notificationService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV === 'development';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projets', projetRoutes);
app.use('/api/evenements', evenementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/rapports', rapportRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'OneSave API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React build in production
// This allows a single Express server to serve both API and frontend
if (!isDev) {
  const buildPath = path.join(__dirname, '../../client/build');
  app.use(express.static(buildPath));

  // Handle client-side routing - send all non-API routes to index.html
  app.get('*', (req, res) => {
    // Skip API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(buildPath, 'index.html'));
    } else {
      res.status(404).json({ message: 'API endpoint not found' });
    }
  });

  console.log(`📁 Serving static files from: ${buildPath}`);
}

// Démarrage du serveur uniquement si ce fichier est le point d'entrée
// (node dist/index.js, nodemon/ts-node). Quand les tests importent `app`,
// on ne lance ni listen() (évite EADDRINUSE :5000), ni le scheduler, ni l'init admin.
export function startServer() {
// Initialisation de l'utilisateur admin au démarrage
initializeAdminUser().catch(console.error);

// Démarrer le planificateur de notifications
startNotificationScheduler();

return app.listen(PORT, () => {
  console.log(`\n🚀 OneSave Server Started`);
  console.log(`  📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  🔗 API URL: http://localhost:${PORT}/api`);
  if (!isDev) {
    console.log(`  🌐 Frontend URL: http://localhost:${PORT}`);
  }
  console.log(`📊 Base de données: ${process.env.DATABASE_URL}`);
  console.log(`🔔 Service de notifications activé`);
  console.log('');
});
}

if (require.main === module) {
  startServer();
}

// Gestion de l'arrêt propre
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
export { prisma };

