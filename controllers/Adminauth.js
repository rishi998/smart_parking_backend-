// import { SendverificationCode, WelcomeEmail } from "../middlewares/Email.js";
// import adminmodel from "../models/Admin.js";
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken';
// import { authenticatetoken } from "../utilities.js";
// import { v4 as uuidv4 } from 'uuid';
// const register=async (req,res)=>{
//   try{
//     const {name,email, password, accesstoken}=req.body;
//     if(!email || !password || !name){
//       return res.status(400).json({success:false, message:"All fields are required"});
//     }
//     const adminexists=await adminmodel.findOne({email});
//     if(adminexists){
//       return res.status(400).json({success:false, message:"admin already exists"});
//     }
//       const hashedpassword=await bcrypt.hash(password,10);

//       const admin=new adminmodel({
//         email,
//         password:hashedpassword,
//         name,
//         accesstoken:uuidv4(),
//       })


//       await admin.save();
//       return res.status(200).json({ success: true, message: "admin registered"});

//   }catch(err){
//     console.log("an error occured",err);
//     return res.status(500).json({success:false, message:"Internal server error"});
//   }
// }

// const login = async (req, res) => {
//   try {
//     console.log("Received body:", req.body);  // Log received data
//     const { email,password } = req.body;
//     if (!email) {
//       console.log("Email is missing!");  // Debug log
//       return res.status(400).json({ success: false, message: "Email is required" });
//     }
//     if(!password){
//       console.log("Password is missing!");  // Debug log
//       return res.status(400).json({ success: false, message: "Password is mandatory" });
//     }
//     console.log("Looking up admin with email:", email);  // Debug log
//     const admin = await adminmodel.findOne({ email });
//     console.log("Admin lookup result:", admin);  // Log lookup result
//     if (!admin) {
//       console.log("No admin found with that email");  // Debug log
//       return res.status(400).json({ success: false, message: "Admin not registered" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) {
//       console.log("Invalid password");
//       return res.status(401).json({ success: false, message: "Invalid email or password" });
//     }
//     return res.status(200).json({ success: true, message: "Login successful", admin });

//   } catch (err) {
//     console.error("An error occurred in login function:", err);  // Improved error log
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// }

// const logout = async (req,res)=>{
//   localStorage.removeItem('accesstoken');
//   localStorage.removeItem('admin');
// }

// export {register,login};

import { SendverificationCode, WelcomeEmail } from "../middlewares/Email.js";
// import Admin from "../models/Admin.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticatetoken } from "../utilities.js";
import { v4 as uuidv4 } from 'uuid';
import db from "../models/index.js";

const Admin = db.models.admin;
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if admin exists
    const adminExists = await Admin.findOne({ where: { email } });
    if (adminExists) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = await Admin.create({
      email,
      password,
      name,
      accesstoken: uuidv4()
    });

    return res.status(201).json({ 
      success: true, 
      message: "Admin registered successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        accesstoken: admin.accesstoken
      }
    });

  } catch (err) {
    console.error("Registration error:", err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: "Validation error",
        errors: err.errors.map(e => e.message) 
      });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    // Find admin
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );

    // Omit password from response
    const adminData = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      accesstoken: admin.accesstoken,
      isverified: admin.isverified
    };

    return res.status(200).json({ 
      success: true, 
      message: "Login successful",
      token,
      admin: adminData
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const logout = async (req, res) => {
  try {
    // In a real app, you would invalidate the token here
    return res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export { register, login, logout };