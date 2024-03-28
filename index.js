const express = require('express');
const http = require('http');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs'); // Module 'fs' pour la gestion des fichiers
const path = require('path'); // Module 'path' pour la gestion des chemins
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

// Utilise les routes pour les hôtels dans ton application
app.use('/hotels', hotelRoutes);

// Route pour télécharger une image depuis une URL
// app.post('/download-image', async (req, res) => {
//     const { imageUrl } = req.body; // Récupérer l'URL de l'image depuis le corps de la requête
//     try {
//         // Télécharger l'image depuis l'URL avec Axios
//         const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//         // Générer un nom de fichier unique pour l'image téléchargée
//         const imageName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
//         // Chemin où stocker l'image localement (vous pouvez le modifier selon votre structure de dossier)
//         const imagePath = path.join(__dirname, 'images', imageName);
//         // Écrire les données de l'image dans un fichier local
//         fs.writeFileSync(imagePath, Buffer.from(response.data));
//         // Envoyer une réponse indiquant que l'image a été téléchargée avec succès
//         res.status(200).json({ message: 'Image téléchargée avec succès', imagePath });
//     } catch (error) {
//         // En cas d'erreur, renvoyer une réponse d'erreur
//         console.error('Erreur lors du téléchargement de l\'image :', error);
//         res.status(500).json({ error: 'Erreur lors du téléchargement de l\'image' });
//     }
// });

// Montage des routes d'authentification
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);


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
