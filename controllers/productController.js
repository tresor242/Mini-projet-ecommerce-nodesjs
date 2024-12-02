const Product = require('../models/Product');
const fs = require('fs');

// Obtenir tous les produits
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { title: "Products", products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Ajouter un produit
exports.addProduct = async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.file.filename,
        });
        await product.save();
        req.session.message = { type: 'success', message: 'Product added successfully!' };
        res.redirect('/products');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Afficher le formulaire d’ajout
exports.showAddProductForm = (req, res) => {
    res.render('add_product', { title: "Add Product" });
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
        if (product) {
            if (product.image) {
                try {
                    fs.unlinkSync("./uploads/" + product.image);
                } catch (err) {
                    console.log("Erreur lors de la suppression de l'image : ", err);
                }
            }
            await Product.findByIdAndDelete(id);
            req.session.message = { type: 'success', message: 'Product deleted successfully!' };
            res.redirect('/products');
        } else {
            req.session.message = { type: 'danger', message: 'Product not found!' };
            res.redirect('/products');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
