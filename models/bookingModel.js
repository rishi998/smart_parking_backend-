// import { DataTypes } from "sequelize";

// export default function(sequelize) {
//   const Booking = sequelize.define("Booking", {
//     id: {
//       type: DataTypes.STRING,
//       primaryKey: true,
//       allowNull: false
//     },
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     area: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     address: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     level: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     slotNumber: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     dateOfBooking: {
//       type: DataTypes.DATEONLY,
//       allowNull: false
//     },
//     timeOfBooking: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     isVerified: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false
//     },
//     verificationCode: {
//       type: DataTypes.STRING
//     },
//     accessToken: {
//       type: DataTypes.STRING,
//       unique: true
//     }
//   }, {
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//     hooks: {
//       beforeValidate: async (booking) => {
//         if (!booking.id) {
//           booking.id = generateCustomId();
//         }
//       }
//     }
//   });
//   return Booking;
// }

// function generateCustomId() {
//   return Math.random().toString(36).substring(2, 15) +
//          Math.random().toString(36).substring(2, 15);
// }

// import { DataTypes } from "sequelize";

// export default function (sequelize) {
//   const Booking = sequelize.define(
//     "Booking",
//     {
//       id: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//         allowNull: false,
//       },
//       username: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       area: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       address: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       level: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       slotNumber: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       dateOfBooking: {
//         type: DataTypes.DATEONLY,
//         allowNull: false,
//       },
//       timeOfBooking: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       isVerified: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//       },
//       verificationCode: {
//         type: DataTypes.STRING,
//       },
//       accessToken: {
//         type: DataTypes.STRING,
//         unique: true,
//       },
//       // Only payment-related field added
//       paymentStatus: {
//         type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
//         defaultValue: "pending",
//       },
//     },
//     {
//       timestamps: true,
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//       hooks: {
//         beforeValidate: async (booking) => {
//           if (!booking.id) {
//             booking.id = generateCustomId();
//           }
//         },
//       },
//     }
//   );
//   // After the model definition
//   Booking.associate = (models) => {
//     Booking.hasMany(models.Payment, {
//       foreignKey: 'booking_id',
//       as: 'payments'
//     });
//   };
//   return Booking;
// }

// function generateCustomId() {
//   return (
//     Math.random().toString(36).substring(2, 15) +
//     Math.random().toString(36).substring(2, 15)
//   );
// }

// models/payment.js
import { DataTypes } from "sequelize";

export default function(sequelize) {
  const Payment = sequelize.define("Payment", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15),
      allowNull:true
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0.01
      }
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD'
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.STRING,
      unique: true
    },
    paymentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    // Explicitly define foreign keys
    bookingId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'Bookings', // Make sure this matches the table name
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER, // Assuming User.id is INTEGER
      allowNull: true,
      references: {
        model: 'Users', // Make sure this matches the table name
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['transactionId'],
        unique: true
      },
      {
        fields: ['status']
      },
      // Add indexes for foreign keys
      {
        fields: ['bookingId']
      },
      {
        fields: ['userId']
      }
    ]
  });

  // Associations should be set up after all models are loaded
  // This function will be called when models are initialized
  Payment.associate = function(models) {
    Payment.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking',
      onDelete: 'CASCADE' // Optional: cascade delete if booking is deleted
    });
    
    Payment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE' // Optional: cascade delete if user is deleted
    });
  };

  return Payment;
}