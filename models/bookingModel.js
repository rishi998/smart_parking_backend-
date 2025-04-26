import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  _id: {
    type: String,  // Set type to String instead of ObjectId
    required: true
  },
  username: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  address: {
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
}, { 
  timestamps: true,
  // Disable automatic _id generation
  _id: false 
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
