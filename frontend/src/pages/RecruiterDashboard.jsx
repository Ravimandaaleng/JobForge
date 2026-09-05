import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function RecruiterDashboard() {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================
    // FETCH DASHBOARD DATA
    // ========================================

    const fetchDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            // Get recruiter's jobs
            const jobResponse = await api.get(
                "/jobs/my"
            );

            // Get applications for recruiter's jobs
            const applicationResponse =
                await api.get(
                    "/applications/recruiter"
                );

            setJobs(
                jobResponse.data.jobs
            );

            setApplications(
                applicationResponse.data.applications
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // LOAD DASHBOARD
    // ========================================

    useEffect(() => {

        fetchDashboard();

    }, []);


    // ========================================
    // GET STATISTICS FOR A JOB
    // ========================================

    const getJobStats = (jobId) => {

        const jobApplications =
            applications.filter(
                (application) =>
                    application.job?._id === jobId
            );

        const applied =
            jobApplications.filter(
                (application) =>
                    application.status === "applied"
            ).length;

        const shortlisted =
            jobApplications.filter(
                (application) =>
                    application.status === "shortlisted"
            ).length;

        const rejected =
            jobApplications.filter(
                (application) =>
                    application.status === "rejected"
            ).length;

        return {
            total: jobApplications.length,
            applied,
            shortlisted,
            rejected
        };

    };


    // ========================================
    // OVERALL STATISTICS
    // ========================================

    const totalApplicants =
        applications.length;

    const totalApplied =
        applications.filter(
            (application) =>
                application.status === "applied"
        ).length;

    const totalShortlisted =
        applications.filter(
            (application) =>
                application.status === "shortlisted"
        ).length;

    const totalRejected =
        applications.filter(
            (application) =>
                application.status === "rejected"
        ).length;


    // ========================================
    // DELETE JOB
    // ========================================

    const handleDelete = async (jobId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this job?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(
                `/jobs/${jobId}`
            );

            setJobs(
                (previousJobs) =>
                    previousJobs.filter(
                        (job) =>
                            job._id !== jobId
                    )
            );

            setApplications(
                (previousApplications) =>
                    previousApplications.filter(
                        (application) =>
                            application.job?._id !==
                            jobId
                    )
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete job"
            );

        }

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <div className="text-center">

                    <div className="text-5xl">
                        📊
                    </div>

                    <p className="text-xl font-medium mt-4">
                        Loading dashboard...
                    </p>

                </div>

            </div>

        );

    }


    // ========================================
    // ERROR
    // ========================================

    if (error) {

        return (

            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

                <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">

                    <div className="text-5xl">
                        ⚠️
                    </div>

                    <h2 className="text-2xl font-bold mt-4">
                        Failed to load dashboard
                    </h2>

                    <p className="text-red-600 mt-3">
                        {error}
                    </p>

                    <button
                        onClick={fetchDashboard}
                        className="mt-5 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    // ========================================
    // MAIN UI
    // ========================================

    return (

        <div className="min-h-screen bg-gray-100 p-6 md:p-8">

            <div className="max-w-7xl mx-auto">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                        <p className="text-blue-600 font-semibold">
                            Recruiter Panel
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold mt-1">
                            Dashboard
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Manage your jobs and track candidates.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                "/recruiter/create-job"
                            )
                        }
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        + Create New Job
                    </button>

                </div>


                {/* ==================================
                    OVERALL STATISTICS
                ================================== */}

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">


                    {/* Total Jobs */}

                    <div className="bg-white p-6 rounded-xl shadow">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500">
                                    Total Jobs
                                </p>

                                <p className="text-3xl font-bold mt-2">
                                    {jobs.length}
                                </p>

                            </div>

                            <div className="text-4xl">
                                💼
                            </div>

                        </div>

                    </div>


                    {/* Total Applicants */}

                    <div className="bg-white p-6 rounded-xl shadow">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500">
                                    Applicants
                                </p>

                                <p className="text-3xl font-bold mt-2">
                                    {totalApplicants}
                                </p>

                            </div>

                            <div className="text-4xl">
                                👥
                            </div>

                        </div>

                    </div>


                    {/* Shortlisted */}

                    <div className="bg-white p-6 rounded-xl shadow">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500">
                                    Shortlisted
                                </p>

                                <p className="text-3xl font-bold text-green-600 mt-2">
                                    {totalShortlisted}
                                </p>

                            </div>

                            <div className="text-4xl">
                                ✅
                            </div>

                        </div>

                    </div>


                    {/* Rejected */}

                    <div className="bg-white p-6 rounded-xl shadow">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500">
                                    Rejected
                                </p>

                                <p className="text-3xl font-bold text-red-600 mt-2">
                                    {totalRejected}
                                </p>

                            </div>

                            <div className="text-4xl">
                                ❌
                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    APPLICATION STATUS SUMMARY
                ================================== */}

                <div className="bg-white rounded-xl shadow p-6 mt-8">

                    <h2 className="text-xl font-bold">
                        Application Overview
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Current status of all applications.
                    </p>


                    <div className="grid md:grid-cols-3 gap-5 mt-6">


                        {/* Applied */}

                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-5">

                            <p className="text-yellow-700 font-semibold">
                                Applied
                            </p>

                            <p className="text-3xl font-bold text-yellow-700 mt-2">
                                {totalApplied}
                            </p>

                            <p className="text-sm text-yellow-600 mt-1">
                                Waiting for review
                            </p>

                        </div>


                        {/* Shortlisted */}

                        <div className="bg-green-50 border border-green-100 rounded-lg p-5">

                            <p className="text-green-700 font-semibold">
                                Shortlisted
                            </p>

                            <p className="text-3xl font-bold text-green-700 mt-2">
                                {totalShortlisted}
                            </p>

                            <p className="text-sm text-green-600 mt-1">
                                Candidates selected
                            </p>

                        </div>


                        {/* Rejected */}

                        <div className="bg-red-50 border border-red-100 rounded-lg p-5">

                            <p className="text-red-700 font-semibold">
                                Rejected
                            </p>

                            <p className="text-3xl font-bold text-red-700 mt-2">
                                {totalRejected}
                            </p>

                            <p className="text-sm text-red-600 mt-1">
                                Candidates rejected
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    JOB POSTINGS
                ================================== */}

                <div className="mt-10">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="text-2xl font-bold">
                                Your Job Postings
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Manage your active jobs and applicants.
                            </p>

                        </div>

                    </div>


                    {jobs.length === 0 ? (

                        <div className="bg-white mt-6 p-12 rounded-xl shadow text-center">

                            <div className="text-6xl">
                                💼
                            </div>

                            <h2 className="text-2xl font-bold mt-5">
                                No jobs posted yet
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Create your first job posting
                                to start receiving applications.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/recruiter/create-job"
                                    )
                                }
                                className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                            >
                                Create Your First Job
                            </button>

                        </div>

                    ) : (

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

                            {jobs.map((job) => {

                                const stats =
                                    getJobStats(
                                        job._id
                                    );

                                return (

                                    <div
                                        key={job._id}
                                        className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
                                    >


                                        {/* Job information */}

                                        <h3 className="text-xl font-bold">
                                            {job.title}
                                        </h3>

                                        <p className="text-blue-600 font-medium mt-1">
                                            {job.company}
                                        </p>


                                        <div className="mt-4 space-y-1 text-gray-600">

                                            <p>
                                                📍 {job.location}
                                            </p>

                                            <p>
                                                💼 {job.jobType}
                                            </p>

                                            <p>
                                                💰 ₹{job.salary}
                                            </p>

                                            <p>
                                                🎯 {job.experience}
                                            </p>

                                        </div>


                                        {/* Skills */}

                                        <div className="flex flex-wrap gap-2 mt-4">

                                            {job.skills.map(
                                                (
                                                    skill,
                                                    index
                                                ) => (

                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                                                    >
                                                        {skill}
                                                    </span>

                                                )
                                            )}

                                        </div>


                                        {/* =================================
                                            JOB APPLICATION STATISTICS
                                        ================================= */}

                                        <div className="border-t mt-5 pt-5">

                                            <div className="flex items-center justify-between">

                                                <p className="font-semibold">
                                                    Applicants
                                                </p>

                                                <span className="font-bold text-lg">
                                                    {stats.total}
                                                </span>

                                            </div>


                                            <div className="grid grid-cols-3 gap-2 mt-3">


                                                {/* Applied */}

                                                <div className="bg-yellow-50 rounded-lg p-3 text-center">

                                                    <p className="text-yellow-700 text-xs font-medium">
                                                        Applied
                                                    </p>

                                                    <p className="text-xl font-bold text-yellow-700">
                                                        {stats.applied}
                                                    </p>

                                                </div>


                                                {/* Shortlisted */}

                                                <div className="bg-green-50 rounded-lg p-3 text-center">

                                                    <p className="text-green-700 text-xs font-medium">
                                                        Selected
                                                    </p>

                                                    <p className="text-xl font-bold text-green-700">
                                                        {stats.shortlisted}
                                                    </p>

                                                </div>


                                                {/* Rejected */}

                                                <div className="bg-red-50 rounded-lg p-3 text-center">

                                                    <p className="text-red-700 text-xs font-medium">
                                                        Rejected
                                                    </p>

                                                    <p className="text-xl font-bold text-red-700">
                                                        {stats.rejected}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================
                                            ACTION BUTTONS
                                        ================================= */}

                                        <div className="flex gap-2 mt-6">

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/recruiter/edit-job/${job._id}`
                                                    )
                                                }
                                                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>


                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        job._id
                                                    )
                                                }
                                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                                            >
                                                Delete
                                            </button>

                                        </div>


                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/recruiter/applicants/${job._id}`
                                                )
                                            }
                                            className="w-full mt-2 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900"
                                        >
                                            View Applicants
                                        </button>

                                    </div>

                                );

                            })}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default RecruiterDashboard;