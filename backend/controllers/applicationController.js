const mongoose = require("mongoose");

const Application =
    require("../models/Application");

const Job =
    require("../models/Job");

const User =
    require("../models/User");

const Notification =
    require("../models/Notification");

const {
    getIO
} = require("../socket/socket");


// ========================================
// APPLY FOR JOB
// ========================================

const applyForJob =
    async (req, res) => {

        try {

            const { jobId } =
                req.params;


            // Validate job ID

            if (
                !mongoose.Types.ObjectId.isValid(
                    jobId
                )
            ) {

                return res.status(400).json({
                    message:
                        "Invalid job ID"
                });

            }


            // Check job exists

            const job =
                await Job.findById(jobId);


            if (!job) {

                return res.status(404).json({
                    message:
                        "Job not found"
                });

            }


            // Get student

            const student =
                await User.findById(
                    req.user.id
                );


            if (!student) {

                return res.status(404).json({
                    message:
                        "Student not found"
                });

            }


            // Resume required

            if (!student.resume) {

                return res.status(400).json({
                    message:
                        "Please upload your resume before applying"
                });

            }


            // Check duplicate application

            const existingApplication =
                await Application.findOne({

                    student: req.user.id,

                    job: jobId

                });


            if (existingApplication) {

                return res.status(400).json({
                    message:
                        "You have already applied for this job"
                });

            }


            // Create application

            const application =
                await Application.create({

                    student:
                        req.user.id,

                    job:
                        jobId,

                    status:
                        "applied",

                    statusHistory: [
                        {
                            status:
                                "applied",

                            changedAt:
                                new Date()
                        }
                    ]

                });


            res.status(201).json({

                message:
                    "Application submitted successfully",

                application

            });

        } catch (error) {

            console.error(
                "Apply Job Error:",
                error
            );


            // Duplicate key

            if (
                error.code === 11000
            ) {

                return res.status(400).json({
                    message:
                        "You have already applied for this job"
                });

            }


            res.status(500).json({
                message:
                    "Failed to apply for job"
            });

        }

    };


// ========================================
// GET RECRUITER APPLICATIONS
// ========================================

const getRecruiterApplications =
    async (req, res) => {

        try {

            const applications =
                await Application.find()

                    .populate(
                        "student",
                        "name email skills resume"
                    )

                    .populate({
                        path: "job",

                        match: {
                            recruiter:
                                req.user.id
                        },

                        select:
                            "title company location salary jobType"
                    })

                    .sort({
                        createdAt: -1
                    });


            // Remove applications whose
            // jobs don't belong to recruiter

            const recruiterApplications =
                applications.filter(
                    (application) =>
                        application.job !== null
                );


            res.status(200).json({

                count:
                    recruiterApplications.length,

                applications:
                    recruiterApplications

            });

        } catch (error) {

            console.error(
                "Get Recruiter Applications Error:",
                error
            );


            res.status(500).json({
                message:
                    "Failed to fetch applications"
            });

        }

    };


// ========================================
// UPDATE APPLICATION STATUS
// ========================================

const updateApplicationStatus =
    async (req, res) => {

        try {

            const { id } =
                req.params;

            const { status } =
                req.body;


            // Validate application ID

            if (
                !mongoose.Types.ObjectId.isValid(
                    id
                )
            ) {

                return res.status(400).json({
                    message:
                        "Invalid application ID"
                });

            }


            // Validate status

            const allowedStatuses = [
                "applied",
                "shortlisted",
                "rejected"
            ];


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({
                    message:
                        "Invalid application status"
                });

            }


            // Get application

            const application =
                await Application.findById(id)
                    .populate(
                        "job",
                        "title company recruiter"
                    );


            if (!application) {

                return res.status(404).json({
                    message:
                        "Application not found"
                });

            }


            // Check job exists

            if (!application.job) {

                return res.status(404).json({
                    message:
                        "Related job not found"
                });

            }


            // Check recruiter ownership

            if (
                application.job.recruiter.toString() !==
                req.user.id
            ) {

                return res.status(403).json({
                    message:
                        "You can only update applications for your own jobs"
                });

            }


            // If status is already same

            if (
                application.status ===
                status
            ) {

                return res.status(200).json({

                    message:
                        "Application status is already " +
                        status,

                    application

                });

            }


            // Update status

            application.status =
                status;


            // Add status history

            application.statusHistory.push({

                status:
                    status,

                changedAt:
                    new Date()

            });


            await application.save();


            // ====================================
            // CREATE NOTIFICATION MESSAGE
            // ====================================

            let message;


            if (
                status ===
                "shortlisted"
            ) {

                message =
                    `Your application for ${application.job.title} at ${application.job.company} has been shortlisted.`;

            } else if (
                status ===
                "rejected"
            ) {

                message =
                    `Your application for ${application.job.title} at ${application.job.company} has been rejected.`;

            } else {

                message =
                    `Your application for ${application.job.title} at ${application.job.company} is now marked as applied.`;

            }


            // ====================================
            // SAVE NOTIFICATION
            // ====================================

            const notification =
                await Notification.create({

                    user:
                        application.student,

                    message:
                        message,

                    type:
                        "application",

                    relatedApplication:
                        application._id,

                    relatedJob:
                        application.job._id

                });


            // ====================================
            // SEND REAL-TIME NOTIFICATION
            // ====================================

            try {

                const io =
                    getIO();


                const studentRoom =
                    `user_${application.student.toString()}`;


                io.to(
                    studentRoom
                ).emit(
                    "newNotification",
                    notification
                );


                console.log(
                    `Real-time notification sent to ${studentRoom}`
                );

            } catch (socketError) {

                console.error(
                    "Socket Notification Error:",
                    socketError.message
                );

            }


            // ====================================
            // RESPONSE
            // ====================================

            res.status(200).json({

                message:
                    "Application status updated successfully",

                application

            });

        } catch (error) {

            console.error(
                "Update Application Status Error:",
                error
            );


            res.status(500).json({
                message:
                    "Failed to update application status"
            });

        }

    };


// ========================================
// GET MY APPLICATIONS
// ========================================

const getMyApplications =
    async (req, res) => {

        try {

            const applications =
                await Application.find({

                    student:
                        req.user.id

                })

                    .populate(
                        "job",
                        "title company location salary jobType experience skills"
                    )

                    .sort({
                        createdAt: -1
                    });


            res.status(200).json({

                count:
                    applications.length,

                applications

            });

        } catch (error) {

            console.error(
                "Get My Applications Error:",
                error
            );


            res.status(500).json({
                message:
                    "Failed to fetch your applications"
            });

        }

    };


// ========================================
// EXPORT
// ========================================

module.exports = {

    applyForJob,

    getRecruiterApplications,

    updateApplicationStatus,

    getMyApplications

};