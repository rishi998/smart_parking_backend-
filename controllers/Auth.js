import { SendverificationCode, WelcomeEmail } from "../middlewares/Email.js";
import usermodel from "../models/User.js";
import adminmodel from "../models/Admin.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { authenticatetoken } from "../utilities.js";
// const { authenticatetoken } =require("../utilities.js");
const register=async (req,res)=>{
  try{
    const {email, password,name, phone}=req.body;

    if(!email || !password || !name || !phone){
      return res.status(400).json({success:false, message:"All fields are required"});
    }
    const userexists=await usermodel.findOne({email});
    if(userexists){
      return res.status(400).json({success:false, message:"User already exists"});
    }
      const hashedpassword=await bcrypt.hash(password,10);
      const verificationCode =Math.floor(100000 + Math.random() * 900000).toString();
  
      const user=new usermodel({
        email,
        password:hashedpassword,
        name,
        verificationCode,
        phone,
      })
      await user.save();
      return res.status(200).json({ success: true, message: "User registered"});

  }catch(err){
    console.log("an error occured",err);
    return res.status(500).json({success:false, message:"Internsal server error"});
  }
}

const login = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not registered" });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    await user.save();

    SendverificationCode(user.email, verificationCode);
    
    return res.status(200).json({ success: true, message: "OTP sent to your email" });

  } catch (err) {
    console.log("An error occurred", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const verifyotp=async (req,res)=>{
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "OTP must be provided" });
    }
    const user=await usermodel.findOne({verificationCode:code})
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    user.verificationCode = null;
    user.isverified=true;
    await user.save();
    await WelcomeEmail(user.email, user.name); 
    const accessToken = jwt.sign(
      { userid: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '7h' }
    );

    user.accesstoken=accessToken;
    await user.save();
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified
  };
    return res.status(200).json({ success: true, message: "Login successful", accessToken ,user:userResponse});

  } catch (err) {
    console.log("An error occurred", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const logout = async (req,res)=>{
  localStorage.removeItem('accesstoken');
}

// we are not using this right now.
const verifyemail=async(req,res)=>{
  try{
    const {code}=req.body;
    const user=await usermodel.findOne({verificationCode:code})
    if(!user){
      return res.status(400).json({success:false,message:"Invalid Or Expired Code"})
    }
    user.verificationCode=undefined;
    await user.save();
    res.status(200).json({success:false,message:"Email verified Successfully"});

  }catch(err){
    return res.status(500).json({success:false, message:err.message});
  }
}
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await usermodel.find({}).select('-password -verificationCode -__v');
    
    // Format the response data
    const formattedUsers = users.map((user, index) => ({
      id: index + 1,
      _id: user._id,
      name: user.name || 'N/A',
      email: user.email,
      phone: user.phone || 'N/A',
      isVerified: user.isVerified || false,
      verificationCode: user.verificationCode || 'N/A',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    return res.status(200).json({ 
      success: true, 
      count: formattedUsers.length,
      users: formattedUsers 
    });

  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: err.message 
    });
  }
}

export {register,verifyemail,login,verifyotp,getAllUsers};