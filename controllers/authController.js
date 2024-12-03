const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Affiche la page de connexion
exports.showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

// Affiche la page d'inscription
exports.showRegisterForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

// Enregistrement
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        // Validation des champs requis
        if (!name || !email || !phone || !password) {
            return res.status(400).send('All fields are required.');
        }

        // Validation du rôle
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).send('Invalid role selected.');
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur avec les données fournies
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role, 
            image: req.file ? req.file.filename : 'default.jpg', 
        });

        await user.save(); // Sauvegarder l'utilisateur dans MongoDB
        res.redirect('/auth/login'); // Redirection après inscription
    } catch (err) {
        if (err.code === 11000) { // Erreur MongoDB pour duplication de clé
            return res.status(400).send('Email already exists.');
        }
        console.error(err);
        res.status(500).send('Error during registration: ' + err.message);
    }
};

// Connexion
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Rechercher l'utilisateur par email
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid credentials');
        }

        // Stocker les informations de l'utilisateur dans la session
        req.session.user = { id: user._id, role: user.role };

        // Rediriger en fonction du rôle
        if (user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/shop/products'); // Redirection pour les utilisateurs
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during login: ' + err.message);
    }
};


// Déconnexion
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/auth/login');
    });
};
