// import mongoose from "mongoose";
// const areaSchema = new mongoose.Schema({
//   areaName: { type: String, required: true },
//   address: { type: String, required: true },
//   levels: { type: Number, required: true, min: 1, max: 10 },
//   slotsPerLevel: {
//     type: [Number],
//     validate: {
//       validator: function(arr) {
//         return arr.length === this.levels;
//       },
//       message: "Slots array length must match number of levels"
//     }
//   }
// }, {
//   timestamps: true
// });

// const Area = mongoose.model('Area', areaSchema);
// export default Area;

import { DataTypes } from "sequelize";

export default function(sequelize) {
  const Area = sequelize.define("Area", {
    areaName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Area name cannot be empty"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Address cannot be empty"
        }
      }
    },
    levels: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: "Must have at least 1 level"
        },
        max: {
          args: [10],
          msg: "Cannot have more than 10 levels"
        },
        isInt: {
          msg: "Levels must be an integer"
        }
      }
    },
    slotsPerLevel: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('slotsPerLevel');
        if (!rawValue) return [];
        
        try {
          // Handle cases where the value might already be an array
          if (typeof rawValue === 'string') {
            // Trim whitespace and remove any extra characters
            const trimmedValue = rawValue.trim();
            // Ensure it's valid JSON by checking first/last characters
            if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
              return JSON.parse(trimmedValue);
            }
            // Handle legacy format if needed
            return [parseInt(trimmedValue) || 0];
          }
          return rawValue;
        } catch (e) {
          console.error('Failed to parse slotsPerLevel:', e);
          console.error('Problematic value:', rawValue);
          return [];
        }
      },
      set(value) {
        // Convert string numbers to actual numbers
        const processedValue = Array.isArray(value) 
          ? value.map(item => Number(item))
          : [Number(value) || 0];
        
        this.setDataValue('slotsPerLevel', JSON.stringify(processedValue));
      },
      validate: {
        isValidSlotArray(value) {
          let slotsArray;
          
          if (typeof value === 'string') {
            try {
              slotsArray = JSON.parse(value);
            } catch (e) {
              throw new Error('Invalid JSON format for slotsPerLevel');
            }
          } else {
            slotsArray = value;
          }

          if (!Array.isArray(slotsArray)) {
            throw new Error("slotsPerLevel must be an array");
          }

          slotsArray.forEach((slot, index) => {
            if (typeof slot !== 'number' || isNaN(slot)) {
              throw new Error(`Slot at index ${index} must be a number`);
            }
          });
        }
      }
    }
  }, {
    timestamps: true,
    hooks: {
      beforeValidate: (area) => {
        // Ensure slotsPerLevel is properly formatted before validation
        if (area.slotsPerLevel) {
          try {
            const parsed = typeof area.slotsPerLevel === 'string' 
              ? JSON.parse(area.slotsPerLevel)
              : area.slotsPerLevel;
            
            if (Array.isArray(parsed)) {
              area.slotsPerLevel = parsed.map(item => Number(item));
            }
          } catch (e) {
            console.error('Error processing slotsPerLevel:', e);
          }
        }
      }
    }
  });

  return Area;
}