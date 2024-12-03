const express = require("express");
const productController = require("../controllers/productController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

// Afficher les produits disponibles pour les utilisateurs
router.get("/products", isAuthenticated, productController.getProductsForShop);

module.exports = router;
