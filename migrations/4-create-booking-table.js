// migrations/[timestamp]-create-booking-table.js
import { Sequelize } from 'sequelize';

export default {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Bookings', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      area: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slotNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dateOfBooking: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      timeOfBooking: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      verificationCode: {
        type: DataTypes.STRING
      },
      accessToken: {
        type: DataTypes.STRING,
        unique: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('Bookings', ['accessToken'], { unique: true });
    await queryInterface.addIndex('Bookings', ['dateOfBooking']);
    await queryInterface.addIndex('Bookings', ['area', 'level', 'slotNumber']);
  },

  async down(queryInterface) {
    // Remove indexes first
    await queryInterface.removeIndex('Bookings', ['accessToken']);
    await queryInterface.removeIndex('Bookings', ['dateOfBooking']);
    await queryInterface.removeIndex('Bookings', ['area', 'level', 'slotNumber']);
    
    // Then drop the table
    await queryInterface.dropTable('Bookings');
  }
};