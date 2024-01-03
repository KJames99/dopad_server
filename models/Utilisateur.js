const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const utilisateurSchema = mongoose.Schema({
    nom: { type: String, required: true },
    prenoms: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },
    password: { type: String, required: true },
    active: { type: Boolean, default: true },
}, { timestamps: true })

utilisateurSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Utilisateur', utilisateurSchema);