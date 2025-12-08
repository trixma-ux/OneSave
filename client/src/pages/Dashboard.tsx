import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  FolderIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Statistiques {
  totalProjets: number;
  totalEvenements: number;
  notificationsNonLues: number;
  projetsParStatut: {
    en_cours: number;
    termine: number;
    annule: number;
    planifie: number;
  };
  moyenneAvancement: number;
  evenementsProchains: number;
  projetsEnRetard: number;
}

interface Projet {
  id: string;
  titre: string;
  statut: string;
  pourcentageAvancement: number;
  dateFin: string | null;
}

interface Evenement {
  id: string;
  nom: string;
  date: string;
  projet?: {
    id: string;
    titre: string;
  };
}

const Dashboard: React.FC = () => {
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  const [projetsRecents, setProjetsRecents] = useState<Projet[]>([]);
  const [evenementsProchains, setEvenementsProchains] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, projetsRes, evenementsRes] = await Promise.all([
        api.get('/rapports/statistiques'),
        api.get('/projets'),
        api.get('/evenements/prochain/upcoming'),
      ]);

      setStatistiques(statsRes.data);
      setProjetsRecents(projetsRes.data.slice(0, 5));
      setEvenementsProchains(evenementsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const cards = [
    {
      name: 'Total Projets',
      value: statistiques?.totalProjets || 0,
      icon: FolderIcon,
      color: 'bg-blue-500',
      href: '/projets',
    },
    {
      name: 'Événements à venir',
      value: statistiques?.evenementsProchains || 0,
      icon: CalendarIcon,
      color: 'bg-green-500',
      href: '/evenements',
    },
    {
      name: 'Projets en cours',
      value: statistiques?.projetsParStatut.en_cours || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      href: '/projets',
    },
    {
      name: 'Projets en retard',
      value: statistiques?.projetsEnRetard || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      href: '/projets',
    },
  ];

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'termine':
        return 'bg-green-100 text-green-800';
      case 'en_cours':
        return 'bg-blue-100 text-blue-800';
      case 'annule':
        return 'bg-red-100 text-red-800';
      case 'planifie':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'termine':
        return 'Terminé';
      case 'en_cours':
        return 'En cours';
      case 'annule':
        return 'Annulé';
      case 'planifie':
        return 'Planifié';
      default:
        return statut;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d'ensemble de vos projets et événements
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.name}
            to={card.href}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${card.color} rounded-md p-3`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Statistiques avancement */}
      {statistiques && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Avancement moyen des projets
          </h2>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${statistiques.moyenneAvancement}%` }}
                ></div>
              </div>
            </div>
            <div className="ml-4 text-sm font-medium text-gray-700">
              {statistiques.moyenneAvancement}%
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Projets récents */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Projets récents</h2>
              <Link
                to="/projets"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {projetsRecents.length > 0 ? (
              projetsRecents.map((projet) => (
                <Link
                  key={projet.id}
                  to={`/projets/${projet.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {projet.titre}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(
                            projet.statut
                          )}`}
                        >
                          {getStatutLabel(projet.statut)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {projet.pourcentageAvancement}% complété
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-sm text-gray-500">
                Aucun projet pour le moment
              </div>
            )}
          </div>
        </div>

        {/* Événements à venir */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Événements à venir
              </h2>
              <Link
                to="/evenements"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {evenementsProchains.length > 0 ? (
              evenementsProchains.map((evenement) => (
                <Link
                  key={evenement.id}
                  to="/evenements"
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {evenement.nom}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-xs text-gray-500">
                          {new Date(evenement.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {evenement.projet && (
                          <span className="text-xs text-blue-600">
                            {evenement.projet.titre}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-sm text-gray-500">
                Aucun événement à venir
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

