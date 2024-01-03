require("dotenv").config();
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const morgan = require('morgan');

// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUi = require("swagger-ui-express");
// const swaggerDefinition = require('./docs');

const userRoutes = require('./routes/user');
const patientRoutes = require('./routes/patient');
const consultationRoutes = require('./routes/consultation');
const hospitalisationRoutes = require('./routes/hospitalisation');

const app = express();

app.use(bodyParser.json());
app.use(cors({origin: ["http://localhost:3000", "http://localhost:5173"], credentials: true}));
app.use(helmet());
app.use(morgan('combined'));
app.use(cookieSession({
	name: 'sessionID',
	keys: process.env.TOKEN_KEY,

	// Cookie Options
	maxAge: 24 * 60 * 60 * 1000, // 24 hours
	cookie: {
		secure: true,
		httpOnly: true,
	}
}));

// Static files
app.use('/images', express.static('images'))

// Swagger config and Paths to files containing OpenAPI definitions
// const options = {swaggerDefinition, apis: ['./routes/*.js']};
// const spec = swaggerJSDoc(options);

// app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
// app.use('/api/api-docs.json', (req, res) => {
// 	res.setHeader("Content-Type", "application/json");
// 	res.send(spec)
// });

app.use('/api/auth', userRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/hospitalisation', hospitalisationRoutes);

module.exports = app;