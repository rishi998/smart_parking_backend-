// import { SendverificationCode, WelcomeEmail } from "../middlewares/Email.js";
// import usermodel from "../models/User.js";
// import adminmodel from "../models/Admin.js";
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken';
// import { authenticatetoken } from "../utilities.js";
// // const { authenticatetoken } =require("../utilities.js");
// const register=async (req,res)=>{
//   try{
//     const {email, password,name, phone}=req.body;

//     if(!email || !password || !name || !phone){
//       return res.status(400).json({success:false, message:"All fields are required"});
//     }
//     const userexists=await usermodel.findOne({email});
//     if(userexists){
//       return res.status(400).json({success:false, message:"User already exists"});
//     }
//       const hashedpassword=await bcrypt.hash(password,10);
//       const verificationCode =Math.floor(100000 + Math.random() * 900000).toString();
  
//       const user=new usermodel({
//         email,
//         password:hashedpassword,
//         name,
//         verificationCode,
//         phone,
//       })
//       await user.save();
//       return res.status(200).json({ success: true, message: "User registered"});

//   }catch(err){
//     console.log("an error occured",err);
//     return res.status(500).json({success:false, message:"Internsal server error"});
//   }
// }

// const login = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }
//     const user = await usermodel.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ success: false, message: "User not registered" });
//     }
//     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
//     user.verificationCode = verificationCode;
//     await user.save();

//     SendverificationCode(user.email, verificationCode);
    
//     return res.status(200).json({ success: true, message: "OTP sent to your email" });

//   } catch (err) {
//     console.log("An error occurred", err);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// }

// const verifyotp=async (req,res)=>{
//   try {
//     const { code } = req.body;
//     if (!code) {
//       return res.status(400).json({ success: false, message: "OTP must be provided" });
//     }
//     const user=await usermodel.findOne({verificationCode:code})
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid OTP" });
//     }

//     user.verificationCode = null;
//     user.isverified=true;
//     await user.save();
//     await WelcomeEmail(user.email, user.name); 
//     const accessToken = jwt.sign(
//       { userid: user._id },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: '7h' }
//     );

//     user.accesstoken=accessToken;
//     await user.save();
//     const userResponse = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       isVerified: user.isVerified
//   };
//     return res.status(200).json({ success: true, message: "Login successful", accessToken ,user:userResponse});

//   } catch (err) {
//     console.log("An error occurred", err);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// }

// const logout = async (req,res)=>{
//   localStorage.removeItem('accesstoken');
// }

// // we are not using this right now.
// const verifyemail=async(req,res)=>{
//   try{
//     const {code}=req.body;
//     const user=await usermodel.findOne({verificationCode:code})
//     if(!user){
//       return res.status(400).json({success:false,message:"Invalid Or Expired Code"})
//     }
//     user.verificationCode=undefined;
//     await user.save();
//     res.status(200).json({success:false,message:"Email verified Successfully"});

//   }catch(err){
//     return res.status(500).json({success:false, message:err.message});
//   }
// }
// const getAllUsers = async (req, res) => {
//   try {
//     // Fetch all users from the database
//     const users = await usermodel.find({}, { password: 0, verificationCode: 0 });
    
//     // Format the response data
//     const formattedUsers = users.map((user, index) => ({
//       id: index + 1,
//       _id: user._id,
//       name: user.name || 'N/A',
//       email: user.email,
//       phone: user.phone || 'N/A',
//       isVerified: user.isverified || false,
//       verificationCode: user.verificationCode || 'N/A',
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt
//     }));

//     return res.status(200).json({ 
//       success: true, 
//       count: formattedUsers.length,
//       users: formattedUsers 
//     });

//   } catch (err) {
//     console.error("Error fetching users:", err);
//     return res.status(500).json({ 
//       success: false, 
//       message: "Internal server error",
//       error: err.message 
//     });
//   }
// }

// export {register,verifyemail,login,verifyotp,getAllUsers};

import { SendverificationCode, WelcomeEmail } from "../middlewares/Email.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticatetoken } from "../utilities.js";
import sequelize from "sequelize";
import db from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

const register = async (req, res) => {
  try {
    // Get the User model and Sequelize instance correctly
    const User = db.models.user; // Changed from db.models.admin to ensure proper case
    const sequelize = db.sequelize; // Access sequelize instance from your db object

    const { email, password, name, phone } = req.body;

    // Validate input
    if (!email || !password || !name || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required",
        requiredFields: ["email", "password", "name", "phone"]
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Validate phone number (basic check)
    if (phone.toString().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be at least 10 digits"
      });
    }

    // Check if user exists using case-insensitive comparison
    const userExists = await User.findOne({ 
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')),
        sequelize.fn('LOWER', email)
      )
    });
    
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }

    // Start transaction for atomic operations
    const transaction = await sequelize.transaction(); // Now using the correct sequelize instance

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Create user within transaction
      const user = await User.create({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name.trim(),
        phone: phone.toString().trim(),
        verificationCode,
        isverified: false,
        accesstoken: uuidv4()
      }, { transaction });

      // Commit transaction if everything succeeds
      await transaction.commit();

      return res.status(201).json({ 
        success: true, 
        message: "User registered successfully. Verification code sent.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });

    } catch (err) {
      // Rollback transaction if any error occurs
      if (transaction) await transaction.rollback();
      throw err;
    }

  } catch (err) {
    console.error("Registration error:", err);
    
    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
      const errorDetails = err.errors.map(e => ({
        field: e.path,
        message: e.message,
        type: e.type
      }));
      
      return res.status(400).json({ 
        success: false, 
        message: "Validation failed",
        errors: errorDetails
      });
    }
    
    // Handle unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: "Email or phone number already exists"
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: "Registration failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const User=db.models.user;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not registered" });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await user.update({ verificationCode });

    await SendverificationCode(user.email, verificationCode);
    
    return res.status(200).json({ 
      success: true, 
      message: "OTP sent to your email",
      email: user.email 
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const verifyotp = async (req, res) => {
  try {
    const { code } = req.body;
    const User = db.models.user;
    if (!code) {
      return res.status(400).json({ success: false, message: "OTP and email must be provided" });
    }

    const user = await User.findOne({ 
      where: { 
        verificationCode: code 
      } 
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '7h' }
    );

    await user.update({ 
      verificationCode: null,
      isverified: true,
      accesstoken: accessToken
    });

    await WelcomeEmail(user.email, user.name);

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      isVerified: user.isverified,
      phone: user.phone
    };

    return res.status(200).json({ 
      success: true, 
      message: "Login successful", 
      accessToken,
      user: userResponse
    });

  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const logout = async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    return res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const verifyemail = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findOne({ where: { verificationCode: code } });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired code" });
    }

    await user.update({ verificationCode: null });
    return res.status(200).json({ success: true, message: "Email verified successfully" });

  } catch (err) {
    console.error("Email verification error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

const getAllUsers = async (req, res) => {
  try {
    // Fetch all users excluding sensitive data
    const User = db.models.user;
    const users = await User.findAll({
      attributes: { 
        exclude: ['password', 'verificationCode', 'accesstoken'] 
      },
      order: [['createdAt', 'DESC']]
    });

    // Format response
    const formattedUsers = users.map((user, index) => {
      // Clean phone number by removing $ prefix if present
      const userData = user.get ? user.get({ plain: true }) : user;

      let phone = userData.phone || 'N/A';
      if (typeof phone === 'string' && phone.startsWith('$')) {
        phone = phone.substring(1);
      }

      return {
        id: index + 1,
        _id: userData.id,
        name: userData.name || 'N/A',
        email: userData.email,
        phone: phone,
        isVerified: Boolean(userData.isverified),
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      };
    });

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
};

export { register, verifyemail, login, verifyotp, getAllUsers, logout };