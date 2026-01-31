const express = require('express')
const authRouter = express.Router()
const {register,login,logout,adminRegister, deleteProfile, bagNoChange} = require('../controller/userAuthenticate')
const userMiddleware = require('../middleware/userMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',userMiddleware,logout)
authRouter.post('/admin/register',adminMiddleware,adminRegister)
authRouter.delete('/delete',userMiddleware,deleteProfile)
authRouter.put('/bagNumber/change',userMiddleware,bagNoChange)
authRouter.get('/check',userMiddleware,(req,res)=>{
    const reply = {
        firstName:req?.result?.firstName,
        lastName: req?.result?.lastName,
        emailId:req?.result?.emailId,
        role:req?.result?.role,
        _id:req?.result?._id,
        bagNo: req?.result?.bagNo
    }
    res.status(201).json({
        user:reply,
        message: "Valid User"
    })
})

module.exports = authRouter