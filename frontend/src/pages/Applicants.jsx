import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function Applicants() {
    const { jobId } = useParams();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/applications/recruiter"
            );

            const allApplications =
                response.data.applications || [];

            const filteredApplications = jobId
                ? allApplications.filter(
                      (application) =>
                          application.job?._id === jobId
                  )
                : allApplications;

            setApplications(filteredApplications);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load applicants"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    const updateStatus = async (
        applicationId,
        status
    ) => {
        try {
            setUpdatingId(applicationId);
            setError("");

            await api.patch(
                `/applications/${applicationId}/status`,
                {
                    status
                }
            );

            setApplications((previous) =>
                previous.map((application) =>
                    application._id === applicationId
                        ? {
                              ...application,
                              status
                          }
                        : application
                )
            );

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update application"
            );

        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusStyle = (status) => {
        if (status === "shortlisted") {
            return "border-green-500/30 bg-green-500/10 text-green-400";
        }

        if (status === "rejected") {
            return "border-red-500/30 bg-red-500/10 text-red-400";
        }

        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
    };

    const formatStatus = (status) => {
        if (!status) {
            return "Applied";
        }

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1)
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Header */}
            <section className="border-b border-slate-800 bg-slate-900">
                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

                    <Link
                        to="/recruiter/dashboard"
                        className="text-sm text-blue-400 hover:text-blue-300"
                    >
                        ← Back to Dashboard
                    </Link>

                    <h1 className="mt-6 text-4xl font-bold">
                        Applicants
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Review candidates and manage their
                        application status.
                    </p>

                </div>
            </section>

            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

                {/* Statistics */}
                {!loading && !error && (
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                            <p className="text-sm text-slate-400">
                                Total Applicants
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {applications.length}
                            </p>
                        </div>

                        <div className="rounded-xl border border-yellow-500/20 bg-slate-900 p-5">
                            <p className="text-sm text-slate-400">
                                Applied
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

                        <div className="rounded-xl border border-red-500/20 bg-slate-900 p-5">
                            <p className="text-sm text-slate-400">
                                Rejected
                            </p>

                            <p className="mt-2 text-3xl font-bold text-red-400">
                                {
                                    applications.filter(
                                        (application) =>
                                            application.status ===
                                            "rejected"
                                    ).length
                                }
                            </p>
                        </div>

                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="py-20 text-center">

                        <div className="text-4xl">
                            ⏳
                        </div>

                        <p className="mt-4 text-slate-400">
                            Loading applicants...
                        </p>

                    </div>
                )}

                {/* No Applicants */}
                {!loading &&
                    applications.length === 0 && (
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

                            <div className="text-5xl">
                                👥
                            </div>

                            <h2 className="mt-5 text-2xl font-bold">
                                No applicants yet
                            </h2>

                            <p className="mt-3 text-slate-400">
                                Applications for your jobs will
                                appear here.
                            </p>

                        </div>
                    )}

                {/* Applicant Cards */}
                {!loading &&
                    applications.length > 0 && (
                        <div className="space-y-6">

                            {applications.map(
                                (application) => {
                                    const student =
                                        application.student;

                                    const job =
                                        application.job;

                                    return (
                                        <div
                                            key={
                                                application._id
                                            }
                                            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                                        >

                                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                                                {/* Candidate */}
                                                <div className="flex gap-4">

                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-2xl">
                                                        👤
                                                    </div>

                                                    <div>

                                                        <h2 className="text-xl font-bold">
                                                            {student?.name ||
                                                                "Unknown Candidate"}
                                                        </h2>

                                                        <p className="mt-1 text-sm text-slate-400">
                                                            {student?.email}
                                                        </p>

                                                        {job && (
                                                            <div className="mt-3">

                                                                <p className="text-xs uppercase tracking-wide text-slate-500">
                                                                    Applied For
                                                                </p>

                                                                <p className="mt-1 font-semibold text-blue-400">
                                                                    {
                                                                        job.title
                                                                    }
                                                                </p>

                                                                <p className="text-sm text-slate-400">
                                                                    {
                                                                        job.company
                                                                    }
                                                                </p>

                                                            </div>
                                                        )}

                                                    </div>

                                                </div>

                                                {/* Status */}
                                                <span
                                                    className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyle(
                                                        application.status
                                                    )}`}
                                                >
                                                    {formatStatus(
                                                        application.status
                                                    )}
                                                </span>

                                            </div>

                                            {/* Skills */}
                                            <div className="mt-6 border-t border-slate-800 pt-5">

                                                <p className="text-sm font-semibold text-slate-300">
                                                    Candidate Skills
                                                </p>

                                                <div className="mt-3 flex flex-wrap gap-2">

                                                    {student?.skills
                                                        ?.length >
                                                    0 ? (
                                                        student.skills.map(
                                                            (
                                                                skill,
                                                                index
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        index
                                                                    }
                                                                    className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300"
                                                                >
                                                                    {
                                                                        skill
                                                                    }
                                                                </span>
                                                            )
                                                        )
                                                    ) : (
                                                        <p className="text-sm text-slate-500">
                                                            No skills
                                                            added.
                                                        </p>
                                                    )}

                                                </div>

                                            </div>

                                            {/* Resume */}
                                            <div className="mt-6">

                                                <p className="text-sm font-semibold text-slate-300">
                                                    Resume
                                                </p>

                                                {student?.resume ? (
                                                    <a
                                                        href={`http://localhost:5000/${student.resume}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-3 inline-block rounded-lg border border-blue-500/30 px-5 py-2 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/10"
                                                    >
                                                        📄 View Resume
                                                    </a>
                                                ) : (
                                                    <p className="mt-2 text-sm text-slate-500">
                                                        No resume
                                                        uploaded.
                                                    </p>
                                                )}

                                            </div>

                                            {/* Applied Date */}
                                            <div className="mt-6">

                                                <p className="text-sm text-slate-500">
                                                    Applied on{" "}
                                                    {application.createdAt
                                                        ? new Date(
                                                              application.createdAt
                                                          ).toLocaleDateString(
                                                              "en-IN",
                                                              {
                                                                  day: "2-digit",
                                                                  month: "short",
                                                                  year: "numeric"
                                                              }
                                                          )
                                                        : "Unknown date"}
                                                </p>

                                            </div>

                                            {/* Actions */}
                                            <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-800 pt-5">

                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            application._id,
                                                            "shortlisted"
                                                        )
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                            application._id ||
                                                        application.status ===
                                                            "shortlisted"
                                                    }
                                                    className="rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    ✅ Shortlist
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            application._id,
                                                            "rejected"
                                                        )
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                            application._id ||
                                                        application.status ===
                                                            "rejected"
                                                    }
                                                    className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    ❌ Reject
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            application._id,
                                                            "applied"
                                                        )
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                            application._id ||
                                                        application.status ===
                                                            "applied"
                                                    }
                                                    className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-300 transition hover:border-yellow-500 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    ↩ Mark Applied
                                                </button>

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

export default Applicants;