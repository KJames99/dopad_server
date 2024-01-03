const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user')

const isAuthenticated = require("../middlewares/isAuthenticated");

router.post('/register', userCtrl.creerUser);

router.post('/login', userCtrl.login);

router.get('/all', isAuthenticated, userCtrl.listeAllUsers);

router.get('/all/admin', isAuthenticated, userCtrl.listeAllAdmins);

router.put('/:id/changePassword', isAuthenticated, userCtrl.changePassword);

router.put('/recoverPassword', userCtrl.recoverPassword);

module.exports = router