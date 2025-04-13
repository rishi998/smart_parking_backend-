import { SendverificationCode, WelcomeEmail } from "../middlewares/Email.js";
import adminmodel from "../models/Admin.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { authenticatetoken } from "../utilities.js";
import { v4 as uuidv4 } from 'uuid';
const register=async (req,res)=>{
  try{
    const {name,email, password, accesstoken}=req.body;
    if(!email || !password || !name){
      return res.status(400).json({success:false, message:"All fields are required"});
    }
    const adminexists=await adminmodel.findOne({email});
    if(adminexists){
      return res.status(400).json({success:false, message:"admin already exists"});
    }
      const hashedpassword=await bcrypt.hash(password,10);

      const admin=new adminmodel({
        email,
        password:hashedpassword,
        name,
        accesstoken:uuidv4(),
      })


      await admin.save();
      return res.status(200).json({ success: true, message: "admin registered"});

  }catch(err){
    console.log("an error occured",err);
    return res.status(500).json({success:false, message:"Internal server error"});
  }
}

const login = async (req, res) => {
  try {
    console.log("Received body:", req.body);  // Log received data
    const { email,password } = req.body;
    if (!email) {
      console.log("Email is missing!");  // Debug log
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if(!password){
      console.log("Password is missing!");  // Debug log
      return res.status(400).json({ success: false, message: "Password is mandatory" });
    }
    console.log("Looking up admin with email:", email);  // Debug log
    const admin = await adminmodel.findOne({ email });
    console.log("Admin lookup result:", admin);  // Log lookup result
    if (!admin) {
      console.log("No admin found with that email");  // Debug log
      return res.status(400).json({ success: false, message: "Admin not registered" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    return res.status(200).json({ success: true, message: "Login successful", admin });

  } catch (err) {
    console.error("An error occurred in login function:", err);  // Improved error log
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const logout = async (req,res)=>{
  localStorage.removeItem('accesstoken');
  localStorage.removeItem('admin');
}

export {register,login};