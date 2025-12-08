import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();
const prisma = new PrismaClient();

// Obtenir tous les modules
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const modules = await prisma.moduleSpecifique.findMany({
      include: {
        projet: {
          select: {
            id: true,
            titre: true,
            description: true,
            statut: true,
            utilisateurId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filtrer pour ne montrer que les modules des projets de l'utilisateur
    const modulesFiltres = modules.filter(
      (module) => module.projet.utilisateurId === req.userId
    );

    res.json(modulesFiltres);
  } catch (error) {
    console.error('Erreur lors de la récupération des modules:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir un module par ID
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const module = await prisma.moduleSpecifique.findUnique({
      where: { id: req.params.id },
      include: {
        projet: true,
      },
    });

    if (!module) {
      return res.status(404).json({ message: 'Module non trouvé' });
    }

    // Vérifier que le projet appartient à l'utilisateur
    if (module.projet.utilisateurId !== req.userId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(module);
  } catch (error) {
    console.error('Erreur lors de la récupération du module:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer un module
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { nomModule, typeProgramme, details, projetId } = req.body;

    if (!nomModule || !typeProgramme || !projetId) {
      return res.status(400).json({ message: 'Nom du module, type de programme et projet requis' });
    }

    // Vérifier que le projet existe et appartient à l'utilisateur
    const projet = await prisma.projet.findFirst({
      where: {
        id: projetId,
        utilisateurId: req.userId,
      },
    });

    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Vérifier si un module existe déjà pour ce projet
    const moduleExistant = await prisma.moduleSpecifique.findUnique({
      where: { projetId },
    });

    if (moduleExistant) {
      return res.status(400).json({ message: 'Un module existe déjà pour ce projet' });
    }

    const module = await prisma.moduleSpecifique.create({
      data: {
        nomModule,
        typeProgramme,
        details: details || null,
        projetId,
      },
      include: {
        projet: true,
      },
    });

    res.status(201).json(module);
  } catch (error) {
    console.error('Erreur lors de la création du module:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour un module
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { nomModule, typeProgramme, details } = req.body;

    const moduleExistant = await prisma.moduleSpecifique.findUnique({
      where: { id: req.params.id },
      include: {
        projet: true,
      },
    });

    if (!moduleExistant) {
      return res.status(404).json({ message: 'Module non trouvé' });
    }

    // Vérifier que le projet appartient à l'utilisateur
    if (moduleExistant.projet.utilisateurId !== req.userId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const module = await prisma.moduleSpecifique.update({
      where: { id: req.params.id },
      data: {
        nomModule: nomModule || moduleExistant.nomModule,
        typeProgramme: typeProgramme || moduleExistant.typeProgramme,
        details: details !== undefined ? details : moduleExistant.details,
      },
      include: {
        projet: true,
      },
    });

    res.json(module);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du module:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un module
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const moduleExistant = await prisma.moduleSpecifique.findUnique({
      where: { id: req.params.id },
      include: {
        projet: true,
      },
    });

    if (!moduleExistant) {
      return res.status(404).json({ message: 'Module non trouvé' });
    }

    // Vérifier que le projet appartient à l'utilisateur
    if (moduleExistant.projet.utilisateurId !== req.userId) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await prisma.moduleSpecifique.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Module supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du module:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;

