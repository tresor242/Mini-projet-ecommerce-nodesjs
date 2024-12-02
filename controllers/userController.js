const bcrypt = require('bcryptjs');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');


// Afficher le formulaire d'ajout d'utilisateur
exports.showAddUserForm = (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Access denied: Admins only');
    }
    res.render('add_user', { title: 'Add User' });
};

// Ajouter un utilisateur
exports.addUser = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role,
            image: req.file ? req.file.filename : 'default.jpg', // Image par défaut si aucune n'est fournie
        });

        await user.save();
        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding user: ' + err.message);
    }
};

// Afficher tous les utilisateurs
exports.getUsers = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('Access denied: Admins only');
    }

    try {
        const users = await User.find();
        res.render('manage_users', { users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading users: ' + err.message);
    }
};

// Afficher le formulaire de modification d'un utilisateur
exports.showEditUserForm = async (req, res) => {
    try {
        const userId = req.params.id; // ID de l'utilisateur à modifier
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('edit_user', { title: 'Edit User', user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading user: ' + err.message);
    }
};

// Modifier un utilisateur
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id; // ID de l'utilisateur
        const { name, email, phone, role } = req.body;

        // Si une nouvelle image est téléchargée
        const updatedData = {
            name,
            email,
            phone,
            role,
        };

        if (req.file) {
            updatedData.image = req.file.filename;
        }

        await User.findByIdAndUpdate(userId, updatedData);
        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating user: ' + err.message);
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id; // ID de l'utilisateur à supprimer
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Supprimer l'image associée, si elle existe
        if (user.image && user.image !== 'default.jpg') {
            const imagePath = path.join(__dirname, '../uploads', user.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error(`Error deleting image: ${err.message}`);
            });
        }

        // Supprimer l'utilisateur de la base de données
        await User.findByIdAndDelete(userId);
        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user: ' + err.message);
    }
};