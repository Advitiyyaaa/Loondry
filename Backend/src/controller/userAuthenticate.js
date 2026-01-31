const User = require('../models/user')
const userValidate = require("../utils/userValidator");
const adminValidate = require("../utils/adminValidator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const RedisClient = require('../config/redis');
require('dotenv').config()

const register = async (req, res) => {
  try {
    userValidate(req.body);

    const { firstName, lastName, emailId, password, bagNo } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      bagNo,
      role: "user",
    });

    const reply = {
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      role: user.role,
      _id: user._id,
      bagNo: user.bagNo,
    };

    const token = jwt.sign(
      { _id: user._id, emailId, role: "user", bagNo: user.bagNo },
      process.env.JWT_SECRET_KEY,
      { expiresIn: 3600 }
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    res.status(201).json({
      user: reply,
      message: "Registration successful",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const login = async (req,res)=>{
    try{
        const {emailId , password} = req.body
        if(!emailId){
            throw new Error("Invalid Credentials")
        }
        if(!password){
            throw new Error("Invalid Credentials")
        }
        const user = await User.findOne({emailId});
        if(!user){
            throw new Error("WRONG EMAIL OR PASSWORD")
        }
        const match = await bcrypt.compare(password,user.password)
        if(!match)
            throw new Error("WRONG EMAIL OR PASSWORD")
        const reply = {
            firstName:user.firstName,
            lastName: user.lastName,
            emailId:user.emailId,
            role:user.role,
            _id:user._id,
            bagNo:user.bagNo
        }
        const token = jwt.sign({_id:user._id,emailId:emailId, role: user.role,bagNo: user.bagNo},process.env.JWT_SECRET_KEY,{expiresIn:3600})
        res.cookie("token",token,{maxAge: 60*60*1000})
        res.status(201).json({
            user:reply,
            message: "Login successful"
        })
    }
    catch(err){
        res.status(401).send(err.message)
    }
}

const logout = async(req,res)=>{
    try{   
        const {token} = req.cookies
        const payload = jwt.decode(token);

        await RedisClient.set(`token:${token}`,'blocked')
        await RedisClient.expireAt(`token:${token}`,payload.exp)

        res.cookie('token',null,{expires: new Date(Date.now())})
        res.send("Logged Out Succesfully")
    }
    catch(err){
        res.status(503).send(err.message)
    }
}

const adminRegister = async (req, res) => {
  try {
    adminValidate(req.body);

    const { firstName, lastName, emailId, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      firstName,
      lastName, // optional
      emailId,
      password: hashedPassword,
      role: "admin",
    });

    const reply = {
      firstName: admin.firstName,
      lastName: admin.lastName,
      emailId: admin.emailId,
      role: admin.role,
      _id: admin._id,
    };

    res.status(201).json({
      user: reply,
      message: "Admin registered successfully",
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};


const deleteProfile = async(req,res)=>{
    try{
        const id = req.result._id
        if(!id){
            return res.status(400).send("No user found")
        }
        await User.findByIdAndDelete({_id:id})
        return res.status(200).send("User deleted")
    }
    catch(err){
        return res.status(500).send("Internal server error: "+err.message)
    }
}
const bagNoChange = async (req, res) => {
    try {
        const { bagNo } = req.body;
        const id = req.result._id;

        if (!bagNo) {
            return res.status(400).send("Bag number is required");
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        //Check same bag number FIRST
        if (Number(user.bagNo) === Number(bagNo)) {
        return res
            .status(400)
            .send("Enter different Bag Number than your current bag Number");
        }

        //Check 10-day rule
        if (user.lastBagChangeAt) {
        const now = new Date();
        const diffInDays =
            (now.getTime() - user.lastBagChangeAt.getTime()) /
            (1000 * 60 * 60 * 24);

        if (diffInDays < 10) {
            return res
            .status(403)
            .send("Bag number can only be changed once in 10 days");
        }
        }

        //Update
        user.bagNo = bagNo;
        user.lastBagChangeAt = new Date();
        await user.save();

        return res.status(200).json({
        bagNo: user.bagNo,
        message: "Bag number updated successfully",
        });
    } catch (err) {
        return res.status(500).send("Internal server error: " + err.message);
    }
};



module.exports = {register,login,logout,adminRegister, deleteProfile, bagNoChange}