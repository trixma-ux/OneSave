import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
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
  createdAt: string;
}

const Projets: React.FC = () => {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProjet, setEditingProjet] = useState<Projet | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    statut: 'en_cours',
    pourcentageAvancement: 0,
  });

  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    try {
      const response = await api.get('/projets');
      setProjets(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProjet) {
        await api.put(`/projets/${editingProjet.id}`, formData);
        toast.success('Projet mis à jour avec succès');
      } else {
        await api.post('/projets', formData);
        toast.success('Projet créé avec succès');
      }
      setShowModal(false);
      setEditingProjet(null);
      resetForm();
      fetchProjets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await api.delete(`/projets/${id}`);
        toast.success('Projet supprimé avec succès');
        fetchProjets();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleEdit = (projet: Projet) => {
    setEditingProjet(projet);
    setFormData({
      titre: projet.titre,
      description: projet.description || '',
      dateDebut: projet.dateDebut.split('T')[0],
      dateFin: projet.dateFin ? projet.dateFin.split('T')[0] : '',
      statut: projet.statut,
      pourcentageAvancement: projet.pourcentageAvancement,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      statut: 'en_cours',
      pourcentageAvancement: 0,
    });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez tous vos projets et suivez leur avancement
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProjet(null);
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouveau projet
        </button>
      </div>

      {/* Liste des projets */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projets.map((projet) => (
          <div
            key={projet.id}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Link
                  to={`/projets/${projet.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                >
                  {projet.titre}
                </Link>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(projet)}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(projet.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {projet.description && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {projet.description}
                </p>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Avancement</span>
                  <span className="text-xs font-medium text-gray-700">
                    {projet.pourcentageAvancement}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${projet.pourcentageAvancement}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(
                      projet.statut
                    )}`}
                  >
                    {getStatutLabel(projet.statut)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(projet.dateDebut).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun projet pour le moment</p>
          <button
            onClick={() => {
              setEditingProjet(null);
              resetForm();
              setShowModal(true);
            }}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Créer votre premier projet
          </button>
        </div>
      )}

      {/* Modal de création/édition */}
      {showModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <ValidatedForm
                onValidSubmit={handleSubmit}
                extraValidate={() =>
                  formData.dateFin && formData.dateDebut && formData.dateFin < formData.dateDebut
                    ? { dateFin: 'La date de fin doit être postérieure à la date de début' }
                    : {}
                }
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingProjet ? 'Modifier le projet' : 'Nouveau projet'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Titre *
                      </label>
                      <input
                        name="titre"
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.titre}
                        onChange={(e) =>
                          setFormData({ ...formData, titre: e.target.value })
                        }
                      />
                      <FieldError name="titre" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                      />
                      <FieldError name="description" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date de début *
                        </label>
                        <input
                          name="dateDebut"
                          type="date"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.dateDebut}
                          onChange={(e) =>
                            setFormData({ ...formData, dateDebut: e.target.value })
                          }
                        />
                        <FieldError name="dateDebut" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date de fin
                        </label>
                        <input
                          name="dateFin"
                          type="date"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.dateFin}
                          onChange={(e) =>
                            setFormData({ ...formData, dateFin: e.target.value })
                          }
                        />
                        <FieldError name="dateFin" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Statut
                        </label>
                        <select
                          name="statut"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.statut}
                          onChange={(e) =>
                            setFormData({ ...formData, statut: e.target.value })
                          }
                        >
                          <option value="planifie">Planifié</option>
                          <option value="en_cours">En cours</option>
                          <option value="termine">Terminé</option>
                          <option value="annule">Annulé</option>
                        </select>
                        <FieldError name="statut" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Avancement (%)
                        </label>
                        <input
                          name="pourcentageAvancement"
                          type="number"
                          min="0"
                          max="100"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.pourcentageAvancement}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pourcentageAvancement: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                        <FieldError name="pourcentageAvancement" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingProjet ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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

export default Projets;

