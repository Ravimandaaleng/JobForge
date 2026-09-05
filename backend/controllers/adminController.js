const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");


// ========================================
// GET ADMIN DASHBOARD
// ========================================

const getAdminDashboard = async (req, res) => {

    try {

        const totalUsers =
            await User.countDocuments();

        const totalStudents =
            await User.countDocuments({
                role: "student"
            });

        const totalRecruiters =
            await User.countDocuments({
                role: "recruiter"
            });

        const totalJobs =
            await Job.countDocuments();

        const totalApplications =
            await Application.countDocuments();

        const appliedApplications =
            await Application.countDocuments({
                status: "applied"
            });

        const shortlistedApplications =
            await Application.countDocuments({
                status: "shortlisted"
            });

        const rejectedApplications =
            await Application.countDocuments({
                status: "rejected"
            });


        res.status(200).json({

            message: "Admin dashboard data",

            statistics: {

                totalUsers,

                totalStudents,

                totalRecruiters,

                totalJobs,

                totalApplications,

                appliedApplications,

                shortlistedApplications,

                rejectedApplications

            }

        });

    } catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error.message
        );

        res.status(500).json({

            message:
                "Failed to load admin dashboard"

        });

    }

};


// ========================================
// GET ALL USERS
// ========================================

const getAllUsers = async (req, res) => {

    try {

        const users =
            await User.find()
                .select("-password")
                .sort({
                    createdAt: -1
                });


        res.status(200).json({

            count: users.length,

            users

        });

    } catch (error) {

        console.error(
            "Get All Users Error:",
            error.message
        );

        res.status(500).json({

            message:
                "Failed to fetch users"

        });

    }

};


// ========================================
// UPDATE USER ROLE
// ========================================

const updateUserRole = async (req, res) => {

    try {

        const {
            role
        } = req.body;


        const allowedRoles = [
            "student",
            "recruiter",
            "admin"
        ];


        if (
            !allowedRoles.includes(role)
        ) {

            return res.status(400).json({

                message:
                    "Invalid user role"

            });

        }


        const user =
            await User.findById(
                req.params.id
            );


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        // Prevent changing own role

        if (
            user._id.toString() ===
            req.user.id
        ) {

            return res.status(400).json({

                message:
                    "You cannot change your own role"

            });

        }


        user.role = role;

        await user.save();


        res.status(200).json({

            message:
                "User role updated successfully",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        console.error(
            "Update User Role Error:",
            error.message
        );

        res.status(500).json({

            message:
                "Failed to update user role"

        });

    }

};


// ========================================
// DELETE USER
// ========================================

const deleteUser = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.params.id
            );


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        // Prevent deleting own account

        if (
            user._id.toString() ===
            req.user.id
        ) {

            return res.status(400).json({

                message:
                    "You cannot delete your own account"

            });

        }


        await User.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            message:
                "User deleted successfully"

        });

    } catch (error) {

        console.error(
            "Delete User Error:",
            error.message
        );

        res.status(500).json({

            message:
                "Failed to delete user"

        });

    }

};


// ========================================
// GET ALL JOBS
// ========================================

const getAllJobs = async (req, res) => {

    try {

        const jobs =
            await Job.find()

                .populate(
                    "recruiter",
                    "name email"
                )

                .sort({
                    createdAt: -1
                });


        res.status(200).json({

            count: jobs.length,

            jobs

        });

    } catch (error) {

        console.error(
            "Get All Jobs Error:",
            error.message
        );

        res.status(500).json({

            message:
                "Failed to fetch jobs"

        });

    }

};


// ========================================
// DELETE JOB
// ========================================

const deleteJob = async (req, res) => {

    try {

        const job =
            await Job.findById(
                req.params.id
            );


        if (!job) {

            return res.status(404).json({

                message:
                    "Job not found"

            });

        }


        // Delete applications
        // belonging to this job

        await Application.deleteMany({

            job: job._id

        });


        // Delete job

        await Job.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            message:
                "Job deleted successfully"

        });

    } catch (error) {

        console.error(
            "Admin Delete Job Error:",
            error.message
        );

        res.status(500).json({

            message:
                "Failed to delete job"

        });

    }

};


module.exports = {

    getAdminDashboard,

    getAllUsers,

    updateUserRole,

    deleteUser,

    getAllJobs,

    deleteJob

};