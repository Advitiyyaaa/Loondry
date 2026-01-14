const jwt = require('jsonwebtoken');
const User = require('../models/user')
require('dotenv').config()
const RedisClient = require('../config/redis')

const adminMiddleware = async(req,res,next)=>{
    try{
        const {token} = req.cookies
        if(!token){
            throw new Error("No token found")
        }
        const payload = jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!payload){
            throw new Error("Invalid token")
        }
        const {_id} = payload
        if(!_id){
            throw new Error("No id found")
        }
        if(payload.role!='admin')
            throw new Error("Invalid token")
        const result = await User.findOne({_id})
        if(!result){
            throw new Error("No User found")
        }
        const blocked = await RedisClient.exists(`token:${token}`);
        if(blocked)
            throw new Error("Invalid Token")
        req.result=result;
        next()
    }
    catch(err){
        return res.status(400).send("Error: "+err)
    }
}

module.exports = adminMiddleware