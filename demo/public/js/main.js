// API Configuration
const API_URL = '/api';

// Global state
let currentUser = null;
let token = null;
let projects = [];
let events = [];
let reports = [];
let collaborationProjects = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadUser();
});

// User Authentication
async function loadUser() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${storedToken}` }
            });
            if (response.ok) {
                currentUser = await response.json();
                token = storedToken;
                showAppView();
                await loadProjects();
                return;
            }
        } catch (err) {
            console.error('Error loading user:', err);
        }
    }
    showAuthView();
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const motDePasse = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, motDePasse })
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;
            currentUser = data.utilisateur;
            localStorage.setItem('token', token);
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            showAppView();
            await loadProjects();
            showAlert('✅ Connexion réussie!', 'success');
        } else {
            const err = await response.json();
            showAlert(err.message || 'Erreur de connexion', 'danger');
        }
    } catch (err) {
        showAlert('Erreur serveur: ' + err.message, 'danger');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const nom = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const motDePasse = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, email, motDePasse })
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;
            currentUser = data.utilisateur;
            localStorage.setItem('token', token);
            document.getElementById('registerName').value = '';
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPassword').value = '';
            showAppView();
            await loadProjects();
            showAlert('✅ Inscription réussie!', 'success');
        } else {
            const err = await response.json();
            showAlert(err.message || 'Erreur d\'inscription', 'danger');
        }
    } catch (err) {
        showAlert('Erreur serveur: ' + err.message, 'danger');
    }
}

function logout() {
    currentUser = null;
    token = null;
    localStorage.removeItem('token');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    showAuthView();
    showAlert('Déconnexion réussie', 'info');
}

// UI Navigation
function showAuthView() {
    document.getElementById('authView').style.display = 'block';
    document.getElementById('appView').style.display = 'none';
    document.getElementById('userDisplay').textContent = '';
    document.getElementById('logoutBtn').style.display = 'none';
}

function showAppView() {
    document.getElementById('authView').style.display = 'none';
    document.getElementById('appView').style.display = 'block';
    document.getElementById('userDisplay').textContent = `👤 ${currentUser.nom}`;
    document.getElementById('logoutBtn').style.display = 'inline-block';
}

function showProjects() {
    document.getElementById('projectsView').style.display = 'block';
    document.getElementById('collaborationsView').style.display = 'none';
    document.getElementById('eventsView').style.display = 'none';
    document.getElementById('reportsView').style.display = 'none';
    document.getElementById('profileView').style.display = 'none';
    renderProjects();
}

function showCollaborations() {
    document.getElementById('projectsView').style.display = 'none';
    document.getElementById('collaborationsView').style.display = 'block';
    document.getElementById('eventsView').style.display = 'none';
    document.getElementById('reportsView').style.display = 'none';
    document.getElementById('profileView').style.display = 'none';
    renderCollaborations();
}

function showEvents() {
    document.getElementById('projectsView').style.display = 'none';
    document.getElementById('collaborationsView').style.display = 'none';
    document.getElementById('eventsView').style.display = 'block';
    document.getElementById('reportsView').style.display = 'none';
    document.getElementById('profileView').style.display = 'none';
    renderEvents();
}

function showReports() {
    document.getElementById('projectsView').style.display = 'none';
    document.getElementById('collaborationsView').style.display = 'none';
    document.getElementById('eventsView').style.display = 'none';
    document.getElementById('reportsView').style.display = 'block';
    document.getElementById('profileView').style.display = 'none';
    renderReports();
}

function showProfile() {
    document.getElementById('projectsView').style.display = 'none';
    document.getElementById('collaborationsView').style.display = 'none';
    document.getElementById('eventsView').style.display = 'none';
    document.getElementById('reportsView').style.display = 'none';
    document.getElementById('profileView').style.display = 'block';
    renderProfile();
}

// Project Management
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/projets`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            projects = await response.json();
            renderProjects();
        }
    } catch (err) {
        console.error('Error loading projects:', err);
    }
}

function renderProjects() {
    const listHtml = projects.length === 0 
        ? '<div class="col-12"><p class="text-muted">Aucun projet. Créez-en un pour commencer!</p></div>'
        : projects.map(p => `
            <div class="col-md-6 mb-3">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${p.titre}</h5>
                        <p class="card-text">${p.description || ''}</p>
                        <div class="mb-2">
                            <span class="badge bg-${getStatusColor(p.statut)}">${p.statut}</span>
                        </div>
                        <div class="progress mb-2">
                            <div class="progress-bar" style="width: ${p.pourcentageAvancement}%"></div>
                        </div>
                        <small class="text-muted">Avancement: ${p.pourcentageAvancement}%</small><br>
                        <small class="text-muted">Début: ${new Date(p.dateDebut).toLocaleDateString('fr-FR')}</small>
                    </div>
                    <div class="card-footer bg-white">
                        <button class="btn btn-sm btn-info" onclick="viewProjectDetails('${p.id}')">
                            <i class="bi bi-eye"></i> Détails
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="inviteCollaborator('${p.id}')">
                            <i class="bi bi-person-plus"></i> Inviter
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProject('${p.id}')">
                            <i class="bi bi-trash"></i> Supprimer
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    
    document.getElementById('projectsList').innerHTML = listHtml;
}

function renderCollaborations() {
    const listHtml = collaborationProjects.length === 0 
        ? '<div class="col-12"><p class="text-muted">Vous n\'êtes invité à aucun projet.</p></div>'
        : collaborationProjects.map(p => `
            <div class="col-md-6 mb-3">
                <div class="card h-100 border-success">
                    <div class="card-body">
                        <h5 class="card-title">${p.titre}</h5>
                        <p class="card-text">${p.description || ''}</p>
                        <span class="badge bg-success">Collaboration</span>
                    </div>
                </div>
            </div>
        `).join('');
    
    document.getElementById('collaborationsList').innerHTML = listHtml;
}

function getStatusColor(status) {
    const colors = {
        'planifié': 'secondary',
        'en_cours': 'primary',
        'terminé': 'success',
        'annulé': 'danger'
    };
    return colors[status] || 'secondary';
}

function showNewProjectForm() {
    document.getElementById('newProjectForm').style.display = 'block';
}

function hideNewProjectForm() {
    document.getElementById('newProjectForm').style.display = 'none';
}

async function handleCreateProject(e) {
    e.preventDefault();
    const titre = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDesc').value;
    const dateDebut = document.getElementById('projectStart').value;
    const dateFin = document.getElementById('projectEnd').value || null;
    const statut = document.getElementById('projectStatus').value;

    try {
        const response = await fetch(`${API_URL}/projets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ titre, description, dateDebut, dateFin, statut })
        });

        if (response.ok) {
            document.getElementById('projectTitle').value = '';
            document.getElementById('projectDesc').value = '';
            document.getElementById('projectStart').value = '';
            document.getElementById('projectEnd').value = '';
            hideNewProjectForm();
            await loadProjects();
            showAlert('✅ Projet créé avec succès!', 'success');
        } else {
            const err = await response.json();
            showAlert(err.message || 'Erreur lors de la création', 'danger');
        }
    } catch (err) {
        showAlert('Erreur serveur: ' + err.message, 'danger');
    }
}

async function deleteProject(id) {
    if (confirm('Êtes-vous sûr?')) {
        try {
            const response = await fetch(`${API_URL}/projets/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                await loadProjects();
                showAlert('✅ Projet supprimé', 'success');
            }
        } catch (err) {
            showAlert('Erreur: ' + err.message, 'danger');
        }
    }
}

async function viewProjectDetails(id) {
    try {
        const project = projects.find(p => p.id === id);
        if (project) {
            showAlert(`
                <strong>${project.titre}</strong><br>
                ${project.description || 'Pas de description'}<br>
                Status: ${project.statut}<br>
                Avancement: ${project.pourcentageAvancement}%<br>
                Début: ${new Date(project.dateDebut).toLocaleDateString('fr-FR')}<br>
                ${project.dateFin ? 'Fin: ' + new Date(project.dateFin).toLocaleDateString('fr-FR') : ''}
            `, 'info');
        } else {
            showAlert('Projet non trouvé', 'danger');
        }
    } catch (err) {
        showAlert('Erreur: ' + err.message, 'danger');
    }
}

async function inviteCollaborator(id) {
    const email = prompt('Email de l\'utilisateur à inviter:');
    if (email) {
        try {
            const response = await fetch(`${API_URL}/projets/${id}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                showAlert(`✅ Invitation envoyée à ${email}`, 'success');
            } else {
                const err = await response.json();
                showAlert(err.message || 'Erreur lors de l\'invitation', 'danger');
            }
        } catch (err) {
            showAlert('Erreur serveur: ' + err.message, 'danger');
        }
    }
}

// Events Management
function renderEvents() {
    const listHtml = events.length === 0
        ? '<div class="col-12"><p class="text-muted">Aucun événement.</p></div>'
        : events.map(e => `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${e.nom}</h5>
                        <p class="card-text">${e.description || ''}</p>
                        <small class="text-muted">📅 ${new Date(e.date).toLocaleString('fr-FR')}</small>
                    </div>
                </div>
            </div>
        `).join('');
    document.getElementById('eventsList').innerHTML = listHtml;
}

function showNewEventForm() {
    alert('Fonctionnalité événements en cours de développement');
}

// Reports Management
function renderReports() {
    const listHtml = reports.length === 0
        ? '<div class="col-12"><p class="text-muted">Aucun rapport.</p></div>'
        : reports.map(r => `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${r.titre}</h5>
                        <p class="card-text">${r.contenu || ''}</p>
                    </div>
                </div>
            </div>
        `).join('');
    document.getElementById('reportsList').innerHTML = listHtml;
}

// Profile
function renderProfile() {
    if (currentUser) {
        document.getElementById('profileName').value = currentUser.nom;
        document.getElementById('profileEmail').value = currentUser.email;
        document.getElementById('profileRole').value = currentUser.role === 'admin' ? 'Administrateur' : 'Utilisateur';
    }
}

// Utilities
function showAlert(message, type = 'info') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    const alertContainer = document.querySelector('.container-fluid') || document.body;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = alertHtml;
    alertContainer.insertBefore(tempDiv.firstElementChild, alertContainer.firstChild);
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        if (alerts.length > 0) {
            alerts[0].remove();
        }
    }, 3000);
}
