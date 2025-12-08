const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Créer une connexion à la base de données
const db = new sqlite3.Database(path.join(__dirname, '../db/onesave.db'), (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
    } else {
        console.log('Connecté à la base de données SQLite');
        initDatabase();
    }
});

// Initialisation de la base de données
function initDatabase() {
    // Création des tables
    db.serialize(() => {
        // Table utilisateurs
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Table projets
        db.run(`CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT CHECK(status IN ('planifié', 'en_cours', 'terminé', 'annulé')) NOT NULL,
            progress INTEGER DEFAULT 0,
            start_date DATE,
            end_date DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Table événements
        db.run(`CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            date DATETIME NOT NULL,
            project_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(project_id) REFERENCES projects(id)
        )`);

        // Table rapports
        db.run(`CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            project_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(project_id) REFERENCES projects(id)
        )`);

        // Insérer des données de test
        insertTestData();
    });
}

// Insertion des données de test
async function insertTestData() {
    // Hasher le mot de passe de test
    const hashedPassword = await bcrypt.hash('test123', 10);

    // Insérer un utilisateur de test
    db.run(`INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)`,
        ['demo', 'demo@example.com', hashedPassword]);

    // Insérer des projets de test
    const projects = [
        ['Projet A', 'Description du projet A', 'en_cours', 75, '2025-01-01', '2025-12-31'],
        ['Projet B', 'Description du projet B', 'planifié', 0, '2025-11-15', '2026-03-31'],
        ['Projet C', 'Description du projet C', 'terminé', 100, '2025-06-01', '2025-10-31']
    ];

    projects.forEach(project => {
        db.run(`INSERT OR IGNORE INTO projects 
            (title, description, status, progress, start_date, end_date, user_id)
            VALUES (?, ?, ?, ?, ?, ?, 1)`, project);
    });

    // Insérer des événements de test
    const events = [
        ['Réunion de lancement', 'Kick-off du projet A', '2025-11-15 10:00:00', 1],
        ['Revue de code', 'Revue du sprint 1', '2025-11-20 14:00:00', 1],
        ['Point d\'équipe', 'Réunion hebdomadaire', '2025-11-25 09:00:00', 2]
    ];

    events.forEach(event => {
        db.run(`INSERT OR IGNORE INTO events 
            (name, description, date, project_id)
            VALUES (?, ?, ?, ?)`, event);
    });

    // Insérer des rapports de test
    const reports = [
        ['Rapport mensuel - Octobre', 'Contenu du rapport mensuel...', 1],
        ['État d\'avancement - Sprint 2', 'Détails du sprint...', 1],
        ['Bilan de projet', 'Bilan final...', 3]
    ];

    reports.forEach(report => {
        db.run(`INSERT OR IGNORE INTO reports 
            (title, content, project_id)
            VALUES (?, ?, ?)`, report);
    });
}

// Fonctions d'accès aux données
const dbAccess = {
    // Utilisateurs
    async authenticateUser(username, password) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
                if (err) reject(err);
                if (!user) resolve(null);
                const match = await bcrypt.compare(password, user.password);
                resolve(match ? user : null);
            });
        });
    },

    // Créer un nouveau projet
    async createProject(userId, data) {
        return new Promise((resolve, reject) => {
            const { title, description, status = 'planifié', progress = 0 } = data;
            const start_date = new Date().toISOString().split('T')[0];
            
            db.run(`INSERT INTO projects (title, description, status, progress, start_date, user_id) 
                   VALUES (?, ?, ?, ?, ?, ?)`,
                [title, description, status, progress, start_date, userId],
                function(err) {
                    if (err) return reject(err);
                    db.get('SELECT * FROM projects WHERE id = ?', [this.lastID], (err2, row) => {
                        if (err2) return reject(err2);
                        resolve(row);
                    });
                });
        });
    },

    // Créer un nouvel événement
    async createEvent(data) {
        return new Promise((resolve, reject) => {
            const { name, description, date, project_id } = data;
            
            db.run(`INSERT INTO events (name, description, date, project_id) 
                   VALUES (?, ?, ?, ?)`,
                [name, description, date, project_id],
                function(err) {
                    if (err) return reject(err);
                    db.get('SELECT * FROM events WHERE id = ?', [this.lastID], (err2, row) => {
                        if (err2) return reject(err2);
                        resolve(row);
                    });
                });
        });
    },

    // Projets
    getProjects(userId) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM projects WHERE user_id = ?', [userId], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    },

    // Mettre à jour un projet
    async updateProject(projectId, data) {
        return new Promise((resolve, reject) => {
            const { title, description, status, progress, end_date } = data;
            db.run(`UPDATE projects SET title = ?, description = ?, status = ?, progress = ?, end_date = ? WHERE id = ?`,
                [title, description, status, progress, end_date || null, projectId], function(err) {
                    if (err) return reject(err);
                    db.get('SELECT * FROM projects WHERE id = ?', [projectId], (err2, row) => {
                        if (err2) return reject(err2);
                        resolve(row);
                    });
                });
        });
    },

    // Supprimer un projet
    async deleteProject(projectId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM projects WHERE id = ?', [projectId], function(err) {
                if (err) return reject(err);
                resolve({ deleted: this.changes });
            });
        });
    },

    // Événements
    getEvents(projectId = null) {
        return new Promise((resolve, reject) => {
            const query = projectId 
                ? 'SELECT * FROM events WHERE project_id = ?'
                : 'SELECT * FROM events';
            const params = projectId ? [projectId] : [];
            
            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    },

    // Mettre à jour un événement
    async updateEvent(eventId, data) {
        return new Promise((resolve, reject) => {
            const { name, description, date, project_id } = data;
            db.run(`UPDATE events SET name = ?, description = ?, date = ?, project_id = ? WHERE id = ?`,
                [name, description, date, project_id || null, eventId], function(err) {
                    if (err) return reject(err);
                    db.get('SELECT * FROM events WHERE id = ?', [eventId], (err2, row) => {
                        if (err2) return reject(err2);
                        resolve(row);
                    });
                });
        });
    },

    // Supprimer un événement
    async deleteEvent(eventId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM events WHERE id = ?', [eventId], function(err) {
                if (err) return reject(err);
                resolve({ deleted: this.changes });
            });
        });
    },

    // Rapports
    getReports(projectId = null) {
        return new Promise((resolve, reject) => {
            const query = projectId
                ? 'SELECT * FROM reports WHERE project_id = ?'
                : 'SELECT * FROM reports';
            const params = projectId ? [projectId] : [];
            
            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    },

    // Créer un rapport
    async createReport(data) {
        return new Promise((resolve, reject) => {
            const { title, content, project_id } = data;
            db.run(`INSERT INTO reports (title, content, project_id) VALUES (?, ?, ?)`,
                [title, content, project_id || null], function(err) {
                    if (err) return reject(err);
                    db.get('SELECT * FROM reports WHERE id = ?', [this.lastID], (err2, row) => {
                        if (err2) return reject(err2);
                        resolve(row);
                    });
                });
        });
    },

    // Mettre à jour un rapport
    async updateReport(reportId, data) {
        return new Promise((resolve, reject) => {
            const { title, content, project_id } = data;
            db.run(`UPDATE reports SET title = ?, content = ?, project_id = ? WHERE id = ?`,
                [title, content, project_id || null, reportId], function(err) {
                    if (err) return reject(err);
                    db.get('SELECT * FROM reports WHERE id = ?', [reportId], (err2, row) => {
                        if (err2) return reject(err2);
                        resolve(row);
                    });
                });
        });
    },

    // Supprimer un rapport
    async deleteReport(reportId) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM reports WHERE id = ?', [reportId], function(err) {
                if (err) return reject(err);
                resolve({ deleted: this.changes });
            });
        });
    },

    // Statistiques
    getStatistics(userId) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    COUNT(*) as totalProjects,
                    SUM(CASE WHEN status = 'en_cours' THEN 1 ELSE 0 END) as activeProjects,
                    AVG(progress) as averageProgress,
                    (SELECT COUNT(*) FROM events WHERE date > CURRENT_TIMESTAMP) as upcomingEvents
                FROM projects 
                WHERE user_id = ?
            `, [userId], (err, stats) => {
                if (err) reject(err);
                resolve(stats);
            });
        });
    }
};

module.exports = dbAccess;