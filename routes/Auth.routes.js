import express from "express";
import {register, verifyemail,login,verifyotp} from '../controllers/Auth.js'
const Authroutes =express.Router()

Authroutes.post("/register",register)
Authroutes.post("/verifyemail",verifyemail);
Authroutes.post("/login",login);
Authroutes.post("/verifyotp",verifyotp);
export default Authroutes;


