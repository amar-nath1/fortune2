const Sequelize=require('sequelize')
const db=require('../util/database')

const FileUrl=db.define('fileUrl',{
  id:{
    type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
  },
  fileUrl:Sequelize.STRING,
  
})

module.exports=FileUrl