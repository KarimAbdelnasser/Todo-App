const express = require("express");
const users = require("../routes/users");
const notes = require("../routes/notes");

module.exports = (app) => {
    app.use(express.json());
    app.use("/", users);
    app.use("/home", notes);
};
