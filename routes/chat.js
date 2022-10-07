const express  = require('express');
const router = express.Router();
const multer  = require('multer')


const auth = require('../controllers/authentication');
const chatControll =require('../controllers/chatControll');

// sending msg to another user
router.post('/send',auth.authenticate,chatControll.sendMessage);

// sending file to another user
const storage = multer.memoryStorage();   // slipts the incoming file/ files into chunks

const upload = multer({storage:storage});  // attaching the file to the req access along req life

router.post('/send/file',auth.authenticate , upload.single('image'),chatControll.sendFile);

router.post('/send-to-grp/file',auth.authenticate, upload.single('image') , chatControll.sendFile_group)

router.get('/get-all',auth.authenticate,chatControll.getAll);

router.post('/send-to-grp',auth.authenticate, chatControll.postGrpChat)

router.get('/get-grp-msgs',auth.authenticate, chatControll.getGrpMsgs);

module.exports = router;