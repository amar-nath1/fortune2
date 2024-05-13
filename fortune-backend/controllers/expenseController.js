const Expense=require('../models/expense')
const User=require('../models/user')
const FileUrl=require('../models/fileUrl')
const AWS=require('aws-sdk')
require('dotenv').config()
const {Sequelize,Op}=require('sequelize')
const sequelize = require('../util/database')
exports.postExpense=async(req,res,next)=>{
const t=await sequelize.transaction()
try{
   const addedExpense= await Expense.create({
        amount:req.body.amount,
        description:req.body.description,
        type:req.body.expenseType,
        userId:req.userId.userId,
        income:['salary','income'].some(el=>req.body.expenseType.includes(el))
    },{transaction:t})
       
        
        const user=await User.findOne({where:{id:req.userId.userId}})
        if (!user) {
            return res.status(404).json({message:'User not found'});
          }
          console.log(user.totalAmount+req.body.amount,'useeere')
     await User.update({totalAmount:user.totalAmount+req.body.amount},{
            where:{
                id:req.userId.userId
    
            },
            transaction:t
        })
            await t.commit()
            res.status(200).json({addedExpense:addedExpense})
        
}
catch(err){
await t.rollback()
}


}

const uploadToS3=(dataToUpload,filename)=>{

let s3bucket=new AWS.S3({
  accessKeyId:process.env.AWS_ACCESS_KEY,
  secretAccessKey:process.env.AWS_SECRET_KEY,
  
})

  let params={
    Bucket:process.env.AWS_BUCKET_NAME,
    Key:filename,
    Body:dataToUpload,
    ACL:'public-read'
  }
  return new Promise((resolve,reject)=>{
    s3bucket.upload(params,(err,s3Response)=>{
      if(err){
        console.log(err)
        reject(err)
      }
      else{
        console.log('success')
        resolve(s3Response.Location)
      }
    })
  })
  

}

const saveFileUrl=async (url,userId)=>{
  try{
      const saveUrl=await FileUrl.create({
        fileUrl:url,
        userId:userId
      })
    }
    catch(err){
      console.log('got error',err)
    }
}

exports.getExpense=(req,res,next)=>{

const getCurrentDateInfo=(option)=> {
    
      const currentDate = new Date();
  
      switch (option) {
        case 'year':
          return currentDate.getFullYear().toString();
        case 'month':
          return (currentDate.getMonth() + 1).toString(); // +1 because months are zero-indexed
        case 'week':
          const weekNumber = Math.ceil((currentDate.getDate() + currentDate.getDay()) / 7);
          return (weekNumber);
       
      }
    
  }



    console.log(req.userId,'usereid')
Expense.findAndCountAll({
    where:{
        userId:req.userId.userId,
        createdAt: {
            [Op.and]: [
              sequelize.where(
                sequelize.literal(`${req.query.filtertype.toUpperCase()}(createdAt)`),
                

                getCurrentDateInfo(req.query.filtertype)
              )
            ]
          }
    },
    offset: Number(req.query.offset),
  limit: Number(req.query.itemsperpage),
}).then(async (results)=>{
  
    const expensesRes=results.rows
    const count=results.count
    if (req.query.download=='true'){
     let sRes=await uploadToS3(JSON.stringify(expensesRes),`etdata${new Date().getTime()}tme${req.userId.userId}.txt`)
     console.log(sRes,'sRes')
     saveFileUrl(sRes,req.userId.userId)
     res.status(200).json({fileUrl:sRes})
    }
    else{
      res.status(200).json({expenses:expensesRes,count:count})
    }
    
}).catch((err)=>{
    console.log(err)
})


}

exports.getFileUrls=async (req,res,next)=>{
    const allFileUrls=await FileUrl.findAll({
        where:{
          userId:req.userId.userId
        }
      })
      console.log(allFileUrls,' allllllurrrls')
      res.status(200).json({success:true,urls:allFileUrls})
}

exports.getAllExpense=(req,res,next)=>{
    User.findAll({
        attributes:[
            [Sequelize.literal('user.id'), 'userId'],
            [Sequelize.literal('user.totalAmount'), 'totalAmount'],
            [Sequelize.literal('user.name'), 'name'],
        ],
        group: [Sequelize.literal('user.id')],
          order: [[Sequelize.literal('totalAmount'), 'DESC']],
    })
        .then((result) => {
          res.status(200).json({result:result})
          console.log(result);
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
        });
}

exports.deleteExpense=async (req,res,next)=>{
    const t=await sequelize.transaction()

    try{
                  
          const exp=await Expense.findOne({where:{id:req.params.id}})
          

      const delExp=  await Expense.destroy({
            where:{
                id:req.params.id
            },
            transaction:t

        })
        const user=await User.findOne({where:{id:req.userId.userId}})
        if (!user) {
            return res.status(404).json({message:'User not found'});
          }
                
     await User.update({totalAmount:user.totalAmount-exp.amount},{
            where:{
                id:req.userId.userId
    
            },
            transaction:t
        })
            await t.commit()
           
            res.status(200).json({success:true})
    }

    catch(err){
        await t.rollback()

    }



}