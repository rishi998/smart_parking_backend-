// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log
  }
);

// Import model functions
import User from './User.js';
import Admin from './Admin.js';
import Area from './Areas.js';
import Booking from './bookingModel.js';
import Payment from './Payments.js'

// Initialize models
const user = User(sequelize);
const admin = Admin(sequelize);
const area = Area(sequelize);
const booking = Booking(sequelize);
const payment=Payment(sequelize);


const db = {
  sequelize,
  Sequelize,
  models: { // Add this models object
    user,
    admin,
    area,
    booking,
    payment

  }
};
// In your models/index.js or initialization file
// const Payment = require('./payment')(sequelize);
// const Booking = require('./booking')(sequelize);

// Set up associations
// Payment.belongsTo(Booking, { foreignKey: 'booking_id' });
// Booking.hasMany(Payment, { foreignKey: 'booking_id' });

export default db;