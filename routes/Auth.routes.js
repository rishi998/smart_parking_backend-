import express from "express";
import {register, verifyemail,login,verifyotp,getAllUsers} from '../controllers/Auth.js'
const Authroutes =express.Router()

Authroutes.post("/register",register)
Authroutes.post("/verifyemail",verifyemail);
Authroutes.post("/login",login);
Authroutes.post("/verifyotp",verifyotp);
Authroutes.get("/getallusers",getAllUsers);
export default Authroutes;


