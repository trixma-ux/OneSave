import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

const Rapports: React.FC = () => {
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  const [projetsParMois, setProjetsParMois] = useState<any>({});
  const [modulesParType, setModulesParType] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, moisRes, modulesRes] = await Promise.all([
        api.get('/rapports/statistiques'),
        api.get('/rapports/projets-par-mois'),
        api.get('/rapports/modules-par-type'),
      ]);
      setStatistiques(statsRes.data);
      setProjetsParMois(moisRes.data);
      setModulesParType(modulesRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error);
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

  // Données pour le graphique des projets par statut
  const projetsParStatutData = {
    labels: ['En cours', 'Terminé', 'Annulé', 'Planifié'],
    datasets: [
      {
        label: 'Nombre de projets',
        data: statistiques
          ? [
              statistiques.projetsParStatut.en_cours,
              statistiques.projetsParStatut.termine,
              statistiques.projetsParStatut.annule,
              statistiques.projetsParStatut.planifie,
            ]
          : [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(234, 179, 8, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Données pour le graphique des modules par type
  const modulesParTypeData = {
    labels: ['CLAC', 'IFADEM', 'GAF'],
    datasets: [
      {
        label: 'Nombre de modules',
        data: modulesParType
          ? [modulesParType.CLAC || 0, modulesParType.IFADEM || 0, modulesParType.GAF || 0]
          : [],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(20, 184, 166, 0.8)',
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(20, 184, 166, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Données pour le graphique des projets par mois
  const projetsParMoisData = {
    labels: Object.keys(projetsParMois),
    datasets: [
      {
        label: 'Nombre de projets',
        data: Object.values(projetsParMois),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rapports et statistiques</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analysez vos projets et activités
        </p>
      </div>

      {/* Cartes de résumé */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Projets
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {statistiques?.totalProjets || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Événements
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {statistiques?.totalEvenements || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avancement moyen
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {statistiques?.moyenneAvancement || 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Projets en retard
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {statistiques?.projetsEnRetard || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projets par statut */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Répartition des projets par statut
          </h2>
          <div className="h-64">
            <Doughnut data={projetsParStatutData} />
          </div>
        </div>

        {/* Modules par type */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Répartition des modules par type
          </h2>
          <div className="h-64">
            <Doughnut data={modulesParTypeData} />
          </div>
        </div>
      </div>

      {/* Projets par mois */}
      {Object.keys(projetsParMois).length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Évolution des projets par mois
          </h2>
          <div className="h-64">
            <Bar
              data={projetsParMoisData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Rapports;

