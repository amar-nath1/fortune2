const bcrypt=require('bcrypt')
const User=require('../models/user')
const jwt=require('jsonwebtoken')
const ResetPassword=require('../models/forgotpassword')
const Sib=require('sib-api-v3-sdk')
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
const Expense = require('../models/expense')
exports.postUser=(req,res,next)=>{
console.log(req.body,'reqbody')
bcrypt.hash(req.body.password,10,(err,hash)=>{
if (err){
    console.log('errorhai',err)
    return
}




User.create({
    name:req.body.name,
    email:req.body.email,
    password:hash,
    premium:false,
    totalAmount:0
}).then((postres)=>{
    console.log('user added',postres)
res.status(200).json({'added':postres,token:generateAccessToken(postres.id)})
}).catch((err)=>{
    if(err.name==='SequelizeUniqueConstraintError'){
        res.json({'errType':'already exists'})
    }
})

})

}

const generateAccessToken=(userId)=>{
    return jwt.sign({userId:userId},'sharpenerexpensetrackerproject')
}

exports.userLogin=(req,res,next)=>{
        User.findAll({
            where:{
                email:req.body.email
            }
        }).then((foundUser)=>{
                    console.log(foundUser[0]['password'],'fu')
                    if(foundUser.length===0){
                        res.status(200).json({auth:'nullexistence'})
                    }
                    else{
                        bcrypt.compare(req.body.password,foundUser[0]['password'],(err,result)=>{
                                if (err){
                                    console.error(err)
                                }
                                if (result===true){
                                    res.status(200).json({auth:true,user:foundUser[0],token:generateAccessToken(foundUser[0].id)})
                                }
                                else{
                                    res.status(200).json({'auth':false})
                                }
                        })
                    }       
        //  else if(foundUser[0]['password']===req.body.password){
        //         res.status(200).json({'auth':true})
        //     }
        //     else{
        //         res.status(401).json({'auth':false})
        //     }
        // })
    
    }).catch((err)=>{
            res.status(200).json({'auth':'nullexistence'})
        })
}

exports.forgotPassword=async (req,res,next)=>{
    const userEmail=await User.findOne({where:{
        email:req.body.resetEmail
    }})
    if(!userEmail){
        return res.status(200).json({userFound:false})
    }

    const uuid=uuidv4()
    await ResetPassword.create({
        uuid:uuid,
        userId:userEmail.id,
        isActive:true
    })
    const client=Sib.ApiClient.instance
    const apiKey=client.authentications['api-key']
    apiKey.apiKey=process.env.EMAIL_API_KEY
    
    const tranEmaiApi=new Sib.TransactionalEmailsApi()
    const sender={
        email:'amarnath41996@gmail.com'
    }

    const receivers=[
        {
            email:req.body.resetEmail
        }
    ]
    tranEmaiApi.sendTransacEmail({
        sender,
        to:receivers,
        subject:'forgot password reset email',
        
        htmlContent:`<p>Please reset your password here.</p><a href="http://localhost:8100/password/resetpassword/${uuid}">http://localhost:8100/password/resetpassword/${uuid}</a>`
    }).then(()=>{

        res.status(200).json({userFound:true,msg:'mailsent'})
        console.log('mail sent')
    })
    .catch((err)=>{
        console.log(err,'err hai')
    })
}

exports.updatePassword=async (req,res,next)=>{
    console.log(req.body,' requuidbody')
const activeUuid=await ResetPassword.findOne({where:{
    uuid:req.body.uuid,
    isActive:true
}})
activeUuid.isActive=false
await activeUuid.save()
const user=await User.findOne({where:{
    id:activeUuid.userId
}})
bcrypt.hash(req.body.newPassword,10,async(err,hash)=>{
    if (!err){
        user.password=hash
        await user.save()
        res.status(200).json({msg:'password updated successfully'})
    }

    else{
        console.log('got error in hash newpassword')
    }
    
})

console.log(activeUuid,' activeuuid')
}