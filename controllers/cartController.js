const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Ajouter un produit au panier
exports.addToCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            req.session.message = { type: 'danger', text: 'Product not found.' };
            return res.redirect('/shop/products');
        }

        let cart = await Cart.findOne({ userId: req.session.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.session.user.id, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
            });
        }

        await cart.save();
        req.session.message = { type: 'success', text: 'Product added to cart!' };
        res.redirect('/shop/products');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding product to cart.');
    }
};

// Afficher le panier
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.session.user.id });

        if (!cart || cart.items.length === 0) {
            return res.render('cart', {
                title: 'Your Cart',
                cartItems: [],
                total: 0,
                message: 'Your cart is empty.',
            });
        }

        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.render('cart', {
            title: 'Your Cart',
            cartItems: cart.items,
            total,
            message: null,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading cart.');
    }
};

// Mettre à jour la quantité dans le panier
exports.updateQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const action = req.query.action; // Récupérer l'action passée via la requête

        console.log(`Action received: ${action}, Product ID: ${id}`);

        // Récupérer le panier de l'utilisateur
        const cart = await Cart.findOne({ userId: req.session.user.id });
        if (!cart) {
            req.session.message = { type: 'warning', text: 'Cart not found.' };
            return res.redirect('/shop/cart');
        }

        // Trouver l'élément correspondant dans le panier
        const item = cart.items.find(item => item.productId.toString() === id);
        if (!item) {
            req.session.message = { type: 'danger', text: 'Product not found in cart.' };
            return res.redirect('/shop/cart');
        }

        // Modifier la quantité
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease') {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Supprimer l'élément si la quantité tombe à 0
                cart.items = cart.items.filter(item => item.productId.toString() !== id);
            }
        }

        // Sauvegarder les modifications
        await cart.save();

        console.log('Updated cart:', cart);

        req.session.message = { type: 'success', text: 'Cart updated successfully!' };
        res.redirect('/shop/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating cart quantity.');
    }
};




// Supprimer un produit du panier
exports.removeFromCart = async (req, res) => {
    try {
        const productId = req.params.id;

        const cart = await Cart.findOne({ userId: req.session.user.id });

        if (!cart) {
            req.session.message = { type: 'warning', text: 'No cart found.' };
            return res.redirect('/shop/cart');
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        req.session.message = { type: 'success', text: 'Product removed from cart.' };
        res.redirect('/shop/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error removing item from cart.');
    }
};
