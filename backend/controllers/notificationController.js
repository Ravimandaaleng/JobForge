const mongoose = require("mongoose");

const Notification =
    require("../models/Notification");


/* =========================
   GET MY NOTIFICATIONS
========================= */

const getMyNotifications =
    async (req, res) => {

        try {

            const notifications =
                await Notification.find({
                    user: req.user.id
                })

                    .populate(
                        "relatedJob",
                        "title company"
                    )

                    .sort({
                        createdAt: -1
                    });


            const unreadCount =
                await Notification.countDocuments({
                    user: req.user.id,
                    isRead: false
                });


            res.status(200).json({

                count:
                    notifications.length,

                unreadCount,

                notifications
            });

        } catch (error) {

            console.error(
                "Get Notifications Error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch notifications"
            });
        }
    };


/* =========================
   MARK ONE AS READ
========================= */

const markNotificationAsRead =
    async (req, res) => {

        try {

            const { id } = req.params;


            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {
                return res.status(400).json({
                    message:
                        "Invalid notification ID"
                });
            }


            const notification =
                await Notification.findById(id);


            if (!notification) {

                return res.status(404).json({
                    message:
                        "Notification not found"
                });
            }


            /*
                Security:
                user can only modify
                their own notification
            */

            if (
                notification.user.toString() !==
                req.user.id
            ) {

                return res.status(403).json({
                    message:
                        "You can only update your own notifications"
                });
            }


            notification.isRead = true;

            await notification.save();


            res.status(200).json({

                message:
                    "Notification marked as read",

                notification
            });

        } catch (error) {

            console.error(
                "Mark Notification Error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update notification"
            });
        }
    };


/* =========================
   MARK ALL AS READ
========================= */

const markAllNotificationsAsRead =
    async (req, res) => {

        try {

            await Notification.updateMany(
                {
                    user: req.user.id,
                    isRead: false
                },
                {
                    $set: {
                        isRead: true
                    }
                }
            );


            res.status(200).json({
                message:
                    "All notifications marked as read"
            });

        } catch (error) {

            console.error(
                "Mark All Notifications Error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to update notifications"
            });
        }
    };


/* =========================
   DELETE NOTIFICATION
========================= */

const deleteNotification =
    async (req, res) => {

        try {

            const { id } = req.params;


            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {

                return res.status(400).json({
                    message:
                        "Invalid notification ID"
                });
            }


            const notification =
                await Notification.findById(id);


            if (!notification) {

                return res.status(404).json({
                    message:
                        "Notification not found"
                });
            }


            if (
                notification.user.toString() !==
                req.user.id
            ) {

                return res.status(403).json({
                    message:
                        "You can only delete your own notifications"
                });
            }


            await Notification.findByIdAndDelete(
                id
            );


            res.status(200).json({
                message:
                    "Notification deleted successfully"
            });

        } catch (error) {

            console.error(
                "Delete Notification Error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to delete notification"
            });
        }
    };


module.exports = {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
};