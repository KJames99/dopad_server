const Consultation = require('../models/Consultation');

/* Création d'une consultation */
exports.creerConsultation = (req, res) => {
	const {motif_consultation, patientId, histoire_maladie, parametres_dosages, inspection, palpation, auscultation, percussion, toucher_rectal, toucher_vaginal, conclusion_finale, diagnostic_final, conclusion_clinique, examen_clinique, examen_paraclinique, type_consultation} = req.body
	
	if(!motif_consultation) return res.status(400).json({code: "E_001", message: "Renseignez le motif de consultation !"})

	const consultation = new Consultation({ medecinId: req.user.userId, motif_consultation, patientId, histoire_maladie, parametres_dosages, inspection, palpation, auscultation, percussion, toucher_rectal, toucher_vaginal, conclusion_finale, diagnostic_final, conclusion_clinique, examen_clinique, examen_paraclinique, type_consultation});	

	consultation.save()
	.then(() => { res.status(201).json({message: 'Consultation créée !', data: consultation})})
	.catch(error => { res.status(500).json({error})})
}

/* Liste de toutes les consultations */
exports.listeAllConsultation = (req, res) => {
	Consultation.find()
		.then(consultations => res.status(200).json({consultations}))
		.catch(error => res.status(500).json({error}));
};

/* Liste de toutes les consultations de l'utilisateur connecté */
exports.listeConsultation = (req, res) => {
	Consultation.find({medecinId: req.user.userId})
		.then(consultations => res.status(200).json({consultations}))
		.catch(error => res.status(500).json({error}));
};

/* Liste de toutes les consultations de l'utilisateur connecté et d'un type en particulier */
exports.listeConsultationTypee = (req, res) => {
	Consultation.find({medecinId: req.user.userId, type_consultation: req.params.type_consultation})
		.then(consultations => res.status(200).json({consultations}))
		.catch(error => res.status(500).json({error}));
};

/* Détails d'une consultation de l'utilisateur connecté */
exports.detailsConsultation = (req, res) => {
	Consultation.findOne({_id: req.params.id, medecinId: req.user.userId})
		.then(consultation => {
			if (!consultation) return res.status(404).json({error: "Consultation non trouvée !"});
			res.status(200).json({consultation});
		})
		.catch(error => res.status(404).json({error}));
};

/* Détails de n'importe quel consultation */
exports.detailsAllConsultation = (req, res) => {
	Consultation.findOne({_id: req.params.id})
		.then(consultation => {
			if (!consultation) return res.status(404).json({error: "Consultation non trouvée !"});
			res.status(200).json(consultation);
		})
		.catch(error => res.status(404).json({error}));
};

/* Modifier une consultation */
exports.modifierConsultation = (req, res) => {
	const { motif_consultation, patientId, histoire_maladie, parametres_dosages, inspection, palpation, auscultation, percussion, toucher_rectal, toucher_vaginal, conclusion_finale, diagnostic_final, conclusion_clinique, examen_clinique, examen_paraclinique } = req.body;
	
	if(!motif_consultation) {
		return res.status(400).json({code: "E_001", message: "Renseignez le motif_consultation !"})
	}

	Consultation.findOne({_id: req.params.id, userId: req.user.userId})
	.then((consultation) => {
		if (!consultation) return res.status(404).json({error: "Consultation non trouvé !"});
		
		if (motif_consultation) consultation.motif_consultation = motif_consultation;
		if (patientId) consultation.patientId = patientId;
		if (histoire_maladie) consultation.histoire_maladie = histoire_maladie;
		if (parametres_dosages) consultation.parametres_dosages = parametres_dosages;
		if (inspection) consultation.inspection = inspection;
		if (palpation) consultation.palpation = palpation;
		if (auscultation) consultation.auscultation = auscultation;
		if (percussion) consultation.percussion = percussion;
		if (toucher_rectal) consultation.toucher_rectal = toucher_rectal;
		if (toucher_vaginal) consultation.toucher_vaginal = toucher_vaginal;
		if (conclusion_clinique) consultation.conclusion_clinique = conclusion_clinique;
		if (examen_paraclinique) consultation.examen_paraclinique = examen_paraclinique;
		if (examen_clinique) consultation.examen_clinique = examen_clinique;
		if (conclusion_finale) consultation.conclusion_finale = conclusion_finale;
		if (diagnostic_final) consultation.diagnostic_final = diagnostic_final;

		consultation.save()
		.then(() => res.status(200).json({message: "Consultation modifiée !", data: consultation}))
		.catch(error => res.status(500).json({error}))
	})
	.catch(error => res.status(404).json({error}))
}

/* Supprimer une consultation */
exports.supprimerConsultation = (req, res) => {
	Consultation.findOne({_id: req.params.id, userId: req.user.userId})
	.then((consultation) => {
		if (!consultation) return res.status(404).json({error: "Consultation non trouvée !"});

		consultation.delete()
			.then(() => res.status(200).json({message : 'Consultation supprimée !'}))
			.catch(error => res.status(500).json({error}));
	})
	.catch((error) => {res.status(404).json({error})})
};