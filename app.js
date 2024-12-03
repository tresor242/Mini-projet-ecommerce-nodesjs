require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

// Import des middlewares
const { isAdmin, isAuthenticated } = require("./middlewares/authMiddleware");

// Import des routes
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
// const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to database!"))
  .catch((error) => console.log("Database connection error:", error));


// Middlewares globaux
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1800000 }, // Session active pendant 30 minutes
  })
);

// Middleware global pour gérer les messages flash
app.use((req, res, next) => {
    res.locals.message = req.session.message || null;
    delete req.session.message; // Supprimer le message après affichage
    next();
});


// Configuration des fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuration du moteur de templates
app.set("view engine", "ejs");

// Route par défaut pour rediriger les utilisateurs non connectés
app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

// Gestion des routes avec middlewares
app.use("/auth", authRoutes); // Routes d'authentification

// Routes protégées accessibles aux utilisateurs connectés
// app.use("/products", isAuthenticated, productRoutes);

// Routes protégées accessibles uniquement aux admins
app.use("/admin", isAuthenticated, isAdmin, adminRoutes);


app.use("/shop", shopRoutes);


app.use('/shop/cart', isAuthenticated, cartRoutes);



// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
