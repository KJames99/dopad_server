const http = require('http');
const app = require('./app');

const connectDB = require('./config/database')

/* la fonction normalizePort renvoie un port valide, qu'il soit fourni 
sous la forme d'un numéro ou d'une chaîne */
const normalizePort = val => {
	const port = parseInt(val, 10);

	if (!isNaN(port) && (port >= 0)) {
		return port;
	}
	return 3000;
};

const port = normalizePort(process.env.API_PORT);
app.set('port', port);

/* la fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. 
Elle est ensuite enregistrée dans le serveur */
const errorHandler = error => {
	if (error.syscall !== 'listen') {
		throw error;
	}
  
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
	
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges.');
			process.exit(1);
		break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1);
		break;
		default:
			throw error;
  }
};

async function startServer(){
	try {
		// await mailTransport.verify()
		// 	.then(() => {console.log("Configuration mail correcte !")})
		// 	.catch((error) => {
		// 		console.log("Erreur de configuration du service mail : " + error.message)
		// 		process.exit()
		// 	})

		await connectDB(process.env.MONGO_URI)
			.then(() => {console.log("Connexion à la base de données réussie !")})
			.catch((error) => {
				console.log("Erreur de connexion : " + error.message)
				process.exit()
			})

		const server = http.createServer(app);

		/* un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé
		sur lequel le serveur s'exécute dans la console */
		server.on('error', errorHandler);
		server.on('listening', () => {
			const address = server.address();
			const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
			console.log('Listening on ' + bind);
		});
		
		server.listen(port);

	} catch (error) {
		console.log("Erreur : " + error)
		process.exit()
	}
}

startServer()