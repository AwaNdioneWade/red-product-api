const mongoose = require('mongoose');

// Définition du schéma de données pour les hôtels
const hotelSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    adresse: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    numero: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: false
    },
    devise: {
        type: String,
        required: true
    },
    imageHotel: {
        type: String,
        required: true
    },
});

// Création d'un modèle à partir du schéma
const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
