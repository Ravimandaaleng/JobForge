const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        company: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        salary: {
            type: Number,
            required: true
        },

        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Contract"],
            required: true
        },

        experience: {
            type: String,
            required: true
        },

        skills: {
            type: [String],
            required: true
        },

        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

module.exports = Job;