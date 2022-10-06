const express  = require('express');
const router = express.Router();
const multer  = require('multer')


const auth = require('../controllers/authentication');
const chatControll =require('../controllers/chatControll');

// sending msg to another user
router.post('/send',auth.authenticate,chatControll.sendMessage);

// sending file to another user
const fileStorageEngine = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./images");
    },
    filename:(req,file,cb) =>{
        cb(null,Date.now()+'--'+file.originalname);
    }
});

const upload = multer({storage:fileStorageEngine});

router.post('/send/file',upload.single('image'),chatControll.sendFile);

router.get('/get-all',auth.authenticate,chatControll.getAll);

router.post('/send-to-grp',auth.authenticate, chatControll.postGrpChat)

router.get('/get-grp-msgs',auth.authenticate, chatControll.getGrpMsgs);

module.exports = router;