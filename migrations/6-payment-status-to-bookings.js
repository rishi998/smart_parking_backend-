// migrations/6-add-payment-status-to-bookings.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Bookings', 'paymentStatus', {
      type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Bookings', 'paymentStatus');
    // For PostgreSQL you might need to first drop the enum type:
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Bookings_paymentStatus"');
  }
};