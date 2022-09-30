const { json } = require('body-parser');
const { NUMBER,Op } = require('sequelize');
const Messages = require('../models/messages');

// storing the message sent to other person
exports.sendMessage = (req,res,next)=>{
    
    const {msg}= req.body;
    console.log(msg);
    // extracting the recieved person user id from query
    const send_to= req.query.send_to;

    if(send_to){
        req.user.createMessage({msg,send_to})
        .then((response)=>{
            //console.log(response)
            res.status(201).send(response);
        })
        .catch(err => console.log(err));
    }
}

// get all messages stored in db
exports.getAll =(req,res,next)=>{
    const send_to= req.query.send_to;
    const last_msg_id = req.query.last_msg_id;
    //console.log(req.user.id+' -> '+send_to);  
    console.log('=====',last_msg_id)

    if(last_msg_id === 'undefined'){
        return res.status(203).json({msg:'no messages are there in database'})
    }

    Messages.findAll({where:{
        // filtering the messages with userId:{1 or 2} and send_to:{1 or 2} exmple case
        // Op -> options we are instrecting to filter
        // Op.in -> shorthand 'OR' operation in sequelize
        // Op.gte -> greater than conditional operation
        id:{ [ Op.gt ]:[ last_msg_id ] },
        userId:{ [ Op.in ]:[ req.user.id , send_to ]},
        send_to:{ [ Op.in ]:[ req.user.id , send_to ]}


    }})
    .then((messages)=>{
        if(messages.length>0){
            //console.log(messages);
            res.status(201).send(messages);
        }else{
            res.status(203).json({msg:'no messagesa are there in database'})
        }
    })
    .catch(err =>console.log(err))
}