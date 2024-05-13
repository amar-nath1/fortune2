const Razorpay=require('razorpay')
const Order=require('../models/order')
const User=require('../models/user')

exports.goPremium=(req,res,next)=>{
    const apikey=process.env.KEY_ID
    console.log(req.query.ct,' ctctctct')
    
try{
    
    const rzp=new Razorpay({
            key_id:process.env.KEY_ID,
            key_secret:process.env.KEY_SECRET
    })
    
   const totalRs = +req.query.ct *200
    rzp.orders.create({amount:totalRs,currency:'INR'},(err,order)=>{
        if (err){
            throw new Error(JSON.stringify(err))
        }
        Order.create({
            orderid:order.id,
            status:'PENDING',
            userId:req.userId.userId
        })
        .then(()=>{
            return res.status(200).json({order,key_id:rzp.key_id})
        }).catch((err)=>{
            throw new Error(err)
        })
    })
}
catch(err){
console.log(err)
}


}

exports.putTransaction=async (req,res,next)=>{
    console.log('reached to put')
    try{
        
    const updatedUserData=req.body
    console.log(updatedUserData,'updataaa')
    Order.update(updatedUserData,{
        where:{
            orderid:updatedUserData.orderid
        },
            
    }).then(([rowsUpdated])=>{
        if (rowsUpdated===1){
            console.log(updatedUserData,'upus')
            User.update({premium:updatedUserData.status==='SUCCESS'?true:false},{
                where:{
                    id:req.userId.userId
                }
            }).then(([userRowUpdate])=>{
                if (userRowUpdate===1){
                    res.status(200).json({prem:'hogya'})
                }
            })
            
        }
        else {
            res.status(404).json({ error: 'User not found' });
          }  
    })
    

    }
    catch(err){
        console.error('Error updating user',err)
        res.status(500).json({ error: 'Internal server error' });
    }
}

