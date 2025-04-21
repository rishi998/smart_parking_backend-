// models/Area.js
import mongoose from "mongoose";
const areaSchema = new mongoose.Schema({
  areaName: { type: String, required: true },
  address: { type: String, required: true },
  levels: { type: Number, required: true, min: 1, max: 10 },
  slotsPerLevel: {
    type: [Number],
    validate: {
      validator: function(arr) {
        return arr.length === this.levels;
      },
      message: "Slots array length must match number of levels"
    }
  }
}, {
  timestamps: true
});

const Area = mongoose.model('Area', areaSchema);
export default Area;