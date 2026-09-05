import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axios";

function Notifications() {

    const [notifications, setNotifications] =
        useState([]);

    const [unreadCount, setUnreadCount] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =========================
       FETCH NOTIFICATIONS
    ========================= */

    const fetchNotifications = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/notifications"
                );

            setNotifications(
                response.data.notifications
            );

            setUnreadCount(
                response.data.unreadCount
            );

        } catch (error) {

            console.error(
                "Fetch Notifications Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load notifications"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        fetchNotifications();
    }, []);


    /* =========================
       MARK ONE AS READ
    ========================= */

    const markAsRead = async (id) => {

        try {

            await api.patch(
                `/notifications/${id}/read`
            );

            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) => {

                            if (
                                notification._id === id
                            ) {

                                return {
                                    ...notification,
                                    isRead: true
                                };
                            }

                            return notification;
                        }
                    )
            );

            setUnreadCount(
                (previousCount) =>
                    Math.max(
                        previousCount - 1,
                        0
                    )
            );

        } catch (error) {

            console.error(
                "Mark Notification Error:",
                error
            );
        }
    };


    /* =========================
       MARK ALL AS READ
    ========================= */

    const markAllAsRead = async () => {

        try {

            await api.patch(
                "/notifications/read-all"
            );

            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) => ({
                            ...notification,
                            isRead: true
                        })
                    )
            );

            setUnreadCount(0);

        } catch (error) {

            console.error(
                "Mark All Notifications Error:",
                error
            );
        }
    };


    /* =========================
       DELETE
    ========================= */

    const deleteNotification = async (id) => {

        try {

            const notification =
                notifications.find(
                    (item) =>
                        item._id === id
                );

            await api.delete(
                `/notifications/${id}`
            );

            setNotifications(
                (previousNotifications) =>
                    previousNotifications.filter(
                        (item) =>
                            item._id !== id
                    )
            );

            if (
                notification &&
                !notification.isRead
            ) {

                setUnreadCount(
                    (previousCount) =>
                        Math.max(
                            previousCount - 1,
                            0
                        )
                );
            }

        } catch (error) {

            console.error(
                "Delete Notification Error:",
                error
            );
        }
    };


    /* =========================
       FORMAT DATE
    ========================= */

    const formatDate = (date) => {

        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };


    return (

        <div className="min-h-screen bg-slate-950 text-white">

            {/* HEADER */}

            <section className="border-b border-slate-800 bg-slate-900">

                <div className="mx-auto max-w-5xl px-6 py-10">

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                                JobForge
                            </p>

                            <h1 className="mt-2 text-3xl font-bold">
                                Notifications
                            </h1>

                            <p className="mt-2 text-slate-400">
                                Stay updated about your applications.
                            </p>

                        </div>


                        {unreadCount > 0 && (

                            <button
                                onClick={markAllAsRead}
                                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-blue-500 hover:text-white"
                            >
                                Mark all as read
                            </button>
                        )}

                    </div>

                </div>

            </section>


            {/* CONTENT */}

            <main className="mx-auto max-w-5xl px-6 py-10">

                {/* STATS */}

                <div className="mb-8 grid gap-4 sm:grid-cols-2">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

                        <p className="text-sm text-slate-400">
                            Total Notifications
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {notifications.length}
                        </p>

                    </div>


                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

                        <p className="text-sm text-slate-400">
                            Unread
                        </p>

                        <p className="mt-2 text-3xl font-bold text-blue-400">
                            {unreadCount}
                        </p>

                    </div>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="py-20 text-center">

                        <p className="text-slate-400">
                            Loading notifications...
                        </p>

                    </div>
                )}


                {/* ERROR */}

                {!loading &&
                    error && (

                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
                            {error}
                        </div>
                    )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    notifications.length === 0 && (

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

                            <div className="text-4xl">
                                🔔
                            </div>

                            <h2 className="mt-4 text-xl font-bold">
                                No notifications
                            </h2>

                            <p className="mt-2 text-slate-400">
                                You're all caught up.
                            </p>

                            <Link
                                to="/jobs"
                                className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 font-semibold hover:bg-blue-500"
                            >
                                Browse Jobs
                            </Link>

                        </div>
                    )}


                {/* NOTIFICATIONS */}

                {!loading &&
                    !error &&
                    notifications.length > 0 && (

                        <div className="space-y-4">

                            {notifications.map(
                                (notification) => (

                                    <div
                                        key={
                                            notification._id
                                        }
                                        className={`rounded-2xl border p-5 transition ${
                                            notification.isRead
                                                ? "border-slate-800 bg-slate-900"
                                                : "border-blue-500/30 bg-blue-500/5"
                                        }`}
                                    >

                                        <div className="flex items-start gap-4">

                                            {/* ICON */}

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-lg">
                                                🔔
                                            </div>


                                            {/* CONTENT */}

                                            <div className="min-w-0 flex-1">

                                                <div className="flex flex-col justify-between gap-2 sm:flex-row">

                                                    <div>

                                                        <p className="font-semibold text-slate-100">
                                                            {notification.message}
                                                        </p>

                                                        <p className="mt-2 text-sm text-slate-500">
                                                            {formatDate(
                                                                notification.createdAt
                                                            )}
                                                        </p>

                                                    </div>


                                                    {!notification.isRead && (

                                                        <span className="h-fit rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                                                            New
                                                        </span>
                                                    )}

                                                </div>


                                                {/* ACTIONS */}

                                                <div className="mt-4 flex flex-wrap gap-3">

                                                    {!notification.isRead && (

                                                        <button
                                                            onClick={() =>
                                                                markAsRead(
                                                                    notification._id
                                                                )
                                                            }
                                                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-blue-500 hover:text-white"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}


                                                    {notification.relatedJob && (

                                                        <Link
                                                            to={`/jobs/${notification.relatedJob._id}`}
                                                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold hover:bg-blue-500"
                                                        >
                                                            View Job
                                                        </Link>
                                                    )}


                                                    <button
                                                        onClick={() =>
                                                            deleteNotification(
                                                                notification._id
                                                            )
                                                        }
                                                        className="rounded-lg border border-red-900 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

            </main>

        </div>
    );
}

export default Notifications;