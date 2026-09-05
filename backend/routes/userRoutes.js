const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
    getProfile,
    updateProfile,
    uploadResume
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

router.get(
    "/profile",
    protect,
    getProfile
);

router.put(
    "/profile",
    protect,
    updateProfile
);

router.post(
    "/resume",
    protect,
    upload.single("resume"),
    uploadResume
);


module.exports = router;