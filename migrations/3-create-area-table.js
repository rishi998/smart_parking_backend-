// migrations/[timestamp]-create-area-table.js
import { Sequelize } from 'sequelize';

export default {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Areas', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      areaName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      levels: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 10
        }
      },
      slotsPerLevel: {
        type: DataTypes.JSON,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Note: Model validations (like array length checks) are handled at application level,
    // not in the database schema
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Areas');
  }
};