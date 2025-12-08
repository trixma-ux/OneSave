const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./js/database');

const app = express();
const port = 3000;

// Configuration du middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session must be initialisée avant la gestion des pages HTML
app.use(session({
    secret: 'onesave-demo-secret',
    resave: false,
    saveUninitialized: false
}));

// Protection simple des pages HTML : si l'utilisateur n'est pas connecté,
// rediriger vers /login.html pour toutes les requêtes .html sauf celles publiques.
app.use((req, res, next) => {
    try {
        const url = req.path;
        const publicHtml = ['/login.html', '/register.html', '/'];
        if (url.endsWith('.html') && !publicHtml.includes(url)) {
            if (!req.session || !req.session.user) {
                return res.redirect('/login.html');
            }
        }
    } catch (e) {
        // ignore and continue
    }
    next();
});

// Servir les ressources statiques (CSS/JS/images)
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Middleware d'authentification
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
};

// Routes API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.authenticateUser(username, password);
        if (user) {
            req.session.user = user;
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: 'Identifiants invalides' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

app.get('/api/projects', requireAuth, async (req, res) => {
    try {
        const projects = await db.getProjects(req.session.user.id);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Créer un nouveau projet
app.post('/api/projects', requireAuth, async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || !title.trim()) return res.status(400).json({ error: 'Le titre est requis' });
        const project = await db.createProject(req.session.user.id, req.body);
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du projet' });
    }
});

// Mettre à jour un projet
app.put('/api/projects/:id', requireAuth, async (req, res) => {
    try {
        const updated = await db.updateProject(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du projet' });
    }
});

// Supprimer un projet
app.delete('/api/projects/:id', requireAuth, async (req, res) => {
    try {
        const result = await db.deleteProject(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du projet' });
    }
});

app.get('/api/events', requireAuth, async (req, res) => {
    try {
        const events = await db.getEvents(req.query.projectId);
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Créer un nouvel événement
app.post('/api/events', requireAuth, async (req, res) => {
    try {
        const { name, date } = req.body;
        if (!name || !name.trim()) return res.status(400).json({ error: "Le nom de l'événement est requis" });
        if (!date) return res.status(400).json({ error: "La date de l'événement est requise" });
        const event = await db.createEvent(req.body);
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'événement' });
    }
});

// Mettre à jour un événement
app.put('/api/events/:id', requireAuth, async (req, res) => {
    try {
        const updated = await db.updateEvent(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'événement' });
    }
});

// Supprimer un événement
app.delete('/api/events/:id', requireAuth, async (req, res) => {
    try {
        const result = await db.deleteEvent(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
    }
});

app.get('/api/reports', requireAuth, async (req, res) => {
    try {
        const reports = await db.getReports(req.query.projectId);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Créer un rapport
app.post('/api/reports', requireAuth, async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || !title.trim()) return res.status(400).json({ error: 'Le titre est requis' });
        const report = await db.createReport(req.body);
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création du rapport' });
    }
});

// Mettre à jour un rapport
app.put('/api/reports/:id', requireAuth, async (req, res) => {
    try {
        const updated = await db.updateReport(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du rapport' });
    }
});

// Supprimer un rapport
app.delete('/api/reports/:id', requireAuth, async (req, res) => {
    try {
        const result = await db.deleteReport(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du rapport' });
    }
});

app.get('/api/statistics', requireAuth, async (req, res) => {
    try {
        const stats = await db.getStatistics(req.session.user.id);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});