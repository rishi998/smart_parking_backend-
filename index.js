import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import dbcon from './libs/db.js';
import Authroutes from './routes/Auth.routes.js';
import usermodel from './models/User.js'; // Note: Ensure this import is actually needed here

// Configure dotenv as early as possible
dotenv.config();

// Initialize the Express application
const app = express();

// Apply middleware // Enable CORS for all domains
app.use(express.json()); // Parse JSON bodies
app.use(cors());

// Connect to database
dbcon();

// Use routes
app.use('/auth', Authroutes);

// Set the port 
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
