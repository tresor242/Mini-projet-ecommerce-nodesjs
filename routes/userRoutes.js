const express = require('express');
const router = express.Router();
const multer = require('multer');

router.get('/cart', (req, res) => {
    res.render('cart', { cart: req.session.cart || [] });
});

router.post('/cart/add', (req, res) => {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    const cart = req.session.cart || [];
    cart.push({ product, quantity });
    req.session.cart = cart;
    res.redirect('/cart');
});

router.post('/cart/checkout', async (req, res) => {
    req.session.cart = [];
    res.send('Checkout successful!');
});

module.exports = router;