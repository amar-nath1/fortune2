const Sequelize=require('sequelize')
const db=require('../util/database')




const ResetPassword=db.define('resetpassword',{
  uuid:Sequelize.STRING,
  userId:Sequelize.INTEGER,
  isActive:Sequelize.BOOLEAN,
 
})

module.exports=ResetPassword