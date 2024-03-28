const Hotel = require('../models/Hotels');

// Récupérer tous les hôtels
exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouvel hôtel
exports.createHotel = async (req, res) => {
    try {
        const { nom, adresse, email, numero, prix, devise, imageHotel } = req.body;
        // const imageHotel = req.file; // Récupérez l'image téléchargée

        // Créez une nouvelle instance de modèle Hotel avec les données
        const hotel = new Hotel({ nom, adresse, email, numero, prix, devise, imageHotel });

        // Enregistrez l'hôtel dans la base de données
        await hotel.save();
        
        // Répondez avec l'hôtel nouvellement créé
        res.status(201).json(hotel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Obtenir un hôtel par son identifiant
exports.getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (hotel) {
            res.json(hotel);
        } else {
            res.status(404).json({ message: "Hôtel non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un hôtel
exports.updateHotel = async (req, res) => {
    try {
        const { nom, adresse, email, numero, prix, devise, imageHotel } = req.body;
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, { nom, adresse, email, numero, prix, devise, imageHotel }, { new: true });
        if (hotel) {
            res.json(hotel);
        } else {
            res.status(404).json({ message: "Hôtel non trouvé" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un hôtel
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (hotel) {
            res.json({ message: "Hôtel supprimé avec succès" });
        } else {
            res.status(404).json({ message: "Hôtel non trouvé" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
