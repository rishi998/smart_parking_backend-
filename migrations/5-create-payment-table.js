// npx sequelize-cli db:migrate
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01
        }
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'USD',
        allowNull: false
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
        allowNull: false
      },
      gateway_response: {
        type: Sequelize.TEXT
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
    
    // Then drop the table
    await queryInterface.dropTable('Payments');
  }
};