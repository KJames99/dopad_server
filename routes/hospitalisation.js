const express = require('express');
const router = express.Router();

const isAuthenticated = require("../middlewares/isAuthenticated");

const hospitalisationCtrl = require('../controllers/hospitalisation')

router.get('/all', isAuthenticated, hospitalisationCtrl.listeAllHospitalisation);

router.get('/', isAuthenticated, hospitalisationCtrl.listeHospitalisation);

router.post('/', isAuthenticated, hospitalisationCtrl.creerHospitalisation);

router.get('/:id', isAuthenticated, hospitalisationCtrl.detailsHospitalisation);

router.get('/all/:id', isAuthenticated, hospitalisationCtrl.detailsAllHospitalisation);

router.put('/:id', isAuthenticated, hospitalisationCtrl.modifierHospitalisation);

router.delete('/:id', isAuthenticated, hospitalisationCtrl.supprimerHospitalisation);

module.exports = router