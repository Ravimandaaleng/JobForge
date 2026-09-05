import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function JobDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { user, token } = useAuth();

    const [job, setJob] = useState(null);

    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    const [alreadyApplied, setAlreadyApplied] =
        useState(false);

    const [applicationStatus, setApplicationStatus] =
        useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    /* =========================
       FETCH JOB
    ========================= */

    useEffect(() => {

        const fetchJob = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get(
                    `/jobs/${id}`
                );

                setJob(response.data.job);

            } catch (error) {

                console.error(
                    "Fetch Job Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load job"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchJob();

    }, [id]);


    /* =========================
       CHECK APPLICATION
    ========================= */

    useEffect(() => {

        const checkApplication = async () => {

            if (
                !token ||
                user?.role !== "student"
            ) {
                return;
            }

            try {

                const response = await api.get(
                    "/applications/my"
                );

                const applications =
                    response.data.applications || [];

                const existingApplication =
                    applications.find(
                        (application) => {

                            const jobId =
                                application.job?._id ||
                                application.job;

                            return (
                                jobId?.toString() ===
                                id
                            );
                        }
                    );

                if (existingApplication) {

                    setAlreadyApplied(true);

                    setApplicationStatus(
                        existingApplication.status
                    );
                }

            } catch (error) {

                console.error(
                    "Check Application Error:",
                    error
                );
            }
        };

        checkApplication();

    }, [id, token, user]);


    /* =========================
       APPLY FOR JOB
    ========================= */

    const handleApply = async () => {

        setMessage("");
        setError("");

        if (!token) {

            navigate("/login");

            return;
        }


        if (!user) {

            setError(
                "Please login to apply"
            );

            return;
        }


        if (user.role !== "student") {

            setError(
                "Only students can apply for jobs"
            );

            return;
        }


        if (alreadyApplied) {

            setMessage(
                "You have already applied for this job."
            );

            return;
        }


        try {

            setApplying(true);

            const response =
                await api.post(
                    `/applications/${id}`
                );

            setMessage(
                response.data.message ||
                "Application submitted successfully"
            );

            setAlreadyApplied(true);

            setApplicationStatus("applied");

        } catch (error) {

            console.error(
                "Apply Error:",
                error
            );

            const errorMessage =
                error.response?.data?.message ||
                "Failed to apply for this job";

            setError(errorMessage);

            /*
                Backend may detect duplicate
                application even if frontend
                didn't know about it.
            */

            if (
                error.response?.status === 400 &&
                errorMessage
                    .toLowerCase()
                    .includes("already")
            ) {
                setAlreadyApplied(true);
            }

        } finally {

            setApplying(false);
        }
    };


    /* =========================
       STATUS UI
    ========================= */

    const getStatusClass = () => {

        if (applicationStatus === "shortlisted") {
            return "bg-green-500/10 text-green-400 border-green-500/20";
        }

        if (applicationStatus === "rejected") {
            return "bg-red-500/10 text-red-400 border-red-500/20";
        }

        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    };


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-950 text-white">

                <div className="mx-auto max-w-7xl px-6 py-20 text-center">

                    <p className="text-lg text-slate-400">
                        Loading job...
                    </p>

                </div>

            </div>
        );
    }


    /* =========================
       ERROR / NOT FOUND
    ========================= */

    if (error && !job) {

        return (
            <div className="min-h-screen bg-slate-950 text-white">

                <div className="mx-auto max-w-7xl px-6 py-20 text-center">

                    <div className="rounded-2xl border border-red-900 bg-red-950/30 p-10">

                        <h1 className="text-2xl font-bold">
                            Unable to load job
                        </h1>

                        <p className="mt-3 text-red-400">
                            {error}
                        </p>

                        <Link
                            to="/jobs"
                            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 font-semibold hover:bg-blue-500"
                        >
                            Back to Jobs
                        </Link>

                    </div>

                </div>

            </div>
        );
    }


    if (!job) {
        return null;
    }


    return (

        <div className="min-h-screen bg-slate-950 text-white">

            {/* =========================
                HEADER
            ========================= */}

            <section className="border-b border-slate-800 bg-slate-900">

                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

                    <Link
                        to="/jobs"
                        className="text-sm text-blue-400 hover:text-blue-300"
                    >
                        ← Back to Jobs
                    </Link>

                    <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row">

                        <div>

                            <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                                {job.jobType}
                            </span>

                            <h1 className="mt-4 text-4xl font-bold tracking-tight">
                                {job.title}
                            </h1>

                            <p className="mt-2 text-xl text-blue-400">
                                {job.company}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-400">

                                <span>
                                    📍 {job.location}
                                </span>

                                <span>
                                    💰 ₹{job.salary.toLocaleString()}
                                </span>

                                <span>
                                    💼 {job.experience}
                                </span>

                            </div>

                        </div>


                        {/* =========================
                            APPLY AREA
                        ========================= */}

                        <div className="md:min-w-[220px]">

                            {!token && (

                                <button
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                    className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
                                >
                                    Login to Apply
                                </button>

                            )}


                            {token &&
                                user?.role === "student" &&
                                !alreadyApplied && (

                                    <button
                                        onClick={handleApply}
                                        disabled={applying}
                                        className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {applying
                                            ? "Applying..."
                                            : "Apply Now"}
                                    </button>
                                )}


                            {token &&
                                user?.role === "student" &&
                                alreadyApplied && (

                                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-5 text-center">

                                        <p className="font-semibold text-green-400">
                                            ✓ Already Applied
                                        </p>

                                        {applicationStatus && (

                                            <span
                                                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClass()}`}
                                            >
                                                {applicationStatus}
                                            </span>
                                        )}

                                    </div>
                                )}


                            {token &&
                                user?.role !== "student" && (

                                    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 text-center">

                                        <p className="text-sm text-slate-400">
                                            Only students can apply
                                            for jobs.
                                        </p>

                                    </div>
                                )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                CONTENT
            ========================= */}

            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

                <div className="grid gap-8 lg:grid-cols-3">

                    {/* DESCRIPTION */}

                    <section className="lg:col-span-2">

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

                            <h2 className="text-2xl font-bold">
                                Job Description
                            </h2>

                            <p className="mt-5 whitespace-pre-line leading-8 text-slate-400">
                                {job.description}
                            </p>

                        </div>


                        {/* SKILLS */}

                        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">

                            <h2 className="text-2xl font-bold">
                                Required Skills
                            </h2>

                            <div className="mt-5 flex flex-wrap gap-3">

                                {job.skills.map(
                                    (skill, index) => (

                                        <span
                                            key={index}
                                            className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300"
                                        >
                                            {skill}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    </section>


                    {/* SIDEBAR */}

                    <aside>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                            <h2 className="text-xl font-bold">
                                Job Overview
                            </h2>

                            <div className="mt-6 space-y-5">

                                <div>

                                    <p className="text-xs uppercase tracking-wide text-slate-500">
                                        Job Type
                                    </p>

                                    <p className="mt-1 text-slate-200">
                                        {job.jobType}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs uppercase tracking-wide text-slate-500">
                                        Location
                                    </p>

                                    <p className="mt-1 text-slate-200">
                                        {job.location}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs uppercase tracking-wide text-slate-500">
                                        Experience
                                    </p>

                                    <p className="mt-1 text-slate-200">
                                        {job.experience}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs uppercase tracking-wide text-slate-500">
                                        Salary
                                    </p>

                                    <p className="mt-1 text-slate-200">
                                        ₹{job.salary.toLocaleString()}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* RECRUITER */}

                        {job.recruiter && (

                            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

                                <h2 className="text-xl font-bold">
                                    Posted By
                                </h2>

                                <p className="mt-4 font-semibold text-slate-200">
                                    {job.recruiter.name}
                                </p>

                                <p className="mt-1 break-all text-sm text-slate-400">
                                    {job.recruiter.email}
                                </p>

                            </div>
                        )}

                    </aside>

                </div>


                {/* =========================
                    SUCCESS / ERROR
                ========================= */}

                {(message || error) && (

                    <div className="mt-8">

                        {message && (

                            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
                                {message}
                            </div>
                        )}

                        {error && job && (

                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                                {error}
                            </div>
                        )}

                    </div>
                )}

            </main>

        </div>
    );
}

export default JobDetails;