const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/Utilisateur');

exports.creerUser = (req, res) => {
	// Get user input
	const { nom, prenoms, password, password2 } = req.body;
	let email = req.body.email

	// Validate user input
	if (!(email && password && password2 && nom && prenoms)) {
		return res.status(400).json({code: "E_001", message: 'Renseignez les champs requis !'});
	} else if(password != password2) {
		return res.status(400).json({code: "E_002", message: 'Mots de passe différents !'});
	}

	email = email.toLowerCase(), // sanitize: convert email to lowercase
	// check if user already exist
	// Validate if user exist in our database
	User.findOne({ email })
	.then((usr) => { 
		if (usr) return res.status(409).json({code: "E_003", message: 'Cet email existe déjà !'});
		
		User.findOne({ username })
		.then((user) => { 
			if (user) return res.status(409).json({code: "E_004", message: "Ce nom d'utilisateur existe déjà !"});

			// Encrypt user password
			bcrypt.hash(password, 10)
			.then((encryptedPassword) => {
				// Create user in our database
				const user = new User({
					nom,
					prenoms,
					email: email,
					isAdmin: req.body.isAdmin ? req.body.isAdmin : false,
					password: encryptedPassword,
					// confirmationCode: jwt.sign({email: email}, process.env.TOKEN_KEY, { expiresIn: "5m", })
				});	

				user.save()
				.then((user) => {
					// // Send confirmation code
					// mail.sendConfirmationEmail(
					// 	user.nom + " " + user.prenoms,
					// 	user.email,
					// 	user.confirmationCode
					// );

					// Create token
					token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin, email: user.email }, process.env.TOKEN_KEY, { expiresIn: "7d", });
					req.session.user = user;
					req.session.token = token;
					res.status(201).json({
						message: "Compte créé !", 
						data: {
							user: user,
							token: token,
							// confirmationLink: `${process.env.BASE_URL}:${process.env.API_PORT}/api/auth/confirm/${user.confirmationCode}`
						}
					});
				})
				.catch(error => res.status(500).json({code: "E_005", message: "Impossible de faire cet enregistrement !"}))
			})
			.catch(error => res.status(500).json({code: "E_006", message: "Impossible de hasher le mot de passe !"}))
		})
		.catch(error => res.status(500).json({code: "E_007", message: "Erreur lors de la recherche !"}))
	})
	.catch(error => res.status(500).json({code: "E_007", message: "Erreur lors de la recherche !"}))
}

exports.login = (req, res) => {
	const { email, password } = req.body;
	
	// Validate user input
	if (!(email && password)) return res.status(400).json({code: "E_001", message: "Renseignez les champs requis !"});

	User.findOne({ email })
	.then((user) => {
		if (!user) return res.status(404).json({code: "404", message: 'Email ou mot de passe incorrect !' });
		
		// Comparaison des mots de passes
		bcrypt.compare(password, user.password)
		.then(valid => {
			if (!valid) return res.status(404).json({code: "404", message: 'Email ou mot de passe incorrect !' });
			
			// Compte vérifié ou pas
			// if (!user.isVerified) return res.status(400).json({code: "400", message: 'Compte non vérifié !' });

			token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin, email: user.email }, process.env.TOKEN_KEY, { expiresIn: '7d' });
			// save user token
			req.session.user = user;
			req.session.token = token;
			res.status(200).json({email: user.email, username: user.username, nom: user.nom, prenoms: user.prenoms, isAdmin: user.isAdmin/*, token: token*/});
		})
		.catch(error => res.status(500).json({code: "500", message: "Erreur de comparaison des mots de passe !"}))
	})
	.catch(error => res.status(500).json({code: "500", message: "Erreur lors de la recherche !"}))
}

exports.listeAllUsers = (req, res) => {
	User.find()
		.then(users => res.status(200).json({data: users}))
		.catch(error => res.status(500).json({code: "500", message: "Impossible de trouver les utilisateurs !"}));
};

exports.listeAllAdmins = (req, res) => {
	User.find({isAdmin: true})
		.then(users => res.status(200).json({data: users}))
		.catch(error => res.status(500).json({code: "500", message: "Impossible de trouver les utilisateurs !"}));
};

// Changer le mot de passe une fois connecté
exports.changePassword = (req, res) => {
	const { password, newPassword, newPassword2 } = req.body;

	// Validate user input
	if (!(password && newPassword && newPassword2)) {
		return res.status(400).json({code: "E_001", message: 'Renseignez les champs requis !'});
	}

	User.findOne({_id: req.user.userId})
	.then(user => {
		if (!user) return res.status(404).json({code: "404", message: "Utilisateur non trouvé !"});
		
		// Comparaison des mots de passes
		bcrypt.compare(password, user.password)
		.then(valid => {
			if (!valid) return res.status(400).json({code: "400", message: 'Mot de passe incorrect !' });
			if(newPassword != newPassword2) return res.status(400).json({code: "E_002", message: 'Mots de passe différents !'});

			// Encrypt user password
			bcrypt.hash(newPassword, 10)
			.then((encryptedPassword) => {
				user.password = encryptedPassword
				user.save()
				.then(() => res.status(200).json({data: user}))
				.catch(error => res.status(500).json({code: "500", message: "Impossible de modifier le mot de passe de l'utilisateur !"}));
			})
			.catch(error => res.status(500).json({code: "500", message: "Impossible de hasher le mt de passe de l'utilisateur !"}));
		})
		.catch(error => res.status(500).json({code: "500", message: "Impossible de comparer les mots de passe !"}));
	})
	.catch(error => res.status(500).json({code: "500", message: "Impossible de rechercher l'utilisateur !"}));
}

exports.recoverPassword = (req, res) => {
	const {email, password, password2} = req.body

	// Validate user input
	if (!(email && password && password2)) {
		return res.status(400).json({code: "E_001", message: 'Renseignez les champs requis !'});
	} else if(password != password2) {
		return res.status(400).json({code: "E_002", message: 'Mots de passe différents !'});
	}

	User.findOne({ email })
	.then(user => {
		if (!user) return res.status(404).json({code: "404", message: "Utilisateur non trouvé !"});

		// Change password
			bcrypt.hash(password, 10)
			.then((encryptedPassword) => {
				user.password = encryptedPassword
				user.save()
				.then((user) => {
					return res.status(200).json({ message: "Mot de passe modifié !"})
				})
				.catch(error => res.status(500).json({code: "E_005", message: "Impossible de faire cet enregistrement !"}))
			})
			.catch(error => res.status(500).json({code: "E_006", message: "Impossible de hasher le mot de passe !"}))
	})
	.catch(error => res.status(500).json({code: "500", message: "Impossible de rechercher l'utilisateur !"}));	
}