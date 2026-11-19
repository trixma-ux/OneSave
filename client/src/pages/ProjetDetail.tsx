import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { TrashIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { ValidatedForm, FieldError } from '../components/ValidatedForm';

interface Projet {
  id: string;
  titre: string;
  description: string | null;
  dateDebut: string;
  dateFin: string | null;
  statut: string;
  pourcentageAvancement: number;
  evenements: Evenement[];
  moduleSpecifique: ModuleSpecifique | null;
}

interface Evenement {
  id: string;
  nom: string;
  date: string;
  description: string | null;
}

interface ModuleSpecifique {
  id: string;
  nomModule: string;
  typeProgramme: string;
  details: string | null;
}

const ProjetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projet, setProjet] = useState<Projet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    nom: '',
    date: '',
    description: '',
  });
  const [moduleFormData, setModuleFormData] = useState({
    nomModule: '',
    typeProgramme: 'CLAC',
    details: '',
  });

  const fetchProjet = useCallback(async () => {
    if (!id) return;
    try {
      const response = await api.get(`/projets/${id}`);
      setProjet(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement du projet');
      navigate('/projets');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProjet();
  }, [fetchProjet]);

  const handleDeleteProjet = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await api.delete(`/projets/${id}`);
        toast.success('Projet supprimé avec succès');
        navigate('/projets');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/evenements', {
        ...eventFormData,
        projetId: id,
      });
      toast.success('Événement créé avec succès');
      setShowEventModal(false);
      setEventFormData({ nom: '', date: '', description: '' });
      fetchProjet();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/modules', {
        ...moduleFormData,
        projetId: id,
      });
      toast.success('Module créé avec succès');
      setShowModuleModal(false);
      setModuleFormData({ nomModule: '', typeProgramme: 'CLAC', details: '' });
      fetchProjet();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await api.delete(`/evenements/${eventId}`);
        toast.success('Événement supprimé avec succès');
        fetchProjet();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!projet) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/projets"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{projet.titre}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Détails du projet
            </p>
          </div>
        </div>
        <button
          onClick={handleDeleteProjet}
          className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
        >
          <TrashIcon className="h-5 w-5 mr-2" />
          Supprimer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informations générales
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-sm text-gray-900">
                  {projet.description || 'Aucune description'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de début</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(projet.dateDebut).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date de fin</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {projet.dateFin
                      ? new Date(projet.dateFin).toLocaleDateString('fr-FR')
                      : 'Non définie'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <span
                    className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(
                      projet.statut
                    )}`}
                  >
                    {getStatutLabel(projet.statut)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Avancement</label>
                  <div className="mt-1 flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${projet.pourcentageAvancement}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {projet.pourcentageAvancement}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Événements */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Événements</h2>
              <button
                onClick={() => setShowEventModal(true)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Ajouter
              </button>
            </div>
            <div className="space-y-4">
              {projet.evenements.length > 0 ? (
                projet.evenements.map((evenement) => (
                  <div
                    key={evenement.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{evenement.nom}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(evenement.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {evenement.description && (
                        <p className="text-xs text-gray-600 mt-1">{evenement.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(evenement.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucun événement pour ce projet
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Module spécifique */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Module spécifique</h2>
              {!projet.moduleSpecifique && (
                <button
                  onClick={() => setShowModuleModal(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Ajouter
                </button>
              )}
            </div>
            {projet.moduleSpecifique ? (
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-gray-500">Nom du module</label>
                  <p className="text-sm text-gray-900">{projet.moduleSpecifique.nomModule}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Type de programme</label>
                  <p className="text-sm text-gray-900">{projet.moduleSpecifique.typeProgramme}</p>
                </div>
                {projet.moduleSpecifique.details && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Détails</label>
                    <p className="text-sm text-gray-900">{projet.moduleSpecifique.details}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Aucun module spécifique
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal événement */}
      {showEventModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowEventModal(false)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <ValidatedForm onValidSubmit={handleCreateEvent}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Nouvel événement
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom *
                      </label>
                      <input
                        name="nom"
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={eventFormData.nom}
                        onChange={(e) =>
                          setEventFormData({ ...eventFormData, nom: e.target.value })
                        }
                      />
                      <FieldError name="nom" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date et heure *
                      </label>
                      <input
                        name="date"
                        type="datetime-local"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={eventFormData.date}
                        onChange={(e) =>
                          setEventFormData({ ...eventFormData, date: e.target.value })
                        }
                      />
                      <FieldError name="date" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows={3}
                        value={eventFormData.description}
                        onChange={(e) =>
                          setEventFormData({ ...eventFormData, description: e.target.value })
                        }
                      />
                      <FieldError name="description" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </ValidatedForm>
            </div>
          </div>
        </div>
      )}

      {/* Modal module */}
      {showModuleModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModuleModal(false)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <ValidatedForm onValidSubmit={handleCreateModule}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Nouveau module spécifique
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom du module *
                      </label>
                      <input
                        name="nomModule"
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={moduleFormData.nomModule}
                        onChange={(e) =>
                          setModuleFormData({ ...moduleFormData, nomModule: e.target.value })
                        }
                      />
                      <FieldError name="nomModule" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Type de programme *
                      </label>
                      <select
                        name="typeProgramme"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={moduleFormData.typeProgramme}
                        onChange={(e) =>
                          setModuleFormData({ ...moduleFormData, typeProgramme: e.target.value })
                        }
                      >
                        <option value="CLAC">CLAC</option>
                        <option value="IFADEM">IFADEM</option>
                        <option value="GAF">GAF</option>
                      </select>
                      <FieldError name="typeProgramme" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Détails
                      </label>
                      <textarea
                        name="details"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows={3}
                        value={moduleFormData.details}
                        onChange={(e) =>
                          setModuleFormData({ ...moduleFormData, details: e.target.value })
                        }
                      />
                      <FieldError name="details" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModuleModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </ValidatedForm>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjetDetail;

