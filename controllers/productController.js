const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Afficher tous les produits
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('manage_products', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading products: ' + err.message);
    }
};

// Afficher le formulaire d'ajout de produit
exports.showAddProductForm = (req, res) => {
    res.render('add_product', { title: 'Add Product' });
};

// Ajouter un produit
exports.addProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const product = new Product({
            name,
            price,
            description,
            image: req.file ? req.file.filename : 'default.jpg',
        });

        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding product: ' + err.message);
    }
};

// Afficher le formulaire de modification d'un produit
exports.showEditProductForm = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('edit_product', { product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading product: ' + err.message);
    }
};

// Modifier un produit
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, description } = req.body;
        const updatedData = { name, price, description };

        if (req.file) {
            updatedData.image = req.file.filename;
        }

        await Product.findByIdAndUpdate(productId, updatedData);
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating product: ' + err.message);
    }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        if (product.image && product.image !== 'default.jpg') {
            const imagePath = path.join(__dirname, '../uploads', product.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error(`Error deleting image: ${err.message}`);
            });
        }

        await Product.findByIdAndDelete(productId);
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting product: ' + err.message);
    }
};


exports.getProductsForShop = async (req, res) => {
    try {
        const products = await Product.find(); // Récupérer tous les produits
        res.render("shop_products", { products }); // Rendre la vue avec les produits
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading shop products: " + err.message);
    }
};