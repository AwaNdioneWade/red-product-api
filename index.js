const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const hotelRoutes = require('./routes/Hotels');

// Middleware pour traiter les requêtes JSON
app.use(express.json());

// Middleware CORS pour autoriser les requêtes de différentes origines
app.use(cors());

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://awandionewade:CoumbaAbasse1419@cluster0.gzpyhk2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

// Gestion des événements de connexion, d'erreur et de déconnexion à MongoDB
mongoose.connection.on('connected', () => {
    console.log('Connexion à MongoDB réussie');
});

mongoose.connection.on('error', (err) => {
    console.error('Erreur de connexion à MongoDB :', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Déconnexion de MongoDB');
});

// Montage des routes d'authentification
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Utilise les routes pour les hôtels dans ton application
app.use('/hotels', hotelRoutes);


// Port d'écoute du serveur
const PORT = process.env.PORT || 4000;
app.set('port', PORT); // Définition du port dans l'application Express

// Création du serveur HTTP et gestion des erreurs
const server = http.createServer(app);

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + PORT;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + PORT;
    console.log('Listening on ' + bind);
});

// Démarrage du serveur
server.listen(PORT);
