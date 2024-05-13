const Sequelize=require('sequelize')
const db=require('../util/database')




const User=db.define('user',{
  id:{
    type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
  },
  name:Sequelize.STRING,
  email:{type:Sequelize.STRING,
    unique: true,
},
  password:Sequelize.STRING,
  premium:Sequelize.BOOLEAN,
  totalAmount:Sequelize.FLOAT
})

module.exports=User