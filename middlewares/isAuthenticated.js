const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers?.authorization?.split(' ')[1];
	
	if (!token) {
		return res.status(401).json({code: "E401NC", message: "Vous n'êtes pas connecté !"});
	}
	
	try {
		jwt.verify(token, process.env.TOKEN_KEY, (error, decoded) => {
			if (error) {
				return res.status(401).json({code: "E401TNV", message: "Le token n'est pas valide !" });
			} else {
				req.user = decoded;
				next();
			}
		});
	} catch (err) {
		res.status(500).json({code: "E500EVT", message: 'Erreur de vérification du token !' });
	}
};

module.exports = verifyToken;