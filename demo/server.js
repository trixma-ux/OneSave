const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.DEMO_PORT || 3001;

// Configuration du middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les ressources statiques (CSS/JS/images)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Route racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Demo API Routes - Proxy to main OneSave API
const API_URL = process.env.API_URL || 'http://localhost:5000/api';

app.post('/api/*', async (req, res) => {
    try {
        const endpoint = req.path.replace('/api/', '');
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization || ''
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/*', async (req, res) => {
    try {
        const endpoint = req.path.replace('/api/', '');
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': req.headers.authorization || ''
            }
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/*', async (req, res) => {
    try {
        const endpoint = req.path.replace('/api/', '');
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Authorization': req.headers.authorization || ''
            }
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/*', async (req, res) => {
    try {
        const endpoint = req.path.replace('/api/', '');
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization || ''
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`\n✅ OneSave Demo Server démarré sur http://localhost:${port}`);
    console.log(`📊 API URL: ${API_URL}`);
    console.log('\n💡 Demo Credentials:');
    console.log('   Email: demo@example.com');
    console.log('   Mot de passe: demo123');
    console.log('\n');
});