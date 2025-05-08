// migrations/[timestamp]-create-admin-table.js
import { Sequelize } from 'sequelize';

export default {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Admins', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      accesstoken: {
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
    await queryInterface.addIndex('Admins', ['email'], { unique: true });
    await queryInterface.addIndex('Admins', ['accesstoken'], { unique: true });
  },

  async down(queryInterface) {
    // Remove indexes first (important for clean rollback)
    await queryInterface.removeIndex('Admins', ['email']);
    await queryInterface.removeIndex('Admins', ['accesstoken']);
    
    // Then drop the table
    await queryInterface.dropTable('Admins');
  }
};