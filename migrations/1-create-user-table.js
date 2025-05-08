// npx sequelize-cli db:migrate
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [6, 100]
        }
      },
      phone: {
        type: Sequelize.BIGINT,
        allowNull: false,
        validate: {
          isNumeric: true
        }
      },
      isverified: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      verificationCode: {
        type: Sequelize.STRING
      },
      accesstoken: {
        type: Sequelize.STRING,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('Users', ['email'], { unique: true });
    await queryInterface.addIndex('Users', ['accesstoken'], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first
    await queryInterface.removeIndex('Users', ['email']);
    await queryInterface.removeIndex('Users', ['accesstoken']);
    
    // Then drop the table
    await queryInterface.dropTable('Users');
  }
};