const express = require("express");

const router = express.Router();


const {

    getAdminDashboard,

    getAllUsers,

    updateUserRole,

    deleteUser

} = require(
    "../controllers/adminController"
);


const protect = require(
    "../middleware/authMiddleware"
);


const authorizeRoles = require(
    "../middleware/roleMiddleware"
);


// ========================================
// ADMIN DASHBOARD
// ========================================

router.get(

    "/dashboard",

    protect,

    authorizeRoles("admin"),

    getAdminDashboard

);


// ========================================
// GET ALL USERS
// ========================================

router.get(

    "/users",

    protect,

    authorizeRoles("admin"),

    getAllUsers

);


// ========================================
// UPDATE USER ROLE
// ========================================

router.patch(

    "/users/:id/role",

    protect,

    authorizeRoles("admin"),

    updateUserRole

);


// ========================================
// DELETE USER
// ========================================

router.delete(

    "/users/:id",

    protect,

    authorizeRoles("admin"),

    deleteUser

);


module.exports = router;