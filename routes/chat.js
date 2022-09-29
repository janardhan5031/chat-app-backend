const express  = require('express');
const route = express.Router();

const auth = require('../controllers/authentication');
const chatControll =require('../controllers/chatControll');

route.post('/send',auth.authenticate,chatControll.sendMessage);

module.exports = route;