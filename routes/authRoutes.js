const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const multer = require("multer");

// Configuration Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Répertoire pour enregistrer les fichiers
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname); // Nom unique pour chaque fichier
    }
});
const upload = multer({ storage });

// Routes

// Afficher le formulaire de connexion
router.get("/login", authController.showLoginForm);

// Afficher le formulaire d'inscription
router.get("/register", authController.showRegisterForm);

// Enregistrer un utilisateur (avec upload d'image)
router.post("/register", upload.single('image'), authController.register);

// Connecter un utilisateur
router.post("/login", authController.login);

// Déconnexion
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Could not log out.");
        }
        res.redirect("/auth/login"); // Redirection après déconnexion
    });
});

module.exports = router;
