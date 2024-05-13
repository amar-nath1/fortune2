const Sequelize=require('sequelize')
const db=require('../util/database')

const Expense=db.define('expense',{
  id:{
    type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
  },
  amount:Sequelize.STRING,
  description:{type:Sequelize.STRING,
    
},
  type:Sequelize.STRING,
  income:Sequelize.BOOLEAN
})

module.exports=Expense