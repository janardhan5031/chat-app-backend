const sequelize = require('sequelize');
const database = require('../util/database');

const group = database.define('group',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    groupName:sequelize.STRING
});


module.exports = group;