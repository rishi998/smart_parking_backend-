// import mongoose from "mongoose";

// const dbcon=async()=>{
//   try{
//     mongoose.connect(process.env.MONGODB_URI);
//     console.log("mongodb connected");
//   }catch(err){
//     console.log("an error occured:",err)
//   }
// }
// export default dbcon;


import { Sequelize } from 'sequelize';
import config from '../config/config.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create connection
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  }
);

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();

// Export as both default and named
export default sequelize;
export { sequelize };