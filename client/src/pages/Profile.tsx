import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { ValidatedForm, FieldError } from '../components/ValidatedForm';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmMotDePasse: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.nouveauMotDePasse !== passwordData.confirmMotDePasse) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.nouveauMotDePasse.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        ancienMotDePasse: passwordData.ancienMotDePasse,
        nouveauMotDePasse: passwordData.nouveauMotDePasse,
      });
      toast.success('Mot de passe modifié avec succès');
      setShowPasswordModal(false);
      setPasswordData({
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        confirmMotDePasse: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <div className="mt-1">
              <input
                type="text"
                value={user?.nom || ''}
                disabled
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1">
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rôle</label>
            <div className="mt-1">
              <input
                type="text"
                value={user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                disabled
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sécurité</h3>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Changer le mot de passe
            </button>
          </div>
        </div>
      </div>

      {/* Modal changement de mot de passe */}
      {showPasswordModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowPasswordModal(false)}
            ></div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <ValidatedForm
                onValidSubmit={handleChangePassword}
                extraValidate={() =>
                  passwordData.confirmMotDePasse &&
                  passwordData.nouveauMotDePasse !== passwordData.confirmMotDePasse
                    ? { confirmMotDePasse: 'Les mots de passe ne correspondent pas' }
                    : {}
                }
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Changer le mot de passe
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ancien mot de passe *
                      </label>
                      <input
                        name="ancienMotDePasse"
                        type="password"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={passwordData.ancienMotDePasse}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            ancienMotDePasse: e.target.value,
                          })
                        }
                      />
                      <FieldError name="ancienMotDePasse" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nouveau mot de passe *
                      </label>
                      <input
                        name="nouveauMotDePasse"
                        type="password"
                        required
                        minLength={6}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={passwordData.nouveauMotDePasse}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            nouveauMotDePasse: e.target.value,
                          })
                        }
                      />
                      <FieldError name="nouveauMotDePasse" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Confirmer le nouveau mot de passe *
                      </label>
                      <input
                        name="confirmMotDePasse"
                        type="password"
                        required
                        minLength={6}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={passwordData.confirmMotDePasse}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmMotDePasse: e.target.value,
                          })
                        }
                      />
                      <FieldError name="confirmMotDePasse" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {loading ? 'Modification...' : 'Modifier'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
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

export default Profile;

