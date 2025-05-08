// import express from "express";
// import Area from '../models/Areas.js' // Adjust path as needed
// import jwt from "jsonwebtoken";
// import Booking from "../models/bookingModel.js";

// const router = express.Router();

// router.post("/addarea", async (req, res) => {
//   try {
//     const { areaName, address, levels, slotsPerLevel } = req.body;

//     if (!areaName || !address || !levels || !slotsPerLevel) {
//       return res.status(400).json({ success: false, message: "Missing fields" });
//     }

//     if (slotsPerLevel.length !== levels) {
//       return res.status(400).json({ success: false, message: "Slots per level mismatch" });
//     }

//     const newArea = new Area({
//       areaName,
//       address,
//       levels,
//       slotsPerLevel,
//     });

//     const savedArea = await newArea.save();
//     res.status(201).json({ success: true, area: savedArea });
//   } catch (error) {
//     console.error("Area Save Error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });
// // Delete area by ID
// router.delete("/deletearea/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedArea = await Area.findByIdAndDelete(id);

//     if (!deletedArea) {
//       return res.status(404).json({ success: false, message: "Area not found" });
//     }

//     res.status(200).json({ success: true, message: "Area deleted successfully" });
//   } catch (error) {
//     console.error("Delete Error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });
// // Update an existing area
// router.put("/updatearea/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { areaName, address, levels, slotsPerLevel } = req.body;

//     if (!areaName || !address || !levels || !slotsPerLevel) {
//       return res.status(400).json({ success: false, message: "Missing fields" });
//     }

//     if (slotsPerLevel.length !== levels) {
//       return res.status(400).json({ success: false, message: "Slots per level mismatch" });
//     }

//     const updatedArea = await Area.findByIdAndUpdate(
//       id,
//       { areaName, address, levels, slotsPerLevel },
//       { new: true }
//     );

//     if (!updatedArea) {
//       return res.status(404).json({ success: false, message: "Area not found" });
//     }

//     res.status(200).json({ success: true, area: updatedArea });
//   } catch (error) {
//     console.error("Update Error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// // Get all areas
// router.get("/allareas", async (req, res) => {
//   try {
//     const areas = await Area.find();
//     res.status(200).json({ success: true, areas });
//   } catch (error) {
//     console.error("Fetch All Error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });


// router.get("/availability/:areaName", async (req, res) => {
//   try {
//     const { areaName } = req.params;

//     // 1. Find the area by name
//     const area = await Area.findOne({ areaName });
//     if (!area) {
//       return res.status(404).json({ success: false, message: "Area not found" });
//     }

//     // 2. Count bookings with matching area name
//     const bookedSlots = await Booking.countDocuments({ 
//       area:area.areaName,
//     });

//     // 3. Calculate slots
//     const totalSlots = area.slotsPerLevel.reduce((sum, slots) => sum + slots, 0);
//     const availableSlots = totalSlots - bookedSlots;

//     res.status(200).json({
//       success: true,
//       data: {
//         areaName: area.areaName,
//         totalSlots,
//         bookedSlots,
//         availableSlots
//       }
//     });

//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });


// export default router;

import express from "express";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
const Area  = db.models.area; 
const router = express.Router();

// Add new area
router.post("/addarea", async (req, res) => {
  try {
    const { areaName, address, levels, slotsPerLevel } = req.body;

    if (!areaName || !address || !levels || !slotsPerLevel) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (slotsPerLevel.length !== levels) {
      return res.status(400).json({ success: false, message: "Slots per level mismatch" });
    }
    const levelCount = parseInt(levels);
    if (isNaN(levelCount) || levelCount < 1) {
      return res.status(400).json({ 
        success: false, 
        message: "Levels must be a positive number" 
      });
    }
    if (!Array.isArray(slotsPerLevel)) {
      return res.status(400).json({ 
        success: false, 
        message: "slotsPerLevel must be an array" 
      });
    }

    const newArea = await Area.create({
      areaName,
      address,
      levels,
      slotsPerLevel,
    });

    res.status(201).json({ success: true, area: newArea });
  } catch (error) {
    console.error("Area Save Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Delete area by ID
router.delete("/deletearea/:id", async (req, res) => {
  try {
    // Ensure ID is properly parsed as a number
    const areaId = parseInt(req.params.id);
    
    if (isNaN(areaId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid area ID format" 
      });
    }

    // Delete using the properly parsed number
    const deletedCount = await Area.destroy({
      where: { id: areaId}
    });

    if (deletedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Area not found" 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Area deleted successfully" 
    });

  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to delete area",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
// Update an existing area
router.put("/updatearea/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { areaName, address, levels, slotsPerLevel } = req.body;

    if (!areaName || !address || !levels || !slotsPerLevel) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (slotsPerLevel.length !== levels) {
      return res.status(400).json({ success: false, message: "Slots per level mismatch" });
    }

    const [updatedRows] = await Area.update(
      { areaName, address, levels, slotsPerLevel },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ success: false, message: "Area not found" });
    }

    const updatedArea = await Area.findByPk(id);
    res.status(200).json({ success: true, area: updatedArea });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Get all areas
router.get("/allareas", async (req, res) => {
  try {
    const areas = await Area.findAll();
    res.status(200).json({ success: true, areas });
  } catch (error) {
    console.error("Fetch All Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Get area availability
router.get("/availability/:areaName", async (req, res) => {
  try {
    const areaName  = req.params.areaName;

    // 1. Find the area by name
    const area = await db.models.area.findOne({
      where: { areaName},
      attributes: ['id', 'areaName', 'address', 'levels', 'slotsPerLevel']
    });
    
    
    if (!area) {
      return res.status(404).json({ success: false, message: "Area not found" });
    }

    // 2. Count bookings with matching area name
    const bookedSlots = await db.models.booking.count({ 
      where: { 
        area: area.areaName 
      } 
    });

    // 3. Calculate slots
    const totalSlots = area.slotsPerLevel.reduce((sum, slots) => sum + slots, 0);
    const availableSlots = totalSlots - bookedSlots;

    res.status(200).json({
      success: true,
      data: {
        areaName: area.areaName,
        totalSlots,
        bookedSlots,
        availableSlots
      }
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;