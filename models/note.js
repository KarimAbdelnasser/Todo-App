const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId },
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "pending",
        },
    },
    { timestamps: true }
);
const Note = mongoose.model("Note", noteSchema);

module.exports = {
    Note,
};
