const User = require('../models/User');
const Product = require('../models/Product'); 

// Affiche le tableau de bord admin
exports.getDashboard = async (req, res) => {
    try {
        // Calcule le total des utilisateurs et des produits
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();

        // Rend la vue EJS avec les données
        res.render('admin_dashboard', {
            title: 'Admin Dashboard',
            totalUsers,
            totalProducts,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading dashboard');
    }
};
