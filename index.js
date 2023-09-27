// Requiring dependencies
require("dotenv").config(); // Load environment variables from a .env file
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 8080; // Port number in which our app will run

// Models
require("./models/posts"); // Require the 'Posts' model
require("./models/tag"); // Require the 'Tag' model

// Middleware for parsing requests
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Routes
app.use(require("./routes/posts")); // Use the routes defined in the 'posts' module

// Making connection with our database using mongoose library
mongoose.connect(process.env.MONGO_URI) // Connect to MongoDB using the provided URI
    .then(() => {
        console.log("Connected with the database"); // Log success if connected
    }).catch((error) => {
        console.error("Error while connecting with the database:", error.message); // Log error if connection fails
    });

// Start the server
app.listen(port, () => {
    console.log(`App is running on PORT: ${port}`);
});
