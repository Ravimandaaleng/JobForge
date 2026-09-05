const express = require("express");

const router = express.Router();

const {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} = require(
    "../controllers/notificationController"
);

const protect =
    require("../middleware/authMiddleware");


/* =========================
   GET NOTIFICATIONS
========================= */

router.get(
    "/",
    protect,
    getMyNotifications
);


/* =========================
   MARK ALL READ
========================= */

router.patch(
    "/read-all",
    protect,
    markAllNotificationsAsRead
);


/* =========================
   MARK ONE READ
========================= */

router.patch(
    "/:id/read",
    protect,
    markNotificationAsRead
);


/* =========================
   DELETE
========================= */

router.delete(
    "/:id",
    protect,
    deleteNotification
);


module.exports = router;