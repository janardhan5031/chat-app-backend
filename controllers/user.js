const Users= require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
exports.sign_in = (req,res,next)=>{
    const {email,password}=req.body;
    Users.findAll({where:{email:email}})
    .then((user)=>{
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,success)=>{
                if(err){
                    res.status(401).json({success:false,msg:'something went wrong in password'});
                }
                if(success){
                    // if password is mactched, create new token for this user and send it

                    const token = jwt.sign(user[0].id,process.env.SECRETE_KEY);

                    const membership = user[0].isPremiumUser;
                    //console.log(membership)
                    res.status(200).json({token:token,membership:membership,success:true,msg:'successfully logged in'});
                }else{
                    res.status(203).json({success:false,msg:'password do not matched'})
                }
            })
        }else{
            
            res.status(203).json({msg:'you are not a member to sign in. pls sign up'})
        }
    })
    .catch(err =>console.log(err));
} 