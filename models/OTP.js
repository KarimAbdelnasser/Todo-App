const mongoose = require("mongoose");

const Joi = require("joi");

const otpSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    digits: {
        type: String,
        required: true,
        minlength: 4,
    },
    // createdAt: { type: Date, expires: 2 },
    expireAt: {
        type: Date,
        default: new Date(),
        expires: 50,
    },
});
const OTP = mongoose.model("OTP", otpSchema);
function validateOTP(otp) {
    const schema = {
        digits: Joi.number().min(4).max(5).required(),
    };
    return Joi.validate(otp, schema);
}

module.exports = {
    OTP,
    validate: validateOTP,
};
