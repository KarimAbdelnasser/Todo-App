const express = require("express");
const router = express.Router();
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { OTP } = require("../models/OTP");
const auth = require("../middleware/auth");
const sendEmail = require("../startup/mailSender");
require("dotenv").config();

//Redirect any request to the register page
router.get("/", (req, res) => {
    res.redirect("/register");
});

//Register
router.get("/register", (req, res) => {
    res.render("signup.hbs");
});
router.post("/register", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.render("signup.hbs", {
                error: "User already registered.",
            });
        user = new User({
            userName: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save(function (err) {
            if (err) {
                return res.status(500).send({ msg: err.message });
            }
        });
        const token = user.generateAuthToken();
        const otp = otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        const newPass = new OTP({
            digits: otp,
            userId: user._id,
        });
        await newPass.save(function (err) {
            if (err) {
                return res.status(500).send({ msg: err.message });
            }
        });
        await sendEmail(req.body.email, otp);
        res.cookie("authToken", token, { maxAge: 1 * 60 * 60 * 1000 }).render(
            "signup.hbs",
            {
                valid: "Verification code sent",
                token: token,
            }
        ); //redirect to verification page
    } catch (e) {
        res.render("signup.hbs", { error: e });
    }
});

//Log In
router.get("/logIn", (req, res) => {
    res.clearCookie("authToken").render("signin.hbs");
});
router.post("/logIn", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.find({ email });
    if (user[0]) {
        const comparePass = await bcrypt.compare(password, user[0].password);
        if (comparePass) {
            if (!user[0].isVerified) {
                const token = user[0].generateAuthToken();
                const otp = otpGenerator.generate(4, {
                    upperCaseAlphabets: false,
                    specialChars: false,
                    lowerCaseAlphabets: false,
                });
                const newPass = new OTP({
                    digits: otp,
                    userId: user[0]._id,
                });
                await newPass.save(function (err) {
                    if (err) {
                        return res.status(500).send({ msg: err.message });
                    }
                });
                await sendEmail(email, otp);
                res.cookie("authToken", token, {
                    maxAge: 1 * 60 * 60 * 1000,
                }).render("signup.hbs", {
                    error: "This user is not verified yet!",
                    valid: "Verification code sent",
                    token: token,
                }); //redirect to verification page
            } else {
                const token = user[0].generateAuthToken();
                res.cookie("authToken", token, {
                    maxAge: 1 * 60 * 60 * 1000,
                }).render("signin.hbs", {
                    valid: "Logged In successfully",
                }); //redirect to home page
            }
        } else {
            res.render("signin.hbs", {
                error: "Email or password incorrect!",
            });
        }
    } else {
        res.render("signin.hbs", {
            error: "This email hasn't registered yet!",
        });
    }
});

//Verification
router.get("/verification", auth, async (req, res) => {
    res.render("verification.hbs");
});
router.post("/verification", auth, async (req, res) => {
    const pass = req.body;
    let otpIn = `${pass.OTP1}${pass.OTP2}${pass.OTP3}${pass.OTP4}`;
    const otpOut = await OTP.find({ userId: req.user._id });
    if (!otpOut[0]) {
        res.render("verification.hbs", {
            error: "OTP invalid!",
        });
    } else {
        if (otpIn == otpOut[0].digits) {
            const user = await User.findById(req.user._id);
            user.isVerified = true;
            await user.save(function (err) {
                if (err) {
                    return res.status(500).send({ msg: err.message });
                }
            });
            res.redirect("/home/");
        } else {
            res.render("verification.hbs", {
                error: "OTP EXPIRED!",
            });
        }
    }
});

//Forget password
router.get("/forgetPass", (req, res) => {
    res.render("forgetpass.hbs");
});
router.post("/forgetPass", async (req, res) => {
    const mail = req.body.email;
    let user = await User.find({ email: mail });
    if (user[0]) {
        const token = user[0].generateAuthToken();
        const otp = otpGenerator.generate(4, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        const newPass = new OTP({
            digits: `${otp}`,
            userId: user[0]._id,
        });
        await newPass.save(function (err) {
            if (err) {
                return res.status(500).send({ msg: err.message });
            }
        });
        await sendEmail(req.body.email, otp);
        res.cookie("authToken", token, { maxAge: 1 * 60 * 60 * 1000 }).render(
            "forgetpass.hbs",
            {
                valid: "Verification code sent",
                token: token,
            }
        ); //redirect to forget verification page
    } else {
        res.render("forgetpass.hbs", {
            error: "This email haven't registered yet!",
        });
    }
});

//Forget password verification
router.get("/forgetVerification", (req, res) => {
    res.render("forgetverification.hbs");
});
router.post("/forgetVerification", auth, async (req, res) => {
    const pass = req.body;
    let otpIn = `${pass.OTP1}${pass.OTP2}${pass.OTP3}${pass.OTP4}`;
    const otpOut = await OTP.find({ userId: req.user._id });
    if (otpIn == otpOut[0].digits) {
        const user = await User.findById(req.user._id);
        user.isVerified = true;
        await user.save(function (err) {
            if (err) {
                return res.status(500).send({ msg: err.message });
            }
        });
        res.redirect("/resetPass");
    } else {
        res.render("forgetverification.hbs", {
            error: "OTP EXPIRED!",
        });
    }
});

//Reset password
router.get("/resetPass", auth, async (req, res) => {
    res.render("resetpass.hbs");
});
router.post("/resetPass", auth, async (req, res) => {
    const userId = req.user._id;
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    const thisUser = await User.findById(userId);
    const compareNewPass = await bcrypt.compare(newPassword, thisUser.password);
    if (compareNewPass) {
        return res
            .status(404)
            .send("The new password could not match old passwords!");
    }
    let user = await User.findByIdAndUpdate(
        userId,
        { password: newPassword },
        {
            new: true,
        }
    );
    await user.save(function (err) {
        if (err) {
            return res.status(500).send({ msg: err.message });
        }
    });
    res.render("resetpass.hbs", {
        valid: "Password reset successfully",
    }); //redirect to log in page
});

//Change email = log in with a different email
router.get("/changeEmail", (req, res) => {
    res.render("changeemail.hbs");
});
router.post("/changeEmail", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.find({ email });
    if (user[0]) {
        const comparePass = await bcrypt.compare(password, user[0].password);
        if (comparePass) {
            const token = user[0].generateAuthToken();
            if (user[0].isVerified) {
                res.cookie("authToken", token, {
                    maxAge: 1 * 60 * 60 * 1000,
                }).redirect("/home/");
            } //redirect to home directly if the user is already verified
            const otp = otpGenerator.generate(4, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });
            const newPass = new OTP({
                digits: `${otp}`,
                userId: user[0]._id,
            });
            await newPass.save(function (err) {
                if (err) {
                    return res.status(500).send({ msg: err.message });
                }
            });
            await sendEmail(req.body.email, otp);
            res.cookie("authToken", token, {
                maxAge: 1 * 60 * 60 * 1000,
            }).render("changeemail.hbs", {
                valid: "Verification code sent",
                token: token,
            }); //redirect to verification page
        } else {
            res.render("changeemail.hbs", {
                error: "Email or password incorrect!",
            });
        }
    } else {
        res.render("changeemail.hbs", {
            error: "This email hasn't registered yet!",
        });
    }
});

module.exports = router;
