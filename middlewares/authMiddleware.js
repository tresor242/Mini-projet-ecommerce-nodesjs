// middlewares/authMiddleware.js

const isAuthenticated = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.redirect('/auth/login'); // Rediriger vers la page de connexion si non admin
};

module.exports = { isAuthenticated };
