const mongoose = require('mongoose')

const patientSchema = mongoose.Schema({
    nom: { type: String, required: true },
    prenoms: { type: String, required: true },
    sexe: { type: String, required: true },
    date_naissance: { type: Date, required: false }, 
    mode_vie: { type: String, required: false },
    antecedents: { type: String, required: false },
}, { timestamps: true })

module.exports = mongoose.model('Patient', patientSchema);