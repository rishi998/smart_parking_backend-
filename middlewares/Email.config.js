import nodemailer from 'nodemailer'
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "shyamkumar62203@gmail.com",
    pass: "hohm iqka cjaj gfmz",
  },
});


// const sendemail=async ()=>{
//   try{
//     const info = await transporter.sendMail({
//       from: '"Balle Balle Parking " <shyamkumar62203@gmail.com>', // sender address
//       to: "rahulkumarmahto378@gmail.com, mehtorishi62203@gmail.com", // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: "Hello world?", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     });
//     console.log(info)
//   }catch(err){
//     console.log(err);
//   }
// }

// sendemail();