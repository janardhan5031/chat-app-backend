const Users= require('../models/user');
const bcrypt = require('bcrypt');

// sign up middlewere function
exports.sign_up = (req,res,next)=>{
    const {name,email,number,password} = req.body;
    Users.findAll({where:{email}})
    .then(users=>{
        if(users.length>0){
            res.status(203).json({msg:'this email is already exists'})
        }else{
            // if there is no user with the email, then he is allowed to sign up with that email
            try{
                bcrypt.genSalt(10,(err,slatSTR)=>{
                    if(err){
                        console.log(err)
                        res.statu(203).jsom({msg:'unable to encrypt ur pswd'})
                    }
                    bcrypt.hash(password,slatSTR,((err,hashed_pswd)=>{
                        if(err){
                            res.status(203).json({msg:'unable to hash ur password'})
                        }
        
                        // storing the user data after successful hashing of password
                        Users.create({name,email,number,password:hashed_pswd})
                        .then((result)=>{
                            console.log(result);
                            res.status(201).json({msg:'successfully created ur account. pls login'})
                        })
                    }))
                })
            }catch(err){
                console.log(err);
            }
        }
    })
    .catch(err=>console.log(err))
}

// sign in middlewere function
exports.sign_in =(req,res,next)=>{

} 