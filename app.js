const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb+srv://awandionewade:CoumbaAbasse1419@cluster0.gzpyhk2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

  
// Port d'écoute
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});
