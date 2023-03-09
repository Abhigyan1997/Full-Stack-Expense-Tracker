const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const DownloadedFile=sequelize.define('file',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
   url:Sequelize.STRING

});
module.exports=DownloadedFile;