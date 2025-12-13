import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/prisma';

const router = express.Router();

// Statistiques générales
router.get('/statistiques', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const projets = await prisma.projet.findMany({
      where: {
        utilisateurId: req.userId,
      },
    });

    const evenements = await prisma.evenement.findMany({
      where: {
        utilisateurId: req.userId,
      },
    });

    const notifications = await prisma.notification.findMany({
      where: {
        utilisateurId: req.userId,
        lu: false,
      },
    });

    // Statistiques par statut de projet
    const projetsParStatut = {
      en_cours: projets.filter((p) => p.statut === 'en_cours').length,
      termine: projets.filter((p) => p.statut === 'termine').length,
      annule: projets.filter((p) => p.statut === 'annule').length,
      planifie: projets.filter((p) => p.statut === 'planifie').length,
    };

    // Moyenne d'avancement
    const moyenneAvancement =
      projets.length > 0
        ? projets.reduce((acc, p) => acc + p.pourcentageAvancement, 0) / projets.length
        : 0;

    // Événements à venir (7 prochains jours)
    const maintenant = new Date();
    const dans7Jours = new Date();
    dans7Jours.setDate(dans7Jours.getDate() + 7);

    const evenementsProchains = evenements.filter(
      (e) => e.date >= maintenant && e.date <= dans7Jours
    );

    // Projets en retard (date de fin dépassée et statut non terminé)
    const projetsEnRetard = projets.filter(
      (p) => p.dateFin && p.dateFin < maintenant && p.statut !== 'termine'
    );

    res.json({
      totalProjets: projets.length,
      totalEvenements: evenements.length,
      notificationsNonLues: notifications.length,
      projetsParStatut,
      moyenneAvancement: Math.round(moyenneAvancement),
      evenementsProchains: evenementsProchains.length,
      projetsEnRetard: projetsEnRetard.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Statistiques des projets par mois
router.get('/projets-par-mois', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const projets = await prisma.projet.findMany({
      where: {
        utilisateurId: req.userId,
      },
      orderBy: {
        dateDebut: 'asc',
      },
    });

    const projetsParMois: { [key: string]: number } = {};

    projets.forEach((projet) => {
      const mois = new Date(projet.dateDebut).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
      });
      projetsParMois[mois] = (projetsParMois[mois] || 0) + 1;
    });

    res.json(projetsParMois);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets par mois:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Statistiques des modules par type de programme
router.get('/modules-par-type', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const projets = await prisma.projet.findMany({
      where: {
        utilisateurId: req.userId,
      },
      include: {
        moduleSpecifique: true,
      },
    });

    const modulesParType: { [key: string]: number } = {
      CLAC: 0,
      IFADEM: 0,
      GAF: 0,
    };

    projets.forEach((projet) => {
      if (projet.moduleSpecifique) {
        const type = projet.moduleSpecifique.typeProgramme;
        if (modulesParType[type]) {
          modulesParType[type]++;
        }
      }
    });

    res.json(modulesParType);
  } catch (error) {
    console.error('Erreur lors de la récupération des modules par type:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;

