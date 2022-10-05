const sequelize = require('sequelize');
const database = require('../util/database');

const group_conversataion = database.define('groupMembers',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    isadmin:{
        type:sequelize.BOOLEAN,
        defaultValue:false
    }
},
{
    timestamps:false
})

module.exports = group_conversataion;