
const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD?.replace(/\s/g, "");

    // Check environment variables
    if (!emailUser || !emailPassword) {
        throw new Error(
            "EMAIL_USER or EMAIL_PASSWORD is missing in environment variables"
        );
    }

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailUser,
            pass: emailPassword
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000
    });

    try {
        // Verify SMTP connection
        await transporter.verify();

        // Send email
        const info = await transporter.sendMail({
            from: `"JobForge" <${emailUser}>`,
            to,
            subject,
            html
        });

        console.log("Verification email sent:", info.messageId);

        return info;

    } catch (error) {
        console.error("GMAIL SMTP ERROR:", {
            message: error.message,
            code: error.code,
            response: error.response,
            command: error.command
        });

        throw error;

    } finally {
        transporter.close();
    }
};

module.exports = sendEmail;
