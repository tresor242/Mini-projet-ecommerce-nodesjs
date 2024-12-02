const express = require('express');
const multer = require('multer');
const router = express.Router();
const Product = require('../models/Product');

// Configuration de Multer
var storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname),
});
var upload = multer({ storage: storage }).single('image');

// Afficher tous les produits
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.render('products', { products });
});

// Ajouter un produit (Admin uniquement)
router.post('/add', upload, async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.file.filename,
        });
        await product.save();
        res.redirect('/products');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Supprimer un produit (Admin uniquement)
router.post('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Product.findByIdAndDelete(id);
        res.redirect('/products');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
