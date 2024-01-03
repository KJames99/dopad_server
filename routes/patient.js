const express = require('express');
const router = express.Router();

const isAuthenticated = require("../middlewares/isAuthenticated");

const patientCtrl = require('../controllers/patient')

router.get('/all', isAuthenticated, patientCtrl.listeAllPatient);

router.post('/', isAuthenticated, patientCtrl.creerPatient);

router.get('/:id', isAuthenticated, patientCtrl.detailsPatient);

router.get('/all/:id', isAuthenticated, patientCtrl.detailsAllPatient);

router.put('/:id', isAuthenticated, patientCtrl.modifierPatient);

router.delete('/:id', isAuthenticated, patientCtrl.supprimerPatient);

module.exports = router