// middlewares/authMiddleware.js

// Vérifie si l'utilisateur est connecté (authentifié)
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // Passe au middleware ou à la route suivante
    }
    res.redirect('/auth/login'); // Rediriger vers la page de connexion si non connecté
};

// Vérifie si l'utilisateur est un admin
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access denied: Admins only'); // Accès refusé si non admin
};

module.exports = { isAuthenticated, isAdmin };
