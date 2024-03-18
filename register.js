const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Définir une fonction de validation d'e-mail
function validateEmail(email) {
    // Utiliser une expression régulière pour valider l'e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const dataSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: { validator: validateEmail, message: 'Invalid email address' } },
    password: { type: String, required: true },
});

dataSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('register', dataSchema);
