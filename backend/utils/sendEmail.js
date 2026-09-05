const nodemailer = require("nodemailer");


const sendEmail = async ({
    to,
    subject,
    html
}) => {

    try {

        // Create transporter after environment variables are loaded
        const transporter =
            nodemailer.createTransport({
                service: "gmail",

                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });


        const mailOptions = {
            from: `"JobForge" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        };


        const info =
            await transporter.sendMail(
                mailOptions
            );


        console.log(
            "Email sent successfully:",
            info.messageId
        );


        return info;

    } catch (error) {

        console.error(
            "Email sending failed:",
            error.message
        );

        throw error;
    }
};


module.exports = sendEmail;