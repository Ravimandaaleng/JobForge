const mongoose = require("mongoose");


// ========================================
// USER SCHEMA
// ========================================

const userSchema = new mongoose.Schema(
    {

        // ==================================
        // NAME
        // ==================================

        name: {
            type: String,
            required: true,
            trim: true
        },


        // ==================================
        // EMAIL
        // ==================================

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },


        // ==================================
        // MOBILE NUMBER
        // ==================================

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },


        // ==================================
        // PASSWORD
        // ==================================

        password: {
            type: String,
            required: true,
            minlength: 6
        },


        // ==================================
        // ROLE
        // ==================================

        role: {
            type: String,

            enum: [
                "student",
                "recruiter",
                "admin"
            ],

            default: "student"
        },


        // ==================================
        // SKILLS
        // ==================================

        skills: {
            type: [String],
            default: []
        },


        // ==================================
        // RESUME
        // ==================================

        resume: {
            type: String,
            default: ""
        },


        // ==================================
        // EMAIL VERIFICATION
        // ==================================

        emailVerified: {
            type: Boolean,
            default: false
        },


        // ==================================
        // EMAIL OTP
        // ==================================

        emailOtpHash: {
            type: String,
            default: ""
        },


        // ==================================
        // EMAIL OTP EXPIRATION
        // ==================================

        emailOtpExpires: {
            type: Date,
            default: null
        },


        // ==================================
        // EMAIL OTP ATTEMPTS
        // ==================================

        emailOtpAttempts: {
            type: Number,
            default: 0
        },


        // ==================================
        // LAST OTP SENT TIME
        // ==================================

        emailOtpLastSentAt: {
            type: Date,
            default: null
        },
        // ==================================
// PASSWORD RESET OTP
// ==================================

passwordResetOtpHash: {
    type: String,
    default: ""
},


// ==================================
// PASSWORD RESET OTP EXPIRATION
// ==================================

passwordResetOtpExpires: {
    type: Date,
    default: null
},


// ==================================
// PASSWORD RESET OTP ATTEMPTS
// ==================================

passwordResetOtpAttempts: {
    type: Number,
    default: 0
},


// ==================================
// PASSWORD RESET OTP LAST SENT
// ==================================

passwordResetOtpLastSentAt: {
    type: Date,
    default: null
},

    },

    {
        timestamps: true
    }
);


// ========================================
// USER MODEL
// ========================================

const User = mongoose.model(
    "User",
    userSchema
);


module.exports = User;