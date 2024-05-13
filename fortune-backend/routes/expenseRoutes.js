const express=require('express')
const ec=require('../controllers/expenseController')
const mdlAuth=require('../middleware/auth')
const router=express.Router()

router.post('/add-expense',mdlAuth.authenticate,ec.postExpense)
router.get('/all-expense',mdlAuth.authenticate,ec.getExpense)
router.get('/file-urls',mdlAuth.authenticate,ec.getFileUrls)
router.get('/all-expense-users',mdlAuth.authenticate,ec.getAllExpense)
router.delete('/delete/:id',mdlAuth.authenticate,ec.deleteExpense)

exports.routes=router