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

exports.forgotPassword = async (req, res, next) => {
  
  try {
    const { email } = req.body;

    // Rechercher l'utilisateur dans la base de données par son adresse e-mail
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Adresse e-mail non trouvée.' });
    }

    // Générer un token JWT pour réinitialiser le mot de passe
    const token = jwt.sign({ userId: user._id }, 'RESET_PASSWORD_SECRET', {
      expiresIn: '1h', // Le token expirera dans 1 heure
    });

    // Envoyer un e-mail à l'utilisateur avec le lien de réinitialisation
    // Dans cet exemple, nous supposons que vous utilisez un service de messagerie pour envoyer l'e-mail

    // TODO: Envoyer l'e-mail avec le lien de réinitialisation du mot de passe

    res.status(200).json({ message: 'Un e-mail de réinitialisation du mot de passe a été envoyé à votre adresse.' });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation de mot de passe :', error);
    res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation de mot de passe.' });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Vérifier si le token est fourni
    if (!token) {
      return res.status(400).json({ error: 'Token de réinitialisation du mot de passe manquant.' });
    }

    // Décoder le token
    const decodedToken = jwt.verify(token, 'RESET_PASSWORD_SECRET');

    // Rechercher l'utilisateur correspondant au token
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe :', error);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe.' });
  }
};
