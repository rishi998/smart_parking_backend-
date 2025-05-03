import express from "express";
import Booking from "../models/bookingModel.js"; // Adjust path if needed
import usermodel from "../models/User.js";
import { BookingConfirmationEmail } from "../middlewares/Email.js";
const router = express.Router();

router.post("/book", async (req, res) => {
  try {
    const {
      username,
      area,
      address,
      level,
      slotNumber,
      dateOfBooking,
      timeOfBooking,
      accessToken,
      areaId,
    } = req.body;

    // Create composite ID
    const bookingId = `${areaId}-${slotNumber.replace(" ", "-")}-${
      new Date(dateOfBooking).toISOString().split("T")[0]
    }`;

    const booking = new Booking({
      _id: bookingId, // Use our custom ID
      username,
      area,
      address,
      level,
      slotNumber,
      dateOfBooking,
      timeOfBooking,
      accessToken,
      areaId, // Store area reference
    });

    const savedBooking = await booking.save();
    // ✅ Fetch user's email from database
    const user = await usermodel.findOne({ username: username });
    if (user && user.email) {
      console.log("Sending booking confirmation email to:", user.email); // 👈 Add this line
      await BookingConfirmationEmail(user.email, username, {
        bookingId: bookingId,
        parkingSlot: slotNumber,
        date: dateOfBooking,
        time: timeOfBooking,
      });
    } else {
      console.log(`User with username ${username} not found or email missing.`);
    }

    res.status(201).json({ success: true, booking: savedBooking });
  } catch (error) {
    console.error("Booking Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This spot is already booked for the selected date",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
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
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
      booking: deletedBooking,
    });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/bookings/:username", async (req, res) => {
  try {
    // Fetch bookings where the username matches the parameter
    const bookings = await Booking.find({ username: req.params.username });

    // Respond with the bookings data
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Get all bookings
router.get("/bookings/all", async (req, res) => {
  try {
    console.log("Attempting to fetch bookings...");
    const bookings = await Booking.find({}, { area: 0 });

    console.log("Found bookings:", bookings); // Log raw data

    if (!bookings || bookings.length === 0) {
      console.log("No bookings found in database");
      return res.json({
        success: true,
        message: "No bookings found",
        bookings: [],
      });
    }

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});
router.get("/booked-slots/:areaId/:level", async (req, res) => {
  try {
    const { areaId, level } = req.params;

    // Find all bookings for this area and level
    const bookings = await Booking.find({
      areaId: areaId,
      level: level,
      dateOfBooking: { $gte: new Date() },
    });
    console.log(bookings);

    // Extract just the slot numbers
    const bookedSlots = bookings.map((booking) => booking.slotNumber);

    res.status(200).json({
      success: true,
      bookedSlots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching booked slots",
    });
  }
});

export default router;
