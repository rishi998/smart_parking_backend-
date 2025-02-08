import mongoose from "mongoose";

const dbcon=async()=>{
  try{
    mongoose.connect(process.env.MONGODB_URI);
    console.log("mongodb connected");
  }catch(err){
    console.log("an error occured:",err)
  }
}

export default dbcon;