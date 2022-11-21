const path = require("path");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.use(express.json());
app.use(cookieParser());
app.use(cors());

require("dotenv").config();
require("./startup/routes")(app);

mongoose
    .connect(`${process.env.MONGO_URL}`, {
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(`Connected to mongDb...`);
    });

module.exports = app;
