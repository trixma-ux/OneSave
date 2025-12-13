import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/prisma';

const router = express.Router();

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

// Inviter un utilisateur existant à collaborer
router.post('/:id/invite', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    // Vérifier que le projet existe et appartient à l'utilisateur
    const projet = await prisma.projet.findFirst({
      where: {
        id: req.params.id,
        utilisateurId: req.userId,
      },
    });

    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Vérifier que l'utilisateur à inviter existe
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier que l'utilisateur n'est pas déjà collaborateur
    const collaborationExistante = await prisma.collaboration.findUnique({
      where: {
        projetId_utilisateurId: {
          projetId: req.params.id,
          utilisateurId: utilisateur.id,
        },
      },
    });

    if (collaborationExistante) {
      return res.status(400).json({ message: 'Cet utilisateur est déjà collaborateur' });
    }

    // Créer la collaboration
    const collaboration = await prisma.collaboration.create({
      data: {
        projetId: req.params.id,
        utilisateurId: utilisateur.id,
        role: 'collaborateur',
        statut: 'acceptee',
      },
      include: {
        utilisateur: {
          select: {
            id: true,
            nom: true,
            email: true,
          },
        },
      },
    });

    // Créer une notification pour l'utilisateur invité
    await prisma.notification.create({
      data: {
        utilisateurId: utilisateur.id,
        type: 'info',
        message: `Vous avez été invité à collaborer sur le projet "${projet.titre}"`,
      },
    });

    res.status(201).json({
      message: 'Utilisateur invité avec succès',
      collaboration,
    });
  } catch (error) {
    console.error('Erreur lors de l\'invitation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les collaborateurs d'un projet
router.get('/:id/members', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Vérifier que le projet existe et appartient à l'utilisateur ou qu'il y collabore
    const projet = await prisma.projet.findFirst({
      where: {
        id: req.params.id,
      },
      include: {
        collaborations: {
          include: {
            utilisateur: {
              select: {
                id: true,
                nom: true,
                email: true,
              },
            },
          },
        },
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

    // Vérifier les droits d'accès
    const isOwner = projet.utilisateurId === req.userId;
    const isCollaborator = projet.collaborations.some(
      (collab) => collab.utilisateurId === req.userId
    );

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Préparer la liste des membres
    const members = [
      {
        id: projet.utilisateur.id,
        nom: projet.utilisateur.nom,
        email: projet.utilisateur.email,
        role: 'proprietaire',
      },
      ...projet.collaborations.map((collab) => ({
        id: collab.utilisateur.id,
        nom: collab.utilisateur.nom,
        email: collab.utilisateur.email,
        role: collab.role,
      })),
    ];

    res.json(members);
  } catch (error) {
    console.error('Erreur lors de la récupération des membres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer un collaborateur d'un projet
router.delete('/:id/members/:memberId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Vérifier que le projet existe et appartient à l'utilisateur
    const projet = await prisma.projet.findFirst({
      where: {
        id: req.params.id,
        utilisateurId: req.userId,
      },
    });

    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // Vérifier que la collaboration existe
    const collaboration = await prisma.collaboration.findUnique({
      where: {
        projetId_utilisateurId: {
          projetId: req.params.id,
          utilisateurId: req.params.memberId,
        },
      },
    });

    if (!collaboration) {
      return res.status(404).json({ message: 'Collaborateur non trouvé' });
    }

    // Supprimer la collaboration
    await prisma.collaboration.delete({
      where: {
        id: collaboration.id,
      },
    });

    res.json({ message: 'Collaborateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du collaborateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
