import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import dbcon from './libs/db.js';
import Authroutes from './routes/Auth.routes.js';
import Adminauthroutes from './routes/Adminauth.routes.js'
import bookingRoutes from "./routes/booking.js"; 
dotenv.config();


const app = express();


app.use(express.json());
app.use(cors());

// Connect to database
dbcon();

// Use routes
app.use('/auth', Authroutes);
app.use('/adminauth', Adminauthroutes);
app.use("/bookings", bookingRoutes);

// Set the port 
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
