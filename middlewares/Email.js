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


// ✅ NEW FUNCTION - Booking Confirmation Email
export const BookingConfirmationEmail = async (email, name, bookingDetails) => {
  try {
    const response = await transporter.sendMail({
      from: '"Smart Parking" <your_email@gmail.com>', // use your sender Gmail here
      to: email,
      subject: "Parking Slot Booking Confirmation",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for booking with us!</p>
        <p><b>Booking ID:</b> ${bookingDetails.bookingId}</p>
        <p><b>Slot:</b> ${bookingDetails.parkingSlot}</p>
        <p><b>Date:</b> ${new Date(bookingDetails.date).toLocaleDateString()}</p>
        <p><b>Time:</b> ${bookingDetails.time}</p>
        <p>We look forward to seeing you!</p>
      `,
    });
    console.log("Booking confirmation email sent successfully:", response);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
  }
};


