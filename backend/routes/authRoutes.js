const express = require("express");


const {
    registerUser,
    verifyEmailOTP,
    resendEmailOTP,
    forgotPassword,
    resetPassword,
    loginUser
} = require("../controllers/authController");


const router =
    express.Router();


// ========================================
// REGISTER
// ========================================

router.post(
    "/register",
    registerUser
);


// ========================================
// VERIFY EMAIL OTP
// ========================================

router.post(
    "/verify-email-otp",
    verifyEmailOTP
);


// ========================================
// RESEND EMAIL OTP
// ========================================

router.post(
    "/resend-email-otp",
    resendEmailOTP
);


// ========================================
// FORGOT PASSWORD
// ========================================

router.post(
    "/forgot-password",
    forgotPassword
);


// ========================================
// RESET PASSWORD
// ========================================

router.post(
    "/reset-password",
    resetPassword
);


// ========================================
// LOGIN
// ========================================

router.post(
    "/login",
    loginUser
);


module.exports = router;