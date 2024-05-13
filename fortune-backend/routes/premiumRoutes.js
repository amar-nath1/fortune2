const express=require('express')
const ec=require('../controllers/expenseController')
const pc=require('../controllers/premiumController')
const mdlAuth=require('../middleware/auth')
const router=express.Router()


router.get('/go-premium',mdlAuth.authenticate,pc.goPremium)
router.put('/go-premium',mdlAuth.authenticate,pc.putTransaction)


exports.routes=router