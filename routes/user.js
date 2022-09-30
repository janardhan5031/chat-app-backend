const express = require('express');
const router = express.Router();
const userControll = require('../controllers/user');
const auth= require('../controllers/authentication');

router.post('/sign_up',userControll.sign_up);

router.post('/sign_in',userControll.sign_in);

router.get('/getAllUsers',auth.authenticate,userControll.getAllUsers);

module.exports = router;