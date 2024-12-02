const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },  // Ajouter ce champ
    image: { type: String, required: false },    // Rendre l'image optionnelle si nécessaire
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
