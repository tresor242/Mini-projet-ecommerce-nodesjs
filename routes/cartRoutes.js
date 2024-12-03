const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const stripeController = require('../controllers/stripeController');

// Afficher le panier
router.get('/', cartController.getCart);

// Ajouter un produit au panier
router.post('/add/:id', cartController.addToCart);

// Mettre à jour la quantité
router.post('/update/:id/increase', (req, res) => {
    req.query.action = 'increase'; // Ajouter l'action dans la requête
    cartController.updateQuantity(req, res);
});

router.post('/update/:id/decrease', (req, res) => {
    req.query.action = 'decrease'; // Ajouter l'action dans la requête
    cartController.updateQuantity(req, res);
});



// Supprimer un produit du panier
router.post('/remove/:id', cartController.removeFromCart);


// Route pour le paiement
router.get('/success', stripeController.successPage);
router.post('/checkout', stripeController.checkout);

module.exports = router;
