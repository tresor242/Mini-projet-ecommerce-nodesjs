const express = require('express');
const router = express.Router();
const multer = require('multer');


router.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart', { cart });
});

router.post('/cart/add/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    const cart = req.session.cart || [];
    cart.push({ product, quantity: 1 });
    req.session.cart = cart;
    res.redirect('/cart');
});

module.exports = router;