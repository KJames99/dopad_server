const mongoose = require('mongoose')

const hospitalisationSchema = mongoose.Schema({
    patientId: { type: String, required: true },
    medecinId: { type: String, required: true },
    motif_hospitalisation: { type: String, required: true },
    date_entree: { type: Date, required: true },
    date_intervention: { type: Date, required: true },
    date_previsionnelle_sortie: { type: Date, required: true },
    service: { type: String, required: false },
    type_intervention: { type: String, required: false },
    numero_chambre: { type: String, required: true },
    numero_lit: { type: String, required: true },
    histoire_maladie: { type: String, required: false }, 
    parametres_dosages: { type: String, required: false },
    inspection: { type: String, required: false },
    palpation: { type: String, required: false },
    auscultation: { type: String, required: false },
    percussion: { type: String, required: false },
    toucher_vaginal: { type: String, required: false },
    toucher_rectal: { type: String, required: false },
    conclusion_clinique: { type: String, required: false },
    examen_clinique: { type: String, required: false },
    examen_paraclinique: { type: String, required: false },
    conclusion_finale: { type: String, required: false },
    diagnostic_final: { type: String, required: false },
    evolution: { type: String, required: false },
}, { timestamps: true })

module.exports = mongoose.model('Hospitalisation', hospitalisationSchema);