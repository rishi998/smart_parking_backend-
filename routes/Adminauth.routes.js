import express from "express";
import {register,login} from '../controllers/Adminauth.js'
const Adminauthroutes =express.Router()

Adminauthroutes.post("/register",register)
// Adminauthroutes.post("/verifyemail",verifyemail);
Adminauthroutes.post("/login",login);
// Adminauthroutes.post("/verifyotp",verifyotp);
export default Adminauthroutes;


