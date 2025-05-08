// import dotenv from 'dotenv';
// import express from 'express';
// import cors from 'cors';
// import dbcon from './libs/db.js';
// import Authroutes from './routes/Auth.routes.js';
// import Adminauthroutes from './routes/Adminauth.routes.js'
// import bookingRoutes from "./routes/booking.js"; 
// import areaRoutes from './routes/Areaauth.js'
// dotenv.config();


// const app = express();

// app.use(express.json());
// app.use(cors());

// // Connect to database
// dbcon();

// // Use routes
// app.use('/auth', Authroutes);
// app.use('/adminauth', Adminauthroutes);
// app.use("/bookings", bookingRoutes);
// app.use("/area", areaRoutes);


// // Set the port 
// const PORT = process.env.PORT || 5000;

// // Start the server
// app.listen(PORT, () => {
//   console.log(`App is running on port ${PORT}`);
// });

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import db from './models/index.js'; // Import the db object that contains sequelize and models
import Authroutes from './routes/Auth.routes.js';
import Adminauthroutes from './routes/Adminauth.routes.js';
import bookingRoutes from "./routes/booking.js"; 
import areaRoutes from './routes/Areaauth.js';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const initializeDatabase = async () => {
  try {
    // Authenticate database connection
    await db.sequelize.authenticate();
    console.log('✅ MySQL connection established successfully.');
    
    // Sync all models with the database
    // In production, you should use migrations instead of force: false
    await db.sequelize.sync({ force: false }); // Set force: true to drop tables and recreate (only for development)
    console.log('🔄 Database synchronized');
    
    // Verify models are loaded
    console.log('📋 Loaded models:', Object.keys(db.sequelize.models));
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Initialize database connection
initializeDatabase();

// Routes
app.use('/auth', Authroutes);
app.use('/adminauth', Adminauthroutes);
app.use("/bookings", bookingRoutes);
app.use("/area", areaRoutes);

// Health check endpoint with DB verification
app.get('/health', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.status(200).json({ 
      status: 'OK', 
      database: 'MySQL',
      models: Object.keys(db.sequelize.models),
      connection: {
        host: db.sequelize.config.host,
        database: db.sequelize.config.database
      }
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'Service Unavailable', 
      database: 'Connection failed',
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error',
      details: err.errors.map(e => e.message) 
    });
  }
  
  // Handle unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ 
      error: 'Duplicate Entry',
      details: err.errors.map(e => e.message)
    });
  }
  
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
