import { Verification_Email_Template, Welcome_Email_Template } from "../libs/Emailtemplate.js";
import {transporter} from "./Email.config.js";

export const SendverificationCode=async(email, verificationCode)=>{
  try{
    const response = await transporter.sendMail({
      from: '"Smart Parking " <shyamkumar62203@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Log-In", // Subject line
      text: "OTP", // plain text body
      html: Verification_Email_Template.replace("{verificationCode}",verificationCode), // html body
    });
    console.log("Email send Successfully",response);
  }catch(error){
    console.log("Email error :",error);
  }
}

export const WelcomeEmail=async(email, name)=>{
  try{
    const response = await transporter.sendMail({
      from: '"Smart Parking " <shyamkumar62203@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Welcome Email", // Subject line
      text: "Verify your email", // plain text body
      html: Welcome_Email_Template.replace("{name}",name), // html body
    });
    console.log("Email send Successfully",response);
  }catch(error){
    console.log("Email error :",error);
  }
}