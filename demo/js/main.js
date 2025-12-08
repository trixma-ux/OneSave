// Gestion de l'authentification
const auth = {
    async login(username, password) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = '/dashboard.html';
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            showError(error.message);
        }
    },

    async logout() {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/login.html';
    }
};

// Gestion des projets
const projects = {
    async getAll() {
        const response = await fetch('/api/projects');
        return response.json();
    },

    async create(data) {
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async getStatistics() {
        const response = await fetch('/api/statistics');
        return response.json();
    },
    renderProjectCard(project) {
        return `
            <div class="col-md-4 mb-4" data-id="${project.id}">
                <div class="card project-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                          <h5 class="card-title">${project.title}</h5>
                          <div>
                            <button class="btn btn-sm btn-outline-secondary me-1" onclick="openEditProject(${project.id})"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-danger" onclick="handleDeleteProject(${project.id})"><i class="bi bi-trash"></i></button>
                          </div>
                        </div>
                        <p class="card-text">${project.description || ''}</p>
                        <div class="progress mb-3">
                            <div class="progress-bar" role="progressbar" 
                                style="width: ${project.progress}%" 
                                aria-valuenow="${project.progress}" 
                                aria-valuemin="0" 
                                aria-valuemax="100">
                                ${project.progress}%
                            </div>
                        </div>
                        <span class="badge bg-${getStatusColor(project.status)}">${project.status}</span>
                    </div>
                </div>
            </div>
        `;
    },

    async update(id, data) {
        const response = await fetch(`/api/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async delete(id) {
        const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        return response.json();
    }
};

// Gestion des événements
const events = {
    async getAll(projectId = null) {
        const url = projectId ? `/api/events?projectId=${projectId}` : '/api/events';
        const response = await fetch(url);
        return response.json();
    },

    async create(data) {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    renderEventCard(event) {
        return `
            <div class="col-md-4 mb-4" data-id="${event.id}">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                          <h5 class="card-title">${event.name}</h5>
                          <div>
                            <button class="btn btn-sm btn-outline-secondary me-1" onclick="openEditEvent(${event.id})"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-danger" onclick="handleDeleteEvent(${event.id})"><i class="bi bi-trash"></i></button>
                          </div>
                        </div>
                        <p class="card-text">${event.description || ''}</p>
                        <p class="text-muted">
                            <i class="bi bi-calendar"></i> 
                            ${new Date(event.date).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    async update(id, data) {
        const response = await fetch(`/api/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async delete(id) {
        const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });
        return response.json();
    }
};

// Gestion des rapports
const reports = {
    async getAll(projectId = null) {
        const url = projectId ? `/api/reports?projectId=${projectId}` : '/api/reports';
        const response = await fetch(url);
        return response.json();
    },
    renderReportCard(report) {
        return `
            <div class="col-md-4 mb-4" data-id="${report.id}">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                          <h5 class="card-title">${report.title}</h5>
                          <div>
                            <button class="btn btn-sm btn-outline-secondary me-1" onclick="openEditReport(${report.id})"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-danger" onclick="handleDeleteReport(${report.id})"><i class="bi bi-trash"></i></button>
                          </div>
                        </div>
                        <p class="card-text">${report.content || ''}</p>
                        <p class="text-muted">
                            <i class="bi bi-clock"></i> 
                            ${new Date(report.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    async create(data) {
        const response = await fetch('/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async update(id, data) {
        const response = await fetch(`/api/reports/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async delete(id) {
        const response = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
        return response.json();
    }
};

// Fonctions utilitaires
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.insertBefore(alertDiv, document.body.firstChild);
}

function getStatusColor(status) {
    const colors = {
        'planifié': 'info',
        'en_cours': 'primary',
        'terminé': 'success',
        'annulé': 'danger'
    };
    return colors[status] || 'secondary';
}

function showSuccess(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.insertBefore(alertDiv, document.body.firstChild);
    // refresh dashboard if available
    try { if (typeof window.loadDashboard === 'function') window.loadDashboard(); } catch(e) {}
}

// Helpers for open/edit/delete from UI
window.openEditProject = async function(id) {
    // fetch project and populate modal
    try {
        const list = await projects.getAll();
        const p = list.find(x => x.id == id);
        if (!p) return showError('Projet introuvable');
        document.getElementById('projTitle').value = p.title;
        document.getElementById('projDesc').value = p.description || '';
        document.getElementById('projStatus').value = p.status;
        document.getElementById('projProgress').value = p.progress || 0;
        // store editing id
        document.getElementById('projectModalSaveMode').value = 'edit';
        document.getElementById('projectModalId').value = id;
        const modal = new bootstrap.Modal(document.getElementById('projectModal'));
        modal.show();
    } catch (e) { showError('Impossible de charger le projet'); }
}

window.handleDeleteProject = async function(id) {
    // open modal confirmation instead
    openDelete('project', id);
}

window.openEditEvent = async function(id) {
    try {
        const list = await events.getAll();
        const ev = list.find(x => x.id == id);
        if (!ev) return showError('Événement introuvable');
        document.getElementById('eventName').value = ev.name;
        document.getElementById('eventDesc').value = ev.description || '';
        // format for datetime-local
        const dt = new Date(ev.date);
        const local = new Date(dt.getTime() - dt.getTimezoneOffset()*60000).toISOString().slice(0,16);
        document.getElementById('eventDate').value = local;
        await loadProjectsForSelect();
        document.getElementById('eventProject').value = ev.project_id || '';
        document.getElementById('eventModalSaveMode').value = 'edit';
        document.getElementById('eventModalId').value = id;
        const modal = new bootstrap.Modal(document.getElementById('eventModal'));
        modal.show();
    } catch (e) { showError('Impossible de charger l\'événement'); }
}

window.handleDeleteEvent = async function(id) {
    openDelete('event', id);
}

window.openEditReport = async function(id) {
    try {
        const list = await reports.getAll();
        const r = list.find(x => x.id == id);
        if (!r) return showError('Rapport introuvable');
        // populate modal fields
        document.getElementById('reportTitle').value = r.title || '';
        document.getElementById('reportContent').value = r.content || '';
        await loadProjectsForReportSelect();
        try { document.getElementById('reportProject').value = r.project_id || ''; } catch(e) {}
        document.getElementById('reportModalSaveMode').value = 'edit';
        document.getElementById('reportModalId').value = id;
        const modal = new bootstrap.Modal(document.getElementById('reportModal'));
        modal.show();
    } catch (e) { showError('Erreur mise à jour rapport'); }
}

window.handleDeleteReport = async function(id) {
    openDelete('report', id);
}

// Global delete modal handling
let _deleteTarget = { type: null, id: null };
window.openDelete = function(type, id, title) {
    _deleteTarget = { type, id };
    const titleText = title ? `"${title}"` : '';
    const el = document.getElementById('globalDeleteModal');
    if (el) {
        const msg = el.querySelector('.delete-target-name');
        if (msg) msg.textContent = titleText;
        const modal = new bootstrap.Modal(el);
        modal.show();
    } else {
        // fallback to confirm
        if (confirm(`Supprimer ${type} ${titleText}?`)) confirmDelete();
    }
}

window.confirmDelete = async function() {
    try {
        const { type, id } = _deleteTarget;
        if (!type || !id) return;
        if (type === 'project') await projects.delete(id);
        else if (type === 'event') await events.delete(id);
        else if (type === 'report') await reports.delete(id);

        showSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} supprimé(e)`);
        // refresh current page list
        window.refreshPage();
        // hide modal if present
        const el = document.getElementById('globalDeleteModal');
        if (el) {
            const modal = bootstrap.Modal.getInstance(el);
            if (modal) modal.hide();
        }
    } catch (e) { showError('Erreur lors de la suppression'); }
};

// Refresh helper to reload the relevant lists
window.refreshPage = function() {
    const page = window.location.pathname.split('/').pop();
    if (page === 'projects.html' && typeof loadProjects === 'function') return loadProjects();
    if (page === 'events.html' && typeof loadEvents === 'function') return loadEvents();
    if (page === 'reports.html' && typeof loadReports === 'function') return loadReports();
    if (page === 'dashboard.html' && typeof loadDashboard === 'function') return loadDashboard();
    // default: reload page
    return;
};

// Gestion de la navigation
function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        // comparer sans/avec slash pour être tolérant
        if (href.endsWith(currentPage) || href === ('/' + currentPage)) {
            link.classList.add('active');
        }
    });
}