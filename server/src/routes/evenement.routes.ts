import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();
const prisma = new PrismaClient();

// Obtenir les événements à venir - DOIT ÊTRE AVANT /:id
router.get('/prochain/upcoming', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const maintenant = new Date();
    const evenements = await prisma.evenement.findMany({
      where: {
        utilisateurId: req.userId,
        date: {
          gte: maintenant,
        },
      },
      include: {
        projet: {
          select: {
            id: true,
            titre: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 10,
    });

    res.json(evenements);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements à venir:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir tous les événements
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const evenements = await prisma.evenement.findMany({
      where: {
        utilisateurId: req.userId,
      },
      include: {
        projet: {
          select: {
            id: true,
            titre: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    res.json(evenements);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir un événement par ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const evenement = await prisma.evenement.findFirst({
      where: {
        id: req.params.id,
        utilisateurId: req.userId,
      },
      include: {
        projet: true,
      },
    });

    if (!evenement) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    res.json(evenement);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'événement:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer un événement
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { nom, date, description, projetId } = req.body;

    if (!nom || !date) {
      return res.status(400).json({ message: 'Nom et date requis' });
    }

    // Vérifier que le projet existe et appartient à l'utilisateur si projetId est fourni
    if (projetId) {
      const projet = await prisma.projet.findFirst({
        where: {
          id: projetId,
          utilisateurId: req.userId,
        },
      });

      if (!projet) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
    }

    const evenement = await prisma.evenement.create({
      data: {
        nom,
        date: new Date(date),
        description: description || null,
        projetId: projetId || null,
        utilisateurId: req.userId!,
      },
      include: {
        projet: {
          select: {
            id: true,
            titre: true,
          },
        },
      },
    });

    res.status(201).json(evenement);
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour un événement
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { nom, date, description, projetId } = req.body;

    const evenementExistant = await prisma.evenement.findFirst({
      where: {
        id: req.params.id,
        utilisateurId: req.userId,
      },
    });

    if (!evenementExistant) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    // Vérifier que le projet existe et appartient à l'utilisateur si projetId est fourni
    if (projetId) {
      const projet = await prisma.projet.findFirst({
        where: {
          id: projetId,
          utilisateurId: req.userId,
        },
      });

      if (!projet) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
    }

    const evenement = await prisma.evenement.update({
      where: { id: req.params.id },
      data: {
        nom: nom || evenementExistant.nom,
        date: date ? new Date(date) : evenementExistant.date,
        description: description !== undefined ? description : evenementExistant.description,
        projetId: projetId !== undefined ? (projetId || null) : evenementExistant.projetId,
      },
      include: {
        projet: {
          select: {
            id: true,
            titre: true,
          },
        },
      },
    });

    res.json(evenement);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un événement
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const evenementExistant = await prisma.evenement.findFirst({
      where: {
        id: req.params.id,
        utilisateurId: req.userId,
      },
    });

    if (!evenementExistant) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    await prisma.evenement.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


export default router;

