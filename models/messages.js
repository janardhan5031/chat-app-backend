const sequelize = require('sequelize');
const database = require('../util/database');

const messages = database.define('message',{
    id:{
        type:sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    msg:sequelize.STRING,
    imgUrl:sequelize.STRING,
    send_to:sequelize.STRING
})

module.exports = messages;