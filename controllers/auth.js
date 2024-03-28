const User = require('../models/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      nom: req.body.nom,
      email: req.body.email,
      password: hashedPassword,
    });

    // Sauvegarder l'utilisateur dans la base de données
    await user.save();

    // Renvoyer une réponse
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
}

exports.login = async (req, res, next) => {
  try {
    // Rechercher l'utilisateur dans la base de données par son adresse e-mail
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: 'Adresse e-mail ou mot de passe incorrect.' });
    }
    
    // Vérifier si le mot de passe correspond
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Adresse e-mail ou mot de passe incorrect.' });
    }

    // Générer un token JWT pour l'utilisateur
    const token = jwt.sign(
      { userId: user._id },
      'RANDOM_TOKEN_SECRET',
      { expiresIn: '24h' }
    );

    // Envoyer la réponse avec le token JWT
    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    // Gérer les erreurs
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
}

