

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAILEMPRESA,
        pass: process.env.PASSWORDEMAIL
    }
});


module.exports = transporter