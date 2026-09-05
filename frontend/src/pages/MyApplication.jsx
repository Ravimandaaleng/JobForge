import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axios";


function MyApplications() {

    const [applications, setApplications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ========================================
    // FETCH APPLICATIONS
    // ========================================

    const fetchApplications = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/applications/my"
                );


            setApplications(
                response.data.applications || []
            );

        } catch (error) {

            console.error(error);


            setError(
                error.response?.data?.message ||
                "Failed to load applications"
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // LOAD APPLICATIONS
    // ========================================

    useEffect(() => {

        fetchApplications();

    }, []);


    // ========================================
    // STATUS STYLE
    // ========================================

    const getStatusStyle = (status) => {

        if (status === "shortlisted") {

            return "border-green-500/30 bg-green-500/10 text-green-400";

        }


        if (status === "rejected") {

            return "border-red-500/30 bg-red-500/10 text-red-400";

        }


        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";

    };


    // ========================================
    // STATUS ICON
    // ========================================

    const getStatusIcon = (status) => {

        if (status === "shortlisted") {

            return "✅";

        }


        if (status === "rejected") {

            return "❌";

        }


        return "⏳";

    };


    // ========================================
    // STATUS TEXT
    // ========================================

    const formatStatus = (status) => {

        if (!status) {

            return "Applied";

        }


        return (
            status.charAt(0).toUpperCase() +
            status.slice(1)
        );

    };


    // ========================================
    // DATE FORMATTER
    // ========================================

    const formatDate = (date) => {

        if (!date) {

            return "Unknown date";

        }


        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // ========================================
    // TIME FORMATTER
    // ========================================

    const formatTime = (date) => {

        if (!date) {

            return "";

        }


        return new Date(date).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // ========================================
    // STATUS TIMELINE
    // ========================================

    const StatusTimeline = ({ application }) => {

        let history =
            application.statusHistory || [];


        // ====================================
        // BACKWARD COMPATIBILITY
        // ====================================

        // If old applications don't have
        // statusHistory, create an Applied entry.

        if (history.length === 0) {

            history = [
                {
                    status: "applied",
                    changedAt:
                        application.createdAt
                }
            ];

        }


        return (

            <div className="mt-6 border-t border-slate-800 pt-6">

                <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">

                    Application Status

                </h3>


                <div className="relative ml-2">

                    {history.map(
                        (item, index) => {

                            const isLast =
                                index ===
                                history.length - 1;


                            return (

                                <div
                                    key={`${item.status}-${item.changedAt}-${index}`}
                                    className="relative flex gap-4"
                                >

                                    {/* Vertical Line */}

                                    {!isLast && (

                                        <div className="absolute left-[7px] top-5 h-full w-px bg-slate-700" />

                                    )}


                                    {/* Circle */}

                                    <div
                                        className={`relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                                            item.status ===
                                            "shortlisted"
                                                ? "border-green-400 bg-green-400"
                                                : item.status ===
                                                  "rejected"
                                                ? "border-red-400 bg-red-400"
                                                : "border-yellow-400 bg-yellow-400"
                                        }`}
                                    />


                                    {/* Content */}

                                    <div
                                        className={`pb-6 ${
                                            isLast
                                                ? "pb-1"
                                                : ""
                                        }`}
                                    >

                                        <p className="font-semibold text-white">

                                            {getStatusIcon(
                                                item.status
                                            )}{" "}

                                            {formatStatus(
                                                item.status
                                            )}

                                        </p>


                                        <p className="mt-1 text-sm text-slate-500">

                                            {formatDate(
                                                item.changedAt
                                            )}

                                            {item.changedAt && (
                                                <>
                                                    {" • "}
                                                    {formatTime(
                                                        item.changedAt
                                                    )}
                                                </>
                                            )}

                                        </p>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            </div>

        );

    };


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="min-h-screen bg-slate-950 text-white">

            {/* ================================== */}
            {/* HEADER */}
            {/* ================================== */}

            <section className="border-b border-slate-800 bg-slate-900">

                <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">

                    <h1 className="text-4xl font-bold">

                        My Applications

                    </h1>


                    <p className="mt-3 text-slate-400">

                        Track all the jobs you have
                        applied for.

                    </p>

                </div>

            </section>


            {/* ================================== */}
            {/* MAIN */}
            {/* ================================== */}

            <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">

                {/* ================================== */}
                {/* STATISTICS */}
                {/* ================================== */}

                {!loading && !error && (

                    <div className="mb-8 grid gap-4 sm:grid-cols-3">

                        {/* Total */}

                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                            <p className="text-sm text-slate-400">

                                Total Applications

                            </p>


                            <p className="mt-2 text-3xl font-bold">

                                {applications.length}

                            </p>

                        </div>


                        {/* Shortlisted */}

                        <div className="rounded-xl border border-green-500/20 bg-slate-900 p-5">

                            <p className="text-sm text-slate-400">

                                Shortlisted

                            </p>


                            <p className="mt-2 text-3xl font-bold text-green-400">

                                {
                                    applications.filter(
                                        (application) =>
                                            application.status ===
                                            "shortlisted"
                                    ).length
                                }

                            </p>

                        </div>


                        {/* Pending */}

                        <div className="rounded-xl border border-yellow-500/20 bg-slate-900 p-5">

                            <p className="text-sm text-slate-400">

                                Pending

                            </p>


                            <p className="mt-2 text-3xl font-bold text-yellow-400">

                                {
                                    applications.filter(
                                        (application) =>
                                            application.status ===
                                            "applied"
                                    ).length
                                }

                            </p>

                        </div>

                    </div>

                )}


                {/* ================================== */}
                {/* LOADING */}
                {/* ================================== */}

                {loading && (

                    <div className="py-20 text-center">

                        <div className="text-4xl">

                            ⏳

                        </div>


                        <p className="mt-4 text-slate-400">

                            Loading applications...

                        </p>

                    </div>

                )}


                {/* ================================== */}
                {/* ERROR */}
                {/* ================================== */}

                {!loading && error && (

                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">

                        <div className="text-4xl">

                            ⚠️

                        </div>


                        <p className="mt-4 text-red-400">

                            {error}

                        </p>


                        <button
                            onClick={fetchApplications}
                            className="mt-5 rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-500"
                        >

                            Try Again

                        </button>

                    </div>

                )}


                {/* ================================== */}
                {/* EMPTY */}
                {/* ================================== */}

                {!loading &&
                    !error &&
                    applications.length === 0 && (

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

                            <div className="text-5xl">

                                📭

                            </div>


                            <h2 className="mt-5 text-2xl font-bold">

                                No applications yet

                            </h2>


                            <p className="mt-3 text-slate-400">

                                Start exploring jobs and
                                apply to opportunities
                                that match your skills.

                            </p>


                            <Link
                                to="/jobs"
                                className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
                            >

                                Browse Jobs →

                            </Link>

                        </div>

                    )}


                {/* ================================== */}
                {/* APPLICATIONS */}
                {/* ================================== */}

                {!loading &&
                    !error &&
                    applications.length > 0 && (

                        <div className="space-y-5">

                            {applications.map(
                                (application) => {

                                    const job =
                                        application.job;


                                    return (

                                        <div
                                            key={application._id}
                                            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                                        >

                                            {/* ============================== */}
                                            {/* TOP SECTION */}
                                            {/* ============================== */}

                                            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                                                {/* Job information */}

                                                <div className="flex gap-4">

                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">

                                                        💼

                                                    </div>


                                                    <div>

                                                        <h2 className="text-xl font-bold">

                                                            {job?.title ||
                                                                "Job unavailable"}

                                                        </h2>


                                                        <p className="mt-1 text-slate-400">

                                                            {job?.company ||
                                                                "Company unavailable"}

                                                        </p>


                                                        {job && (

                                                            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">

                                                                <span>

                                                                    📍{" "}
                                                                    {job.location}

                                                                </span>


                                                                <span>

                                                                    🕒{" "}
                                                                    {job.jobType}

                                                                </span>


                                                                <span>

                                                                    💰 ₹
                                                                    {job.salary?.toLocaleString()}

                                                                </span>

                                                            </div>

                                                        )}

                                                    </div>

                                                </div>


                                                {/* Current Status */}

                                                <div
                                                    className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyle(
                                                        application.status
                                                    )}`}
                                                >

                                                    {getStatusIcon(
                                                        application.status
                                                    )}{" "}

                                                    {formatStatus(
                                                        application.status
                                                    )}

                                                </div>

                                            </div>


                                            {/* ============================== */}
                                            {/* STATUS TIMELINE */}
                                            {/* ============================== */}

                                            <StatusTimeline
                                                application={
                                                    application
                                                }
                                            />


                                            {/* ============================== */}
                                            {/* BOTTOM */}
                                            {/* ============================== */}

                                            <div className="mt-6 flex flex-col gap-4 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">

                                                <div className="text-sm text-slate-500">

                                                    Applied on{" "}

                                                    {formatDate(
                                                        application.createdAt
                                                    )}

                                                </div>


                                                {job?._id && (

                                                    <Link
                                                        to={`/jobs/${job._id}`}
                                                        className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-semibold transition hover:border-blue-500 hover:text-blue-400"
                                                    >

                                                        View Job

                                                    </Link>

                                                )}

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

            </main>

        </div>

    );

}


export default MyApplications;