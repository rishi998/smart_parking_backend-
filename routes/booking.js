import express from "express";
import Booking from "../models/bookingModel.js"; // Adjust path if needed
const router = express.Router();

router.post("/book", async (req, res) => {
  try {
    const {
      username,
      area,
      level,
      slotNumber,
      dateOfBooking,
      timeOfBooking,
      accessToken,
    } = req.body;

    const booking = new Booking({
      username,
      area,
      level,
      slotNumber,
      dateOfBooking,
      timeOfBooking,
      accessToken,
    });

    const savedBooking = await booking.save();
    res.status(201).json({ success: true, booking: savedBooking });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const bookings = await Booking.find({ username });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.delete("/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, message: "Booking deleted successfully", booking: deletedBooking });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get('/bookings/:username', async (req, res) => {
  try {
    // Fetch bookings where the username matches the parameter
    const bookings = await Booking.find({ username: req.params.username });
    
    // Respond with the bookings data
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

export default router;
