const path = require('path');

const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const dotenv =require('dotenv');
dotenv.config();

const database=require('./util/database');
const User = require('./models/user')
const Chat = require('./models/messages');
const Groups = require('./models/group');
const GroupMembers = require('./models/group_members');

const app = express();

app.use(body_parser.json());
app.use(cors());

//importing the routes
const userRoutes = require('./routes/user');
const chat = require('./routes/chat');
const group = require('./routes/group');

// rediercting to the respective routes
app.use('/user',userRoutes);
app.use('/chat',chat);
app.use('/group',group);

// page routes
app.use('/public',(req,res,next) =>{

    const files =new Set([
        '/chat/chat.html',
        '/chat/chat.css',
        '/chat/chat.js',
        '/sign_in/sign_in.html',
        '/sign_in/sign_in.js',
        '/signUp/signUp.html',
        '/signUp/signUp.css',
        '/signUp/signUp.js',
        '/page-404/page_404.css'

    ])

    const url= req.url;
    console.log(url);
    if(files.has(url)){
        res.sendFile(path.join(__dirname,`./public${req.url}`));
    }else{
        next();
    }
    
})

// sending 404 page if requst hit any of the deined paths 
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'./public/page-404/page_404.html'));
});


// associations
User.hasMany(Chat);         Chat.belongsTo(User);

// group has many messages and that msgs belongs to this grouo only
Groups.hasMany(Chat);
Chat.belongsTo(Groups)

// user belongs to many groups and that group belongs to many users
User.belongsToMany(Groups,{ through: GroupMembers });
Groups.belongsToMany(User, { through: GroupMembers })


database
.sync()
//.sync({force:true})
.then(()=>{
    app.listen(5000);
})
.catch(err=>console.log(err));