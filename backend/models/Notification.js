const mongoose = require("mongoose");

const notificationSchema =
    new mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            message: {
                type: String,
                required: true,
                trim: true
            },

            type: {
                type: String,
                enum: [
                    "application",
                    "job",
                    "system"
                ],
                default: "system"
            },

            isRead: {
                type: Boolean,
                default: false
            },

            relatedApplication: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Application",
                default: null
            },

            relatedJob: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
                default: null
            }
        },
        {
            timestamps: true
        }
    );


const Notification =
    mongoose.model(
        "Notification",
        notificationSchema
    );


module.exports = Notification;