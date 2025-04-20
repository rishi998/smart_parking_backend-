import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
  },
  area: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  slotNumber: {
    type: String,
    required: true,
  },
  dateOfBooking: {
    type: Date,
    required: true,
  },
  timeOfBooking: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  accessToken: {
    type: String,
    unique: true,
  },
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
