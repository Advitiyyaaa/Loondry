const mongoose = require('mongoose')
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 40,
        trim: true
    },
    lastName:{
        type: String,
        trim: true
    },
    phone:{
        type: Number,
        unique: true
    },
    bagNo:{
        type:Number,
        unique: true,
        required: function () {
            return this.role === "user";
        }
    },
    lastBagChangeAt:{
        type:Date,
        default: null
    },
    emailId:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        immutable: true,
        unique: true
    },
    role:{
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    password:{
        type: String,
        required: true
    }
},{timestamps:true})

userSchema.post("findOneAndDelete", async function (user) {
  if (!user) return;

  const Slip = mongoose.model("slip");
  const Complain = mongoose.model("complain");

  await Promise.all([
    Slip.deleteMany({ userId: user._id }),
    Complain.deleteMany({ userId: user._id }),
  ]);
});

const User = mongoose.model("user",userSchema)
module.exports = User;