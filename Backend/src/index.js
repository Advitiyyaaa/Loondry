const express = require('express')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const RedisClient = require('./config/redis')
const authRouter = require('./routes/userAuth')
const slipRouter = require('./routes/slipRoute')
const complainRouter = require('./routes/complainRoute')
require('dotenv').config()
require("./jobs/slipCleanup");

const cors = require('cors')

const app = express()
app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      origin === "http://localhost:5173" ||
      origin === "https://loondry.vercel.app" ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.options("*", cors());


app.use(express.json())
app.use(cookieParser())

app.use('/user',authRouter)
app.use('/slip',slipRouter)
app.use('/complain',complainRouter)

const initializeConnection = async(req,res)=>{
    try{
        await Promise.all([connectDB(),RedisClient.connect()])
        console.log("Connected to DB")
        app.listen(process.env.PORT,()=>{
            console.log(`Listening at http://localhost:${process.env.PORT}`)
        })
    }
    catch(err){
        console.error("Server startup failed:", err);
        process.exit(1); 
    }
}

initializeConnection()



