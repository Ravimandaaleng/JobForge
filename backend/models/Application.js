const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: [
                "applied",
                "shortlisted",
                "rejected"
            ],
            required: true
        },

        changedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);


const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        status: {
            type: String,
            enum: [
                "applied",
                "shortlisted",
                "rejected"
            ],
            default: "applied"
        },

        statusHistory: {
            type: [statusHistorySchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);


/* =========================
   PREVENT DUPLICATE
   APPLICATIONS
========================= */

applicationSchema.index(
    {
        student: 1,
        job: 1
    },
    {
        unique: true
    }
);


const Application =
    mongoose.model(
        "Application",
        applicationSchema
    );


module.exports = Application;