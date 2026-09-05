const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");


// ========================================
// GENERATE 6 DIGIT OTP
// ========================================

const generateOTP = () => {

    return crypto
        .randomInt(100000, 1000000)
        .toString();

};


// ========================================
// HASH OTP
// ========================================

const hashOTP = (otp) => {

    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

};


// ========================================
// REGISTER USER
// ========================================

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password,
            role
        } = req.body;


        if (
            !name ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "Name, email, phone and password are required"
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });

        }


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {

            return res.status(400).json({
                message:
                    "Please enter a valid email address"
            });

        }


        const selectedRole =
            role === "recruiter"
                ? "recruiter"
                : "student";


        // ==================================
        // CHECK EMAIL
        // ==================================

        const existingEmail =
            await User.findOne({
                email:
                    email.toLowerCase().trim()
            });


        if (existingEmail) {

            return res.status(409).json({
                message:
                    "Email is already registered"
            });

        }


        // ==================================
        // CHECK PHONE
        // ==================================

        const existingPhone =
            await User.findOne({
                phone:
                    phone.trim()
            });


        if (existingPhone) {

            return res.status(409).json({
                message:
                    "Phone number is already registered"
            });

        }


        // ==================================
        // HASH PASSWORD
        // ==================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ==================================
        // GENERATE EMAIL OTP
        // ==================================

        const otp =
            generateOTP();


        const otpHash =
            hashOTP(otp);


        const otpExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );


        // ==================================
        // CREATE USER
        // ==================================

        const user =
            await User.create({

                name:
                    name.trim(),

                email:
                    email.toLowerCase().trim(),

                phone:
                    phone.trim(),

                password:
                    hashedPassword,

                role:
                    selectedRole,

                emailVerified:
                    false,

                emailOtpHash:
                    otpHash,

                emailOtpExpires:
                    otpExpires,

                emailOtpAttempts:
                    0,

                emailOtpLastSentAt:
                    new Date()

            });


        // ==================================
        // SEND EMAIL OTP
        // ==================================

        try {

            await sendEmail({

                to:
                    user.email,

                subject:
                    "JobForge - Email Verification OTP",

                html: `

                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: auto;
                        padding: 30px;
                        border: 1px solid #ddd;
                        border-radius: 10px;
                    ">

                        <h2>
                            Welcome to JobForge
                        </h2>

                        <p>
                            Hello ${user.name},
                        </p>

                        <p>
                            Your email verification OTP is:
                        </p>

                        <div style="
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            padding: 15px;
                            text-align: center;
                            background: #f3f4f6;
                            border-radius: 8px;
                            margin: 20px 0;
                        ">
                            ${otp}
                        </div>

                        <p>
                            This OTP will expire in
                            <strong>10 minutes</strong>.
                        </p>

                        <p>
                            Regards,<br>
                            <strong>JobForge Team</strong>
                        </p>

                    </div>

                `

            });

        } catch (emailError) {

            console.error(
                "OTP email failed:",
                emailError.message
            );


            await User.findByIdAndDelete(
                user._id
            );


            return res.status(500).json({

                message:
                    "Registration failed because verification email could not be sent"

            });

        }


        return res.status(201).json({

            message:
                "Registration successful. Please check your email for the OTP.",

            email:
                user.email

        });


    } catch (error) {

        console.error(
            "Register Error:",
            error
        );


        if (error.code === 11000) {

            return res.status(409).json({

                message:
                    "Email or phone number is already registered"

            });

        }


        return res.status(500).json({

            message:
                "Server error during registration"

        });

    }

};


// ========================================
// VERIFY EMAIL OTP
// ========================================

const verifyEmailOTP = async (req, res) => {

    try {

        const {
            email,
            otp
        } = req.body;


        if (!email || !otp) {

            return res.status(400).json({

                message:
                    "Email and OTP are required"

            });

        }


        const user =
            await User.findOne({

                email:
                    email.toLowerCase().trim()

            });


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        if (user.emailVerified) {

            return res.status(400).json({

                message:
                    "Email is already verified"

            });

        }


        if (
            user.emailOtpAttempts >= 5
        ) {

            return res.status(429).json({

                message:
                    "Too many incorrect OTP attempts. Please request a new OTP."

            });

        }


        if (
            !user.emailOtpExpires ||
            user.emailOtpExpires < new Date()
        ) {

            return res.status(400).json({

                message:
                    "OTP has expired. Please request a new OTP."

            });

        }


        const enteredOtpHash =
            hashOTP(
                otp.toString().trim()
            );


        if (
            enteredOtpHash !==
            user.emailOtpHash
        ) {

            user.emailOtpAttempts += 1;

            await user.save();


            return res.status(400).json({

                message:
                    "Invalid OTP",

                attemptsRemaining:
                    Math.max(
                        0,
                        5 - user.emailOtpAttempts
                    )

            });

        }


        // ==================================
        // VERIFY EMAIL
        // ==================================

        user.emailVerified =
            true;

        user.emailOtpHash =
            "";

        user.emailOtpExpires =
            null;

        user.emailOtpAttempts =
            0;

        user.emailOtpLastSentAt =
            null;


        await user.save();


        return res.status(200).json({

            message:
                "Email verified successfully. You can now login."

        });


    } catch (error) {

        console.error(
            "Verify OTP Error:",
            error
        );


        return res.status(500).json({

            message:
                "Server error during OTP verification"

        });

    }

};


// ========================================
// RESEND EMAIL OTP
// ========================================

const resendEmailOTP = async (req, res) => {

    try {

        const {
            email
        } = req.body;


        if (!email) {

            return res.status(400).json({

                message:
                    "Email is required"

            });

        }


        const user =
            await User.findOne({

                email:
                    email.toLowerCase().trim()

            });


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        if (user.emailVerified) {

            return res.status(400).json({

                message:
                    "Email is already verified"

            });

        }


        // ==================================
        // 60 SECOND RESEND LIMIT
        // ==================================

        if (
            user.emailOtpLastSentAt
        ) {

            const secondsPassed =
                (
                    Date.now() -
                    user.emailOtpLastSentAt.getTime()
                ) / 1000;


            if (secondsPassed < 60) {

                const secondsRemaining =
                    Math.ceil(
                        60 - secondsPassed
                    );


                return res.status(429).json({

                    message:
                        `Please wait ${secondsRemaining} seconds before requesting another OTP.`

                });

            }

        }


        const otp =
            generateOTP();


        const otpHash =
            hashOTP(otp);


        const otpExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );


        user.emailOtpHash =
            otpHash;

        user.emailOtpExpires =
            otpExpires;

        user.emailOtpAttempts =
            0;

        user.emailOtpLastSentAt =
            new Date();


        await user.save();


        try {

            await sendEmail({

                to:
                    user.email,

                subject:
                    "JobForge - New Verification OTP",

                html: `

                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: auto;
                        padding: 30px;
                    ">

                        <h2>
                            JobForge Email Verification
                        </h2>

                        <p>
                            Hello ${user.name},
                        </p>

                        <p>
                            Your new verification OTP is:
                        </p>

                        <div style="
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            padding: 15px;
                            text-align: center;
                            background: #f3f4f6;
                            border-radius: 8px;
                            margin: 20px 0;
                        ">
                            ${otp}
                        </div>

                        <p>
                            This OTP will expire in
                            <strong>10 minutes</strong>.
                        </p>

                        <p>
                            Regards,<br>
                            <strong>JobForge Team</strong>
                        </p>

                    </div>

                `

            });

        } catch (emailError) {

            console.error(
                "Resend OTP email failed:",
                emailError.message
            );


            return res.status(500).json({

                message:
                    "Could not send OTP email. Please try again."

            });

        }


        return res.status(200).json({

            message:
                "A new OTP has been sent to your email."

        });


    } catch (error) {

        console.error(
            "Resend OTP Error:",
            error
        );


        return res.status(500).json({

            message:
                "Server error while resending OTP"

        });

    }

};


// ========================================
// FORGOT PASSWORD
// ========================================

const forgotPassword = async (req, res) => {

    try {

        const {
            email
        } = req.body;


        // ==================================
        // VALIDATION
        // ==================================

        if (!email) {

            return res.status(400).json({

                message:
                    "Email is required"

            });

        }


        // ==================================
        // FIND USER
        // ==================================

        const user =
            await User.findOne({

                email:
                    email.toLowerCase().trim()

            });


        // ==================================
        // DON'T REVEAL USER EXISTENCE
        // ==================================

        if (!user) {

            return res.status(200).json({

                message:
                    "If an account exists with this email, a password reset OTP has been sent."

            });

        }


        // ==================================
        // EMAIL MUST BE VERIFIED
        // ==================================

        if (!user.emailVerified) {

            return res.status(403).json({

                message:
                    "Please verify your email before resetting your password."

            });

        }


        // ==================================
        // 60 SECOND RESEND LIMIT
        // ==================================

        if (
            user.passwordResetOtpLastSentAt
        ) {

            const secondsPassed =
                (
                    Date.now() -
                    user.passwordResetOtpLastSentAt.getTime()
                ) / 1000;


            if (secondsPassed < 60) {

                const secondsRemaining =
                    Math.ceil(
                        60 - secondsPassed
                    );


                return res.status(429).json({

                    message:
                        `Please wait ${secondsRemaining} seconds before requesting another OTP.`

                });

            }

        }


        // ==================================
        // GENERATE RESET OTP
        // ==================================

        const otp =
            generateOTP();


        const otpHash =
            hashOTP(otp);


        const otpExpires =
            new Date(
                Date.now() +
                10 * 60 * 1000
            );


        // ==================================
        // SAVE RESET OTP
        // ==================================

        user.passwordResetOtpHash =
            otpHash;

        user.passwordResetOtpExpires =
            otpExpires;

        user.passwordResetOtpAttempts =
            0;

        user.passwordResetOtpLastSentAt =
            new Date();


        await user.save();


        // ==================================
        // SEND RESET OTP
        // ==================================

        try {

            await sendEmail({

                to:
                    user.email,

                subject:
                    "JobForge - Password Reset OTP",

                html: `

                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: auto;
                        padding: 30px;
                        border: 1px solid #ddd;
                        border-radius: 10px;
                    ">

                        <h2>
                            JobForge Password Reset
                        </h2>

                        <p>
                            Hello ${user.name},
                        </p>

                        <p>
                            We received a request to
                            reset your JobForge password.
                        </p>

                        <p>
                            Your password reset OTP is:
                        </p>

                        <div style="
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            padding: 15px;
                            text-align: center;
                            background: #f3f4f6;
                            border-radius: 8px;
                            margin: 20px 0;
                        ">
                            ${otp}
                        </div>

                        <p>
                            This OTP will expire in
                            <strong>10 minutes</strong>.
                        </p>

                        <p>
                            If you did not request a
                            password reset, you can
                            safely ignore this email.
                        </p>

                        <p>
                            Regards,<br>
                            <strong>JobForge Team</strong>
                        </p>

                    </div>

                `

            });

        } catch (emailError) {

            console.error(
                "Password reset email failed:",
                emailError.message
            );


            return res.status(500).json({

                message:
                    "Could not send password reset OTP."

            });

        }


        return res.status(200).json({

            message:
                "If an account exists with this email, a password reset OTP has been sent."

        });


    } catch (error) {

        console.error(
            "Forgot Password Error:",
            error
        );


        return res.status(500).json({

            message:
                "Server error while requesting password reset"

        });

    }

};


// ========================================
// RESET PASSWORD
// ========================================

const resetPassword = async (req, res) => {

    try {

        const {
            email,
            otp,
            newPassword
        } = req.body;


        // ==================================
        // VALIDATION
        // ==================================

        if (
            !email ||
            !otp ||
            !newPassword
        ) {

            return res.status(400).json({

                message:
                    "Email, OTP and new password are required"

            });

        }


        if (newPassword.length < 6) {

            return res.status(400).json({

                message:
                    "New password must be at least 6 characters"

            });

        }


        // ==================================
        // FIND USER
        // ==================================

        const user =
            await User.findOne({

                email:
                    email.toLowerCase().trim()

            });


        if (!user) {

            return res.status(400).json({

                message:
                    "Invalid password reset request"

            });

        }


        // ==================================
        // CHECK OTP ATTEMPTS
        // ==================================

        if (
            user.passwordResetOtpAttempts >= 5
        ) {

            return res.status(429).json({

                message:
                    "Too many incorrect OTP attempts. Please request a new OTP."

            });

        }


        // ==================================
        // CHECK OTP EXPIRATION
        // ==================================

        if (
            !user.passwordResetOtpExpires ||
            user.passwordResetOtpExpires < new Date()
        ) {

            return res.status(400).json({

                message:
                    "Password reset OTP has expired. Please request a new OTP."

            });

        }


        // ==================================
        // CHECK OTP
        // ==================================

        const enteredOtpHash =
            hashOTP(
                otp.toString().trim()
            );


        if (
            enteredOtpHash !==
            user.passwordResetOtpHash
        ) {

            user.passwordResetOtpAttempts += 1;

            await user.save();


            return res.status(400).json({

                message:
                    "Invalid OTP",

                attemptsRemaining:
                    Math.max(
                        0,
                        5 -
                        user.passwordResetOtpAttempts
                    )

            });

        }


        // ==================================
        // HASH NEW PASSWORD
        // ==================================

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        // ==================================
        // UPDATE PASSWORD
        // ==================================

        user.password =
            hashedPassword;


        // ==================================
        // CLEAR RESET OTP
        // ==================================

        user.passwordResetOtpHash =
            "";

        user.passwordResetOtpExpires =
            null;

        user.passwordResetOtpAttempts =
            0;

        user.passwordResetOtpLastSentAt =
            null;


        await user.save();


        return res.status(200).json({

            message:
                "Password reset successfully. You can now login."

        });


    } catch (error) {

        console.error(
            "Reset Password Error:",
            error
        );


        return res.status(500).json({

            message:
                "Server error while resetting password"

        });

    }

};


// ========================================
// LOGIN USER
// ========================================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required"

            });

        }


        const user =
            await User.findOne({

                email:
                    email.toLowerCase().trim()

            });


        if (!user) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        if (!user.emailVerified) {

            return res.status(403).json({

                message:
                    "Please verify your email before logging in",

                emailVerified:
                    false,

                email:
                    user.email

            });

        }


        const token =
            jwt.sign(

                {
                    id:
                        user._id,

                    role:
                        user.role

                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "7d"
                }

            );


        return res.status(200).json({

            message:
                "Login successful",

            token,

            user: {

                id:
                    user._id,

                _id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role,

                skills:
                    user.skills,

                resume:
                    user.resume,

                emailVerified:
                    user.emailVerified

            }

        });


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        return res.status(500).json({

            message:
                "Server error during login"

        });

    }

};


// ========================================
// EXPORT
// ========================================

module.exports = {

    registerUser,

    verifyEmailOTP,

    resendEmailOTP,

    forgotPassword,

    resetPassword,

    loginUser

};