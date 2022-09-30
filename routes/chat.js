const express  = require('express');
const route = express.Router();

const auth = require('../controllers/authentication');
const chatControll =require('../controllers/chatControll');
const router = require('./user');

route.post('/send',auth.authenticate,chatControll.sendMessage);

route.get('/get-all',auth.authenticate,chatControll.getAll);

module.exports = route;