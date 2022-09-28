const sequelize = require('sequelize');

const db = new sequelize('chat-app','root','MySql@1234',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = db;