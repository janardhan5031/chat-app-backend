const express  = require('express');
const router = express.Router();

const auth = require('../controllers/authentication');
const chatControll =require('../controllers/chatControll');


router.post('/send',auth.authenticate,chatControll.sendMessage);

router.get('/get-all',auth.authenticate,chatControll.getAll);

router.post('/send-to-grp',auth.authenticate, chatControll.postGrpChat)

router.get('/get-grp-msgs',auth.authenticate, chatControll.getGrpMsgs);

module.exports = router;