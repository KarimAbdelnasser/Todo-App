const nodemailer = require("nodemailer");
require("dotenv").config();
function sendEmail(toMail, otp) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.mailSender,
                pass: process.env.mailPass,
            },
        });
        const mail_configs = {
            to: toMail,
            subject: "OTP",
            text: `Your OTP is \n ${otp} \n it will be invalid after 20 seconds!`,
        };
        transporter.sendMail(mail_configs, function (error, info) {
            if (error) {
                console.log(error);
                return reject(
                    console.log(
                        `Can't send a OTP code to this mail ${toMail} we get an error${error.message}`
                    )
                );
            }
            return resolve(
                console.log(`verification code has been sent to ${toMail}`)
            );
        });
    });
}
module.exports = sendEmail;
