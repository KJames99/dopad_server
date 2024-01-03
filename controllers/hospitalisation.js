const Hospitalisation = require('../models/Hospitalisation');

/* Création d'une hospitalisation */
exports.creerHospitalisation = (req, res) => {
	const {motif_hospitalisation, patientId, histoire_maladie, parametres_dosages, inspection, palpation, auscultation, percussion, toucher_rectal, toucher_vaginal, conclusion_finale, diagnostic_final, conclusion_clinique, examen_clinique, examen_paraclinique, evolution, numero_chambre, numero_lit, service, date_entree, date_previsionnelle_sortie, date_intervention, type_intervention} = req.body
	
	if(!motif_hospitalisation) return res.status(400).json({code: "E_001", message: "Renseignez le motif de hospitalisation !"})

	const hospitalisation = new Hospitalisation({ medecinId: req.user.userId, motif_hospitalisation, patientId, histoire_maladie, parametres_dosages, inspection, palpation, auscultation, percussion, toucher_rectal, toucher_vaginal, conclusion_finale, diagnostic_final, conclusion_clinique, examen_clinique, examen_paraclinique, evolution, numero_chambre, numero_lit, service, date_entree, date_previsionnelle_sortie, date_intervention, type_intervention});	

	hospitalisation.save()
	.then(() => { res.status(201).json({message: 'Hospitalisation créée !', data: hospitalisation})})
	.catch(error => { res.status(500).json({error})})
}

/* Liste de toutes les hospitalisations */
exports.listeAllHospitalisation = (req, res) => {
	Hospitalisation.find()
		.then(hospitalisations => res.status(200).json({hospitalisations}))
		.catch(error => res.status(500).json({error}));
};

/* Liste de toutes les hospitalisations de l'utilisateur connecté d'un service */
exports.listeHospitalisation = (req, res) => {
	Hospitalisation.find({medecinId: req.user.userId, service: req.params.service})
		.then(hospitalisations => res.status(200).json({hospitalisations}))
		.catch(error => res.status(500).json({error}));
};

/* Détails d'une hospitalisation de l'utilisateur connecté */
exports.detailsHospitalisation = (req, res) => {
	Hospitalisation.findOne({_id: req.params.id, medecinId: req.user.userId})
		.then(hospitalisation => {
			if (!hospitalisation) return res.status(404).json({error: "Hospitalisation non trouvée !"});
			res.status(200).json({hospitalisation});
		})
		.catch(error => res.status(404).json({error}));
};

/* Détails de n'importe quel hospitalisation */
exports.detailsAllHospitalisation = (req, res) => {
	Hospitalisation.findOne({_id: req.params.id})
		.then(hospitalisation => {
			if (!hospitalisation) return res.status(404).json({error: "Hospitalisation non trouvée !"});
			res.status(200).json(hospitalisation);
		})
		.catch(error => res.status(404).json({error}));
};

/* Modifier une hospitalisation */
exports.modifierHospitalisation = (req, res) => {
	const { motif_hospitalisation, patientId, histoire_maladie, parametres_dosages, inspection, palpation, auscultation, percussion, toucher_rectal, toucher_vaginal, conclusion_finale, diagnostic_final, conclusion_clinique, examen_clinique, examen_paraclinique, evolution, numero_chambre, numero_lit, service, date_entree, date_previsionnelle_sortie, date_intervention, type_intervention } = req.body;
	
	if(!motif_hospitalisation) {
		return res.status(400).json({code: "E_001", message: "Renseignez le motif_hospitalisation !"})
	}

	Hospitalisation.findOne({_id: req.params.id, userId: req.user.userId})
	.then((hospitalisation) => {
		if (!hospitalisation) return res.status(404).json({error: "Hospitalisation non trouvé !"});
		
		if (motif_hospitalisation) hospitalisation.motif_hospitalisation = motif_hospitalisation;
		if (patientId) hospitalisation.patientId = patientId;
		if (histoire_maladie) hospitalisation.histoire_maladie = histoire_maladie;
		if (parametres_dosages) hospitalisation.parametres_dosages = parametres_dosages;
		if (inspection) hospitalisation.inspection = inspection;
		if (palpation) hospitalisation.palpation = palpation;
		if (auscultation) hospitalisation.auscultation = auscultation;
		if (percussion) hospitalisation.percussion = percussion;
		if (toucher_rectal) hospitalisation.toucher_rectal = toucher_rectal;
		if (toucher_vaginal) hospitalisation.toucher_vaginal = toucher_vaginal;
		if (conclusion_clinique) hospitalisation.conclusion_clinique = conclusion_clinique;
		if (examen_paraclinique) hospitalisation.examen_paraclinique = examen_paraclinique;
		if (examen_clinique) hospitalisation.examen_clinique = examen_clinique;
		if (evolution) hospitalisation.evolution = evolution;
		if (date_entree) hospitalisation.date_entree = date_entree;
		if (date_intervention) hospitalisation.date_intervention = date_intervention;
		if (date_previsionnelle_sortie) hospitalisation.date_previsionnelle_sortie = date_previsionnelle_sortie;
		if (type_intervention) hospitalisation.type_intervention = type_intervention;
		if (numero_chambre) hospitalisation.numero_chambre = numero_chambre;
		if (numero_lit) hospitalisation.numero_lit = numero_lit;
		if (service) hospitalisation.service = service;
		if (conclusion_finale) hospitalisation.conclusion_finale = conclusion_finale;
		if (diagnostic_final) hospitalisation.diagnostic_final = diagnostic_final;

		hospitalisation.save()
		.then(() => res.status(200).json({message: "Hospitalisation modifiée !", data: hospitalisation}))
		.catch(error => res.status(500).json({error}))
	})
	.catch(error => res.status(404).json({error}))
}

/* Supprimer une hospitalisation */
exports.supprimerHospitalisation = (req, res) => {
	Hospitalisation.findOne({_id: req.params.id, userId: req.user.userId})
	.then((hospitalisation) => {
		if (!hospitalisation) return res.status(404).json({error: "Hospitalisation non trouvée !"});

		hospitalisation.delete()
			.then(() => res.status(200).json({message : 'Hospitalisation supprimée !'}))
			.catch(error => res.status(500).json({error}));
	})
	.catch((error) => {res.status(404).json({error})})
};