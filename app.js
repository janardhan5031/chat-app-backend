const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');

const database= require('./util/database');

const app = express();

app.use(body_parser.json());
app.use(cors());

//importing the routes
const userRoutes = require('./routes/user');

// rediercting to the respective routes
app.use('/user',userRoutes);

database
.sync()
//.sync({force:true})
.then(()=>{
    app.listen(5000);
})
.catch(err=>console.log(err));