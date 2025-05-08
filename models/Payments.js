// models/payment.js
import { DataTypes } from "sequelize";

export default function(sequelize) {
  const Payment = sequelize.define("Payment", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15),
      allowNull: false // Primary key should never be null
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
      allowNull: true, // Made nullable
      defaultValue: null // Changed from 'USD'
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      allowNull: true, // Made nullable
      defaultValue: 'pending' // Changed from 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null // Changed from DataTypes.NOW
    },
    bookingId: {
      type: DataTypes.STRING,
      allowNull: true // Made nullable
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true // Made nullable
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
      }
    ]
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking',
      constraints: false // This allows the association to exist even when foreign key is null
    });
    Payment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      constraints: false // This allows the association to exist even when foreign key is null
    });
  };
  return Payment;
}