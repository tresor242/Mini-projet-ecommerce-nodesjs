require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
// const multer = require('multer');
const path = require('path');

// Import des routes
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");




const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB
mongoose.connect(process.env.DB_URI)
    .then(() => console.log("Connected to database!"))
    .catch((error) => console.log("Database connection error:", error));

// Middlewares globaux
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false,
    })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Dossier statique pour les images

app.set("view engine", "ejs"); // Moteur de template EJS

// Middleware pour vérifier l'authentification (isAuthenticated)
const { isAuthenticated } = require('./middlewares/authMiddleware');

// Route principale
app.get("/", (req, res) => {
    res.redirect("/auth/login");
});

// Routes
app.use("/auth", authRoutes);
app.use("/admin", isAuthenticated, adminRoutes); // Protection des routes admin
app.use("/admin/products", isAuthenticated,productRoutes ); // Protection des routes produits


// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
