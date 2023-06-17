const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.use(express.json());
app.use(cookieParser());
app.use(cors());

require("./startup/routes")(app);

module.exports = app;
