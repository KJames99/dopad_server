const Patient = require('../models/Patient');

/* Création d'un patient */
exports.creerPatient = (req, res) => {
	const {nom, prenoms, sexe, date_naissance, mode_vie, antecedents} = req.body
	
	if(!nom) return res.status(400).json({code: "E_001", message: "Renseignez le nom !"})

	const patient = new Patient({ nom, prenoms, sexe, date_naissance, mode_vie, antecedents});	

	patient.save()
	.then(() => { res.status(201).json({message: 'Patient créé !', data: patient})})
	.catch(error => { res.status(500).json({error})})
}

/* Liste de tous les patients */
exports.listeAllPatient = (req, res) => {
	Patient.find()
		.then(patients => res.status(200).json({patients}))
		.catch(error => res.status(500).json({error}));
};

/* Détails d'un patient de l'utilisateur connecté */
exports.detailsPatient = (req, res) => {
	Patient.findOne({_id: req.params.id})
		.then(patient => {
			if (!patient) return res.status(404).json({error: "Patient non trouvé !"});
			res.status(200).json({patient});
		})
		.catch(error => res.status(404).json({error}));
};

/* Détails de n'importe quel patient */
exports.detailsAllPatient = (req, res) => {
	Patient.findOne({_id: req.params.id})
		.then(patient => {
			if (!patient) return res.status(404).json({error: "Patient non trouvé !"});
			res.status(200).json(patient);
		})
		.catch(error => res.status(404).json({error}));
};

/* Modifier le nom ou la prenoms d'une patient */
exports.modifierPatient = (req, res) => {
	const { nom, prenoms, sexe, date_naissance, mode_vie, antecedents } = req.body;
	
	if(!nom) {
		return res.status(400).json({code: "E_001", message: "Renseignez le nom !"})
	}

	Patient.findOne({_id: req.params.id, userId: req.user.userId})
	.then((patient) => {
		if (!patient) return res.status(404).json({error: "Patient non trouvé !"});
		
		if (nom) patient.nom = nom;
		if (prenoms) patient.prenoms = prenoms;
		if (sexe) patient.sexe = sexe;
		if (date_naissance) patient.date_naissance = date_naissance;
		if (mode_vie) patient.mode_vie = mode_vie;
		if (antecedents) patient.antecedents = antecedents;

		patient.save()
		.then(() => res.status(200).json({message: "Patient modifié !", data: patient}))
		.catch(error => res.status(500).json({error}))
	})
	.catch(error => res.status(404).json({error}))
}

/* Supprimer un patient */
exports.supprimerPatient = (req, res) => {
	Patient.findOne({_id: req.params.id, userId: req.user.userId})
	.then((patient) => {
		if (!patient) return res.status(404).json({error: "Patient non trouvé !"});

		patient.delete()
			.then(() => res.status(200).json({message : 'Patient supprimé !'}))
			.catch(error => res.status(500).json({error}));
	})
	.catch((error) => {res.status(404).json({error})})
};