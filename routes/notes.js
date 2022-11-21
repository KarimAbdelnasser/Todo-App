const express = require("express");
const router = express.Router();
const { Note } = require("../models/note");
const { OTP } = require("../models/OTP");
const auth = require("../middleware/auth");
require("dotenv").config();

router.get("/", auth, async (req, res) => {
    res.render("home.hbs");
});

//get all note to the client side to show them
router.get("/toDo", auth, async (req, res) => {
    const user = req.user._id;
    const note = await Note.find({ userId: user });
    res.send(note);
});

//add a new note
router.post("/addNote", auth, async (req, res) => {
    const userId = req.user._id;
    let myNote = {
        userId,
        name: req.body.name,
    };
    let newNote = new Note(myNote);
    await newNote.save();
    console.log("new note saved!");
});

//update note's status
router.post("/updateNote", auth, async (req, res) => {
    const userId = req.user._id;
    const editedNote = await Note.findOneAndUpdate(
        { userId, name: req.body.name },
        { status: req.body.status },
        {
            new: true,
        }
    );
    await editedNote.save();
    console.log("this note has been updated successfully!!");
});

//edit a note
router.post("/editNote", auth, async (req, res) => {
    const userId = req.user._id;
    const allNotes = await Note.find({ userId });
    let noteName = allNotes[req.body.order];
    const editedNote = await Note.findOneAndUpdate(
        { userId, name: noteName.name },
        { name: req.body.newName },
        {
            new: true,
        }
    );
    await editedNote.save();
    console.log("this note has been updated successfully!!");
});

//delete a note
router.post("/deleteNote", auth, async (req, res) => {
    const userId = req.user._id;
    await Note.deleteOne({ userId, name: req.body.name });
    console.log("this note has been removed successfully!!");
});

//clear all notes
router.post("/clear", auth, async (req, res) => {
    const user = req.user._id;
    await Note.deleteMany({ userId: user });
    console.log("notes have been removed successfully!");
});

module.exports = router;
