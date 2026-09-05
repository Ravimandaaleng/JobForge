import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";


function AdminJobs() {

    const navigate = useNavigate();


    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [deletingId, setDeletingId] = useState(null);


    // ========================================
    // FETCH ALL JOBS
    // ========================================

    const fetchJobs = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await api.get(
                    "/admin/jobs"
                );


            setJobs(
                response.data.jobs
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load jobs"
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // LOAD JOBS
    // ========================================

    useEffect(() => {

        fetchJobs();

    }, []);


    // ========================================
    // DELETE JOB
    // ========================================

    const handleDelete = async (
        jobId,
        jobTitle
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${jobTitle}"?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeletingId(jobId);


            await api.delete(
                `/admin/jobs/${jobId}`
            );


            setJobs(
                (previousJobs) =>
                    previousJobs.filter(
                        (job) =>
                            job._id !== jobId
                    )
            );


        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete job"
            );

        } finally {

            setDeletingId(null);

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
                        💼
                    </div>

                    <p className="text-xl font-medium mt-4">
                        Loading jobs...
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
                        Failed to load jobs
                    </h2>

                    <p className="text-red-600 mt-3">
                        {error}
                    </p>

                    <button
                        onClick={fetchJobs}
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
                            JobForge Administration
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold mt-1">
                            Manage Jobs
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Review and manage all job postings.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                "/admin/dashboard"
                            )
                        }
                        className="bg-gray-800 text-white px-5 py-3 rounded-lg hover:bg-gray-900"
                    >
                        ← Dashboard
                    </button>

                </div>


                {/* ==================================
                    JOB COUNT
                ================================== */}

                <div className="bg-white p-6 rounded-xl shadow mt-8">

                    <p className="text-gray-500">
                        Total Job Postings
                    </p>

                    <p className="text-3xl font-bold mt-1">
                        {jobs.length}
                    </p>

                </div>


                {/* ==================================
                    NO JOBS
                ================================== */}

                {jobs.length === 0 ? (

                    <div className="bg-white mt-6 p-12 rounded-xl shadow text-center">

                        <div className="text-6xl">
                            💼
                        </div>

                        <h2 className="text-2xl font-bold mt-5">
                            No jobs found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            There are currently no job postings.
                        </p>

                    </div>

                ) : (

                    /* ==================================
                       JOB TABLE
                    ================================== */

                    <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-900 text-white">

                                    <tr>

                                        <th className="text-left px-6 py-4">
                                            Job
                                        </th>

                                        <th className="text-left px-6 py-4">
                                            Company
                                        </th>

                                        <th className="text-left px-6 py-4">
                                            Recruiter
                                        </th>

                                        <th className="text-left px-6 py-4">
                                            Location
                                        </th>

                                        <th className="text-left px-6 py-4">
                                            Type
                                        </th>

                                        <th className="text-left px-6 py-4">
                                            Salary
                                        </th>

                                        <th className="text-left px-6 py-4">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {jobs.map(
                                        (job) => {

                                            const isDeleting =
                                                deletingId ===
                                                job._id;


                                            return (

                                                <tr
                                                    key={
                                                        job._id
                                                    }
                                                    className="border-b hover:bg-gray-50"
                                                >


                                                    {/* JOB */}

                                                    <td className="px-6 py-5">

                                                        <div>

                                                            <p className="font-semibold">
                                                                {
                                                                    job.title
                                                                }
                                                            </p>

                                                            <p className="text-sm text-gray-500 mt-1">

                                                                {job.experience}

                                                            </p>

                                                        </div>

                                                    </td>


                                                    {/* COMPANY */}

                                                    <td className="px-6 py-5">

                                                        <p className="text-blue-600 font-medium">
                                                            {
                                                                job.company
                                                            }
                                                        </p>

                                                    </td>


                                                    {/* RECRUITER */}

                                                    <td className="px-6 py-5">

                                                        <p className="font-medium">
                                                            {
                                                                job.recruiter
                                                                    ?.name ||
                                                                "Unknown"
                                                            }
                                                        </p>

                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                job.recruiter
                                                                    ?.email ||
                                                                "No email"
                                                            }
                                                        </p>

                                                    </td>


                                                    {/* LOCATION */}

                                                    <td className="px-6 py-5">

                                                        <p className="text-gray-600">
                                                            📍{" "}
                                                            {
                                                                job.location
                                                            }
                                                        </p>

                                                    </td>


                                                    {/* TYPE */}

                                                    <td className="px-6 py-5">

                                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                            {
                                                                job.jobType
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* SALARY */}

                                                    <td className="px-6 py-5">

                                                        <p className="font-semibold">
                                                            ₹
                                                            {
                                                                job.salary
                                                            }
                                                        </p>

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td className="px-6 py-5">

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    job._id,
                                                                    job.title
                                                                )
                                                            }
                                                            disabled={
                                                                isDeleting
                                                            }
                                                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >

                                                            {isDeleting
                                                                ? "Deleting..."
                                                                : "Delete"}

                                                        </button>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}


export default AdminJobs;