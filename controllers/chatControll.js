
const fs= require('fs');

const { json } = require('body-parser');
const { NUMBER,Op } = require('sequelize');
const AWS = require('aws-sdk');


const Messages = require('../models/messages');
const Group = require('../models/group');

// storing the message sent to other person
exports.sendMessage = (req,res,next)=>{
    
    const {msg}= req.body;
    
    console.log(msg);
    // extracting the recieved person user id from query
    const send_to= Number(req.query.send_to);

    req.user.createMessage({msg,send_to})
    .then((response)=>{
        //console.log(response)
        res.status(201).send(response);
    })
    .catch(err => console.log(err));


}




// sending messgaes in group
exports.postGrpChat = (req,res,next) =>{
    const groupId = req.query.send_to;
    const msg = req.body.msg;

    try{
        req.user.createMessage({msg,groupId})
        .then(new_msg=>{
            //console.log(new_msg)
            res.status(201).send(new_msg);
        })
        .catch(err => console.log(err));
    }catch(err){
        console.log(err);
    }
}

// uploading file into aws s3
async function uploadToS3 (file){

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    })
    
    // creating unique name for every file uploads
    const fileName = Date.now()+file.originalname;

    return new Promise( (resolve,reject) =>{

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName, // file name as original one
            Body: file.buffer,           // file data to upload into s3,(chunks/complete data as string)
            ACL:'public-read'
        }
        s3.upload(params,(err,success)=>{
            if(err){
                reject(err)
            }else{
                //console.log(success)
                resolve(success)
            }
        })
    })
    

}

// sending files between users
exports.sendFile = async (req,res,next)=>{   
    try{
        const file = req.file;
    
        const uploadedImage = await uploadToS3(file)
    
        console.log(uploadedImage)

        const imgUrl =uploadedImage.Location;
        // store that image url in msg table corresponding to send_to parameter in req.query
        const send_to = req.query.send_to;

        req.user.createMessage({imgUrl,send_to})
        .then(result =>{
            res.status(200).send(result)
        })
        .catch(err => console.log(err))

    }catch(err){console.log(err)}

}

// sending files in group
exports.sendFile_group =async (req,res,next) =>{
    try{
        const file = req.file;
    
        const uploadedImage = await uploadToS3(file)
    
        console.log(uploadedImage)

        const imgUrl =uploadedImage.Location;
        // store that image url in msg table corresponding to send_to parameter in req.query
        const groupId = req.query.send_to;

        req.user.createMessage({imgUrl,groupId})
        .then(result =>{
            res.status(200).send(result)
        })
        .catch(err => console.log(err))

    }catch(err){console.log(err)}
}



// get all one - one messages stored in db
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

        // selecting rows less than the current time
        createdAt:{ [Op.lt] : new Date() },

        id:{ [ Op.gt ]:[ last_msg_id ] },
        userId:{ [ Op.in ]:[ req.user.id , send_to ]},
        send_to:{ [ Op.in ]:[ req.user.id , send_to ]},

        },
        order:[['id','DESC']],
        // appliing limit to get data from the last rows
        limit:50


    })
    .then(async (messages)=>{
        if(messages.length>0){
            //console.log(messages);
            messages.sort((a,b)=>{
                return a.id -b.id;
            })
            res.status(201).send(messages);
        }else{
            res.status(203).json({msg:'no messagesa are there in database'})
        }
    })
    .catch(err =>console.log(err))
}

exports.getGrpMsgs =(req,res,next)=>{
    const groupId = req.query.send_to;
    const last_msg_id = req.query.last_msg_id;
    console.log('===== group msgs ===',last_msg_id)
    
    try{
        req.user.getGroups({where:{id:groupId}})
        .then(groups=>{
            return groups[0].getMessages({ 
                where:{ 
                    groupId ,
                    id:{ [Op.gt]: [ last_msg_id ] }
                },
                attributes:['id','msg','imgUrl','userId','groupId']
            }) 
        })
        .then(groupMessages =>{
            //console.log(groupMessages);
            if(groupMessages.length>0){

                res.status(201).send(groupMessages)
            }else{
                res.status(203).json({msg:'no messagesa are there in database'})
            }
        }) 
        .catch(err => console.log(err))
    }
    catch(err){
        console.log(err)
    }
}