const express = require('express');
const router = express.Router();
const userControll = require('../controllers/user');

router.post('/sign_up',userControll.sign_up)

module.exports = router;