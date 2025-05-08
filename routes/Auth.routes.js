// import express from "express";
// import {register, verifyemail,login,verifyotp,getAllUsers} from '../controllers/Auth.js'
// const Authroutes =express.Router()

// Authroutes.post("/register",register)
// Authroutes.post("/verifyemail",verifyemail);
// Authroutes.post("/login",login);
// Authroutes.post("/verifyotp",verifyotp);
// Authroutes.get("/getallusers",getAllUsers);
// export default Authroutes;


import express from "express";
import {
  register,
  verifyemail,
  login,
  verifyotp,
  getAllUsers
} from '../controllers/Auth.js';

const authRouter = express.Router();

// Authentication routes
authRouter.post("/register", register);
authRouter.post("/verifyemail", verifyemail);
authRouter.post("/login", login);
authRouter.post("/verifyotp", verifyotp);

// User management route (consider adding authentication middleware)
authRouter.get("/users", getAllUsers); // Changed endpoint to more RESTful convention

export default authRouter;