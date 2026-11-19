import prisma from './prisma';

// Créer une notification pour un utilisateur
export async function createNotification(
  utilisateurId: string,
  message: string,
  type: string = 'info',
  dateEcheance?: Date
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        message,
        type,
        dateEcheance: dateEcheance || null,
        utilisateurId,
      },
    });
    return notification;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    throw error;
  }
}

// Vérifier les échéances de projets et créer des notifications
export async function checkProjetEcheances() {
  try {
    const maintenant = new Date();
    const dans3Jours = new Date();
    dans3Jours.setDate(dans3Jours.getDate() + 3);

    // Trouver les projets dont la date de fin est dans les 3 prochains jours
    const projets = await prisma.projet.findMany({
      where: {
        dateFin: {
          gte: maintenant,
          lte: dans3Jours,
        },
        statut: {
          not: 'termine',
        },
      },
      include: {
        utilisateur: true,
      },
    });

    for (const projet of projets) {
      // Vérifier si une notification existe déjà pour cette échéance
      const notificationExistante = await prisma.notification.findFirst({
        where: {
          utilisateurId: projet.utilisateurId,
          message: {
            contains: projet.titre,
          },
          dateEcheance: projet.dateFin,
        },
      });

      if (!notificationExistante) {
        await createNotification(
          projet.utilisateurId,
          `⏰ Échéance proche : Le projet "${projet.titre}" se termine le ${projet.dateFin?.toLocaleDateString('fr-FR')}`,
          'warning',
          projet.dateFin || undefined
        );
      }
    }

    // Trouver les projets en retard
    const projetsEnRetard = await prisma.projet.findMany({
      where: {
        dateFin: {
          lt: maintenant,
        },
        statut: {
          not: 'termine',
        },
      },
      include: {
        utilisateur: true,
      },
    });

    for (const projet of projetsEnRetard) {
      const notificationExistante = await prisma.notification.findFirst({
        where: {
          utilisateurId: projet.utilisateurId,
          message: {
            contains: `en retard: ${projet.titre}`,
          },
        },
      });

      if (!notificationExistante) {
        await createNotification(
          projet.utilisateurId,
          `🚨 Projet en retard : "${projet.titre}" - Date de fin dépassée`,
          'error',
          projet.dateFin || undefined
        );
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des échéances:', error);
  }
}

// Vérifier les événements à venir et créer des notifications
export async function checkEvenementsProchains() {
  try {
    const maintenant = new Date();
    const dans1Jour = new Date();
    dans1Jour.setDate(dans1Jour.getDate() + 1);

    const evenements = await prisma.evenement.findMany({
      where: {
        date: {
          gte: maintenant,
          lte: dans1Jour,
        },
      },
      include: {
        utilisateur: true,
      },
    });

    for (const evenement of evenements) {
      const notificationExistante = await prisma.notification.findFirst({
        where: {
          utilisateurId: evenement.utilisateurId,
          message: {
            contains: evenement.nom,
          },
          dateEcheance: evenement.date,
        },
      });

      if (!notificationExistante) {
        await createNotification(
          evenement.utilisateurId,
          `📅 Événement à venir : "${evenement.nom}" - ${evenement.date.toLocaleDateString('fr-FR')} à ${evenement.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
          'info',
          evenement.date
        );
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des événements:', error);
  }
}

const CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 heure
let lastCheckAt = 0;
let checkInProgress = false;

/**
 * Lance les vérifications si la dernière date de plus d'une heure.
 * Tolère la mise en veille de l'instance gratuite : appelé au démarrage
 * (réveil), par le minuteur et sur les requêtes entrantes. Les doublons
 * sont évités par les contrôles d'existence dans chaque vérification.
 */
export async function runNotificationChecksIfDue(force = false): Promise<void> {
  const now = Date.now();
  if (checkInProgress || (!force && now - lastCheckAt < CHECK_INTERVAL_MS)) return;
  checkInProgress = true;
  lastCheckAt = now;
  try {
    await checkProjetEcheances();
    await checkEvenementsProchains();
  } catch (error) {
    console.error('Erreur du planificateur de notifications:', error);
  } finally {
    checkInProgress = false;
  }
}

// Planifier les vérifications périodiques
export function startNotificationScheduler() {
  const timer = setInterval(() => {
    void runNotificationChecksIfDue();
  }, CHECK_INTERVAL_MS);
  // Ne pas empêcher l'arrêt du processus
  if (typeof timer.unref === 'function') timer.unref();

  // Vérifier immédiatement au démarrage / au réveil
  void runNotificationChecksIfDue(true);
}

