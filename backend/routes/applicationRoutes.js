const express = require("express");

const router = express.Router();

const {
    applyForJob,
    getRecruiterApplications,
    updateApplicationStatus,
    getMyApplications
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
    "/:jobId",
    protect,
    authorizeRoles("student"),
    applyForJob
);

router.get(
    "/recruiter",
    protect,
    authorizeRoles("recruiter"),
    getRecruiterApplications
);

router.patch(
    "/:id/status",
    protect,
    authorizeRoles("recruiter"),
    updateApplicationStatus
);

router.get(
    "/my",
    protect,
    authorizeRoles("student"),
    getMyApplications
);

module.exports = router;