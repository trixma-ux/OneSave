import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();
const prisma = new PrismaClient();

// Obtenir tous les projets
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const projets = await prisma.projet.findMany({
      where: {
        utilisateurId: req.userId,
      },
      include: {
        evenements: true,
        moduleSpecifique: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(projets);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir un projet par ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const projet = await prisma.projet.findFirst({
      where: {
        id: req.params.id,
        utilisateurId: req.userId,
      },
      include: {
        evenements: true,
        moduleSpecifique: true,
        utilisateur: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
      },
    });

    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    res.json(projet);
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer un projet
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { titre, description, dateDebut, dateFin, statut, pourcentageAvancement } = req.body;

    if (!titre || !dateDebut) {
      return res.status(400).json({ message: 'Titre et date de début requis' });
    }

    const projet = await prisma.projet.create({
      data: {
        titre,
        description: description || null,
        dateDebut: new Date(dateDebut),
        dateFin: dateFin ? new Date(dateFin) : null,
        statut: statut || 'en_cours',
        pourcentageAvancement: pourcentageAvancement || 0,
        utilisateurId: req.userId!,
      },
      include: {
        evenements: true,
        moduleSpecifique: true,
      },
    });

    res.status(201).json(projet);
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour un projet
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { titre, description, dateDebut, dateFin, statut, pourcentageAvancement } = req.body;

    const projetExistant = await prisma.projet.findFirst({
      where: {
        id: req.params.id,
        utilisateurId: req.userId,
      },
    });

    if (!projetExistant) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    const projet = await prisma.projet.update({
      where: { id: req.params.id },
      data: {
        titre: titre || projetExistant.titre,
        description: description !== undefined ? description : projetExistant.description,
        dateDebut: dateDebut ? new Date(dateDebut) : projetExistant.dateDebut,
        dateFin: dateFin !== undefined ? (dateFin ? new Date(dateFin) : null) : projetExistant.dateFin,
        statut: statut || projetExistant.statut,
        pourcentageAvancement: pourcentageAvancement !== undefined ? pourcentageAvancement : projetExistant.pourcentageAvancement,
      },
      include: {
        evenements: true,
        moduleSpecifique: true,
      },
    });

    res.json(projet);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un projet
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const projetExistant = await prisma.projet.findFirst({
      where: {
        id: req.params.id,
        utilisateurId: req.userId,
      },
    });

    if (!projetExistant) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    await prisma.projet.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;

