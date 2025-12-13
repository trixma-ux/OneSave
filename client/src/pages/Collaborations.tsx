import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  PlusIcon,
  TrashIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

interface Projet {
  id: string;
  titre: string;
  description: string | null;
  statut: string;
}

interface Membre {
  id: string;
  nom: string;
  email: string;
  role: string;
}

interface Collaboration {
  id: string;
  projet: Projet;
  membres: Membre[];
}

const Collaborations: React.FC = () => {
  const navigate = useNavigate();
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProjet, setSelectedProjet] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      const projetResponse = await api.get('/projets');
      const projets = projetResponse.data;

      // Charger les membres pour chaque projet
      const collaborationsData: Collaboration[] = [];
      for (const projet of projets) {
        try {
          const membersResponse = await api.get(`/projets/${projet.id}/members`);
          collaborationsData.push({
            id: projet.id,
            projet,
            membres: membersResponse.data,
          });
        } catch (error) {
          // Si l'endpoint échoue, on ajoute quand même le projet sans membres
          collaborationsData.push({
            id: projet.id,
            projet,
            membres: [],
          });
        }
      }
      setCollaborations(collaborationsData);
    } catch (error) {
      toast.error('Erreur lors du chargement des collaborations');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteClick = (projetId: string) => {
    setSelectedProjet(projetId);
    setInviteEmail('');
    setShowInviteModal(true);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjet || !inviteEmail.trim()) {
      toast.error('Veuillez entrer une adresse email');
      return;
    }

    try {
      setInviting(true);
      await api.post(`/projets/${selectedProjet}/invite`, {
        email: inviteEmail,
      });
      toast.success('Invitation envoyée avec succès');
      setShowInviteModal(false);
      setInviteEmail('');
      fetchCollaborations();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de l\'invitation';
      toast.error(message);
    } finally {
      setInviting(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'proprietaire':
        return '👤 Propriétaire';
      case 'collaborateur':
        return '🤝 Collaborateur';
      case 'lecteur':
        return '👁️ Lecteur';
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'proprietaire':
        return 'bg-purple-100 text-purple-800';
      case 'collaborateur':
        return 'bg-blue-100 text-blue-800';
      case 'lecteur':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRemoveCollaborator = async (projetId: string, memberId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce collaborateur ?')) {
      try {
        await api.delete(`/projets/${projetId}/members/${memberId}`);
        toast.success('Collaborateur supprimé avec succès');
        fetchCollaborations();
      } catch (error: any) {
        const message = error.response?.data?.message || 'Erreur lors de la suppression';
        toast.error(message);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Collaborations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez les collaborateurs de vos projets
        </p>
      </div>

      {collaborations.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Vous n'avez pas encore de projets. Créez un projet pour commencer à collaborer.
          </p>
          <button
            onClick={() => navigate('/projets')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Créer un projet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {collaborations.map((collab) => (
            <div key={collab.id} className="bg-white shadow rounded-lg overflow-hidden">
              {/* En-tête du projet */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {collab.projet.titre}
                    </h2>
                    {collab.projet.description && (
                      <p className="mt-1 text-blue-100 text-sm">
                        {collab.projet.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatutColor(collab.projet.statut)}`}>
                      {getStatutLabel(collab.projet.statut)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Membres ({collab.membres.length})
                  </h3>
                  <button
                    onClick={() => handleInviteClick(collab.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Inviter
                  </button>
                </div>

                {collab.membres.length === 0 ? (
                  <div className="text-center py-8">
                    <UserGroupIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Aucun membre pour l'instant</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collab.membres.map((membre) => (
                      <div
                        key={membre.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {membre.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {membre.email}
                          </div>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(membre.role)}`}>
                              {getRoleLabel(membre.role)}
                            </span>
                          </div>
                        </div>
                        {membre.role !== 'proprietaire' && (
                          <button
                            onClick={() => handleRemoveCollaborator(collab.id, membre.id)}
                            className="ml-4 text-gray-400 hover:text-red-600 transition-colors"
                            title="Retirer le collaborateur"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'invitation */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Inviter un utilisateur
            </h3>
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email de l'utilisateur
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="utilisateur@example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border py-2 px-3"
                  required
                  disabled={inviting}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                  }}
                  disabled={inviting}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={inviting || !inviteEmail.trim()}
                  className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inviting ? 'Envoi en cours...' : 'Envoyer invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaborations;
