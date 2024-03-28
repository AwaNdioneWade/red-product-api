const express = require('express');
const router = express.Router();
const multer = require('../config/multer');


// Importez vos contrôleurs d'hôtel
const hotelController = require('../controllers/Hotels');

// Route pour créer un nouvel hôtel
router.post('/', multer, hotelController.createHotel);

// Route pour obtenir tous les hôtels
router.get('/', hotelController.getAllHotels);

// Route pour obtenir un hôtel par son identifiant
router.get('/:id', hotelController.getHotelById);

// Route pour mettre à jour un hôtel
router.put('/:id', hotelController.updateHotel);

// Route pour supprimer un hôtel
router.delete('/:id', hotelController.deleteHotel);

module.exports = router;
