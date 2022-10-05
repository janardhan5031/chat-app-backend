const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const dotenv =require('dotenv');

const database= require('./util/database');
const User = require('./models/user');
const Chat = require('./models/messages');
const Groups = require('./models/group');
const GroupMembers = require('./models/group_members');

const app = express();

app.use(body_parser.json());
app.use(cors());
dotenv.config();

//importing the routes
const userRoutes = require('./routes/user');
const chat = require('./routes/chat');
const group = require('./routes/group');

// rediercting to the respective routes
app.use('/user',userRoutes);
app.use('/chat',chat);
app.use('/group',group);

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