const express = require('express');
const router = express.Router();

const isAuthenticated = require("../middlewares/isAuthenticated");

const consultationCtrl = require('../controllers/consultation')

router.get('/all', isAuthenticated, consultationCtrl.listeAllConsultation);

router.get('/', isAuthenticated, consultationCtrl.listeConsultation);

router.get('/:type', isAuthenticated, consultationCtrl.listeConsultationTypee);

router.post('/', isAuthenticated, consultationCtrl.creerConsultation);

router.get('/:id', isAuthenticated, consultationCtrl.detailsConsultation);

router.get('/all/:id', isAuthenticated, consultationCtrl.detailsAllConsultation);

router.put('/:id', isAuthenticated, consultationCtrl.modifierConsultation);

router.delete('/:id', isAuthenticated, consultationCtrl.supprimerConsultation);

module.exports = router