import express from "express";
import fs from "fs";
// https://backend-6ajq.onrender.com
import userRouter from "./router/userRoute.js";
import { signup, login } from "./controller/authController.js";
import questionRouter from "./router/questionRoute.js";
import mongoose from "mongoose";
import { config } from "dotenv";
import helmet from "helmet";
import morgan from "morgan"; // Import morgan
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean"
import cors from "cors"

// Load Environment Variables
config({ path: "./utilities/.env" });

// Database Connection
const DB = process.env.DATABASE;
// console.log(DB);

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("DB is connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
  });

// Initialize Express App
const app = express();

// Middleware
app.use(express.json({ limit: "10kb"}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against xss
app.use(xss());

app.use(cors());

// Morgan Middleware for logging HTTP requests
app.use(morgan('dev'));  // You can change 'dev' to other formats like 'combined', 'short', etc.

// Limit request from same API
const limiter = rateLimit({
    max: 100,  // Maximum number of requests allowed
    windowMs: 60 * 60 * 1000, // Time window for the limit (in milliseconds)
    message: "To many requests from this IP, please try again in an hour!" 
});
// Apply rate limiter middleware
app.use("/api", limiter);

// Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false,// Disable CSP if using inline scripts
}));

// app.js
app.use((err, req, res, next) => {
  if (err.message === "Not an image! Please upload only images") {
    return res.status(400).json({
      status: "fail",
      message: err.message
    });
  }

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// Define Routes
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/users", userRouter); // Mount user routes

// Start the Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`The app is listening on port ${port}...`);
});




export default app;
