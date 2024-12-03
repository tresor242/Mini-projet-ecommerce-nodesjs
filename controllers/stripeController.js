const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/Cart');

exports.checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.session.user.id });
        if (!cart || cart.items.length === 0) {
            req.session.message = { type: 'warning', text: 'Your cart is empty.' };
            return res.redirect('/shop/cart');
        }

        // Crée une session de paiement Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/shop/cart/success`,
            cancel_url: `${req.protocol}://${req.get('host')}/shop/cart`,
            line_items: cart.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: [`${req.protocol}://${req.get('host')}/uploads/${item.image}`],
                    },
                    unit_amount: item.price * 100, // Prix en cents
                },
                quantity: item.quantity,
            })),
        });

        // Redirige vers la page de paiement Stripe
        res.redirect(session.url);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error initiating checkout.');
    }
};

// Page de succès après paiement
exports.successPage = (req, res) => {
    res.render('checkout_success', { title: 'Payment Successful' });
};
