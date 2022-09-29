const Chat = require('../models/messages');

exports.sendMessage = (req,res,next)=>{
    const {msg}= req.body;
    console.log(msg);
    req.user.createMessage({msg})
    .then((response)=>{
        //console.log(response)
        res.status(201).send(response);
    })
    .catch(err => console.log(err));
}