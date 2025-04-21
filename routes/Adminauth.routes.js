import express from "express";
import {register,login} from '../controllers/Adminauth.js'
const Adminauthroutes =express.Router()

Adminauthroutes.post("/register",register)
Adminauthroutes.post("/login",login);
export default Adminauthroutes;


