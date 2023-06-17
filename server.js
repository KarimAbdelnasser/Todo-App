const app = require("./app");
const http = require("http").Server(app);
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

mongoose
    .connect(process.env.MONGO_URL, {
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB...");
        // Start the server
        http.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
    });
