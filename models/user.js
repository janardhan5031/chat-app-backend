
const sequelize = require('sequelize');
const db = require('../util/database');

const user = db.define('users',{
    id:{
        type:sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:sequelize.STRING,
    email:sequelize.STRING,
    number:sequelize.STRING,
    password:sequelize.STRING
})

module.exports = user;