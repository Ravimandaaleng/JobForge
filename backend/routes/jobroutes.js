const express = require("express");

const router = express.Router();


const {
    createJob,
    getJobs,
    getMyJobs,
    getJobById,
    updateJob,
    deleteJob
} = require("../controllers/jobController");


const protect = require("../middleware/authMiddleware");

const authorizeRoles = require(
    "../middleware/roleMiddleware"
);



// ========================================
// Public Routes
// ========================================

// Get all jobs

router.get(
    "/",
    getJobs
);



// ========================================
// Recruiter Routes
// ========================================

// Get recruiter's own jobs

router.get(
    "/my",
    protect,
    authorizeRoles("recruiter"),
    getMyJobs
);


// Create job

router.post(
    "/",
    protect,
    authorizeRoles("recruiter"),
    createJob
);


// Update job

router.put(
    "/:id",
    protect,
    authorizeRoles("recruiter"),
    updateJob
);


// Delete job

router.delete(
    "/:id",
    protect,
    authorizeRoles("recruiter"),
    deleteJob
);



// ========================================
// Public Job Details
// ========================================

router.get(
    "/:id",
    getJobById
);



module.exports = router;