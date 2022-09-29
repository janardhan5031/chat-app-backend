const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const dotenv =require('dotenv');

const database= require('./util/database');
const User = require('./models/user');
const Chat = require('./models/messages');

const app = express();

app.use(body_parser.json());
app.use(cors());
dotenv.config();

//importing the routes
const userRoutes = require('./routes/user');
const chat = require('./routes/chat');

// rediercting to the respective routes
app.use('/user',userRoutes);
app.use('/chat',chat)

// associations
User.hasMany(Chat);         Chat.belongsTo(User);


database
.sync()
//.sync({force:true})
.then(()=>{
    app.listen(5000);
})
.catch(err=>console.log(err));