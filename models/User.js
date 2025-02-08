import mongoose, { mongo } from "mongoose";

const userschema=mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true,
  },
  name:{
    type:String,
    required:true,
    unique:false,
  },
  password:{
    type:String,
    required:true,
  },
  phone:{
    type:Number,
    unique:false,
    required:true,
  },
  isverified:{
    type:Boolean,
    default:false,
  },
  verificationCode:String,
  accesstoken:{
    type:String,
    unique:true,
    // required:false;
  }
},{timestamp:true});

const usermodel=mongoose.model("user",userschema);
export default usermodel;