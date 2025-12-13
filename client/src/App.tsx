import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projets from './pages/Projets';
import ProjetDetail from './pages/ProjetDetail';
import Evenements from './pages/Evenements';
import Rapports from './pages/Rapports';
import Collaborations from './pages/Collaborations';
import Profile from './pages/Profile';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route
            path="/projets"
            element={
              <PrivateRoute>
                <Layout>
                  <Projets />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/projets/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ProjetDetail />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/evenements"
            element={
              <PrivateRoute>
                <Layout>
                  <Evenements />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/rapports"
            element={
              <PrivateRoute>
                <Layout>
                  <Rapports />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/collaborations"
            element={
              <PrivateRoute>
                <Layout>
                  <Collaborations />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;

