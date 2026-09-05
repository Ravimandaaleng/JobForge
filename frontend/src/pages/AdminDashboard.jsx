
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";


function AdminDashboard() {

    const navigate = useNavigate();


    const [statistics, setStatistics] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================
    // FETCH ADMIN DASHBOARD
    // ========================================

    const fetchDashboard = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/admin/dashboard"
                );


            setStatistics(
                response.data.statistics
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load admin dashboard"
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
                        Loading admin dashboard...
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
                        Access Error
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
    // MAIN DASHBOARD
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
                            JobForge Administration
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold mt-1">
                            Admin Dashboard
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Monitor users, jobs, and applications.
                        </p>

                    </div>


                    {/* Manage Users */}

                    <button
                        onClick={() =>
                            navigate(
                                "/admin/users"
                            )
                        }
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Manage Users
                    </button>

                </div>


                {/* ==================================
                    USER STATISTICS
                ================================== */}

                <div className="mt-8">

                    <h2 className="text-xl font-bold">
                        Users
                    </h2>


                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">


                        {/* Total Users */}

                        <div className="bg-white p-6 rounded-xl shadow">

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-gray-500">
                                        Total Users
                                    </p>

                                    <p className="text-3xl font-bold mt-2">
                                        {statistics.totalUsers}
                                    </p>

                                </div>

                                <div className="text-4xl">
                                    👥
                                </div>

                            </div>

                        </div>


                        {/* Students */}

                        <div className="bg-white p-6 rounded-xl shadow">

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-gray-500">
                                        Students
                                    </p>

                                    <p className="text-3xl font-bold text-blue-600 mt-2">
                                        {statistics.totalStudents}
                                    </p>

                                </div>

                                <div className="text-4xl">
                                    🎓
                                </div>

                            </div>

                        </div>


                        {/* Recruiters */}

                        <div className="bg-white p-6 rounded-xl shadow">

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-gray-500">
                                        Recruiters
                                    </p>

                                    <p className="text-3xl font-bold text-purple-600 mt-2">
                                        {statistics.totalRecruiters}
                                    </p>

                                </div>

                                <div className="text-4xl">
                                    💼
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    JOB & APPLICATION STATISTICS
                ================================== */}

                <div className="mt-10">

                    <h2 className="text-xl font-bold">
                        Jobs & Applications
                    </h2>


                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">


                        {/* Total Jobs */}

                        <div className="bg-white p-6 rounded-xl shadow">

                            <p className="text-gray-500">
                                Total Jobs
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                {statistics.totalJobs}
                            </p>

                        </div>


                        {/* Total Applications */}

                        <div className="bg-white p-6 rounded-xl shadow">

                            <p className="text-gray-500">
                                Total Applications
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                {statistics.totalApplications}
                            </p>

                        </div>


                        {/* Applied */}

                        <div className="bg-white p-6 rounded-xl shadow">

                            <p className="text-gray-500">
                                Pending Applications
                            </p>

                            <p className="text-3xl font-bold text-yellow-600 mt-2">
                                {statistics.appliedApplications}
                            </p>

                        </div>


                        {/* Shortlisted */}

                        <div className="bg-white p-6 rounded-xl shadow">

                            <p className="text-gray-500">
                                Shortlisted
                            </p>

                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {statistics.shortlistedApplications}
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    APPLICATION OVERVIEW
                ================================== */}

                <div className="bg-white rounded-xl shadow p-6 mt-10">

                    <h2 className="text-xl font-bold">
                        Application Overview
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Current application status across JobForge.
                    </p>


                    <div className="grid md:grid-cols-3 gap-5 mt-6">


                        {/* Applied */}

                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-5">

                            <p className="text-yellow-700 font-semibold">
                                Applied
                            </p>

                            <p className="text-3xl font-bold text-yellow-700 mt-2">
                                {statistics.appliedApplications}
                            </p>

                            <p className="text-sm text-yellow-600 mt-1">
                                Awaiting recruiter review
                            </p>

                        </div>


                        {/* Shortlisted */}

                        <div className="bg-green-50 border border-green-100 rounded-lg p-5">

                            <p className="text-green-700 font-semibold">
                                Shortlisted
                            </p>

                            <p className="text-3xl font-bold text-green-700 mt-2">
                                {statistics.shortlistedApplications}
                            </p>

                            <p className="text-sm text-green-600 mt-1">
                                Candidates shortlisted
                            </p>

                        </div>


                        {/* Rejected */}

                        <div className="bg-red-50 border border-red-100 rounded-lg p-5">

                            <p className="text-red-700 font-semibold">
                                Rejected
                            </p>

                            <p className="text-3xl font-bold text-red-700 mt-2">
                                {statistics.rejectedApplications}
                            </p>

                            <p className="text-sm text-red-600 mt-1">
                                Applications rejected
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================
                    QUICK ACTIONS
                ================================== */}

                <div className="grid md:grid-cols-2 gap-6 mt-10">


                    {/* Manage Users */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <div className="text-4xl">
                            👥
                        </div>

                        <h2 className="text-xl font-bold mt-4">
                            User Management
                        </h2>

                        <p className="text-gray-500 mt-2">
                            View students and recruiters,
                            change their roles, or remove
                            accounts.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/users"
                                )
                            }
                            className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Manage Users
                        </button>

                    </div>


                    {/* Future Job Management */}

                    <div className="bg-white rounded-xl shadow p-6">

                        <div className="text-4xl">
                            💼
                        </div>

                        <h2 className="text-xl font-bold mt-4">
                            Job Management
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Manage job postings and
                            monitor jobs created by recruiters.
                        </p>

                        <button
    onClick={() =>
        navigate("/admin/jobs")
    }
    className="mt-5 bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900"
>
    Manage Jobs
</button>

                    </div>

                </div>


                {/* ==================================
                    SUMMARY
                ================================== */}

                <div className="bg-gray-900 text-white rounded-xl p-8 mt-10">

                    <h2 className="text-2xl font-bold">
                        JobForge Summary
                    </h2>


                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">


                        <div>

                            <p className="text-gray-400">
                                Users
                            </p>

                            <p className="text-2xl font-bold mt-1">
                                {statistics.totalUsers}
                            </p>

                        </div>


                        <div>

                            <p className="text-gray-400">
                                Recruiters
                            </p>

                            <p className="text-2xl font-bold mt-1">
                                {statistics.totalRecruiters}
                            </p>

                        </div>


                        <div>

                            <p className="text-gray-400">
                                Jobs
                            </p>

                            <p className="text-2xl font-bold mt-1">
                                {statistics.totalJobs}
                            </p>

                        </div>


                        <div>

                            <p className="text-gray-400">
                                Applications
                            </p>

                            <p className="text-2xl font-bold mt-1">
                                {statistics.totalApplications}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default AdminDashboard;

