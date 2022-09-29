const User = require('../models/user');

const jwt = require('jsonwebtoken');

exports.authenticate = (req,res,next)=>{
    const token = req.header('authorization');
    const userId = jwt.verify(token,process.env.SECRETE_KEY);

    User.findByPk(userId)
    .then((user)=>{
        req.user=user;
        next();
    })
    .catch(err=>{
        res.status(203).json({msg:'use in not authorized'});
    })
}