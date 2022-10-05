const express  = require('express');

const groupCntroll = require('../controllers/groupControll');
const auth = require('../controllers/authentication');

const router = express.Router();

router.post('/create-group',auth.authenticate,groupCntroll.createGroup);

// get all groups associated with user
router.get('/get-all',auth.authenticate,groupCntroll.getAll);

router.get('/get-members',auth.authenticate,groupCntroll.get_all_members)

router.post('/add_new_member',auth.authenticate,groupCntroll.addMember);

router.post('/add_admin',auth.authenticate,groupCntroll.add_admin);

router.post('/remove_admin',auth.authenticate,groupCntroll.remove_admin);

router.post('/remove_member',auth.authenticate,groupCntroll.remove_member);

module.exports = router;


