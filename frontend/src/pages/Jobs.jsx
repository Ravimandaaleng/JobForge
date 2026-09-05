import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Jobs() {

    const [jobs, setJobs] = useState([]);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [skill, setSkill] = useState("");
    const [sort, setSort] = useState("");

    const [debouncedSearch, setDebouncedSearch] =
        useState("");

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        totalJobs: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* =========================
       SEARCH DEBOUNCE
    ========================= */

    useEffect(() => {

        const timer = setTimeout(() => {

            setDebouncedSearch(search);

            setPage(1);

        }, 500);


        return () => {
            clearTimeout(timer);
        };

    }, [search]);


    /* =========================
       FETCH JOBS
    ========================= */

    useEffect(() => {

        const fetchJobs = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await api.get(
                    "/jobs",
                    {
                        params: {
                            search: debouncedSearch,
                            location,
                            jobType,
                            skill,
                            sort,
                            page,
                            limit: 10
                        }
                    }
                );

                setJobs(
                    response.data.jobs
                );

                setPagination({

                    totalJobs:
                        response.data.totalJobs,

                    totalPages:
                        response.data.totalPages,

                    hasNextPage:
                        response.data.hasNextPage,

                    hasPreviousPage:
                        response.data.hasPreviousPage
                });

            } catch (error) {

                console.error(
                    "Fetch Jobs Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load jobs"
                );

            } finally {

                setLoading(false);
            }
        };


        fetchJobs();

    }, [
        debouncedSearch,
        location,
        jobType,
        skill,
        sort,
        page
    ]);


    /* =========================
       FILTER HANDLERS
    ========================= */

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };


    const handleLocationChange = (e) => {

        setLocation(e.target.value);
        setPage(1);
    };


    const handleJobTypeChange = (e) => {

        setJobType(e.target.value);
        setPage(1);
    };


    const handleSkillChange = (e) => {

        setSkill(e.target.value);
        setPage(1);
    };


    const handleSortChange = (e) => {

        setSort(e.target.value);
        setPage(1);
    };


    /* =========================
       CLEAR FILTERS
    ========================= */

    const clearFilters = () => {

        setSearch("");
        setDebouncedSearch("");

        setLocation("");
        setJobType("");
        setSkill("");
        setSort("");

        setPage(1);
    };


    /* =========================
       PAGINATION
    ========================= */

    const handlePrevious = () => {

        if (pagination.hasPreviousPage) {

            setPage(
                (previousPage) =>
                    previousPage - 1
            );
        }
    };


    const handleNext = () => {

        if (pagination.hasNextPage) {

            setPage(
                (previousPage) =>
                    previousPage + 1
            );
        }
    };


    return (

        <div className="min-h-screen bg-slate-950 text-white">

            {/* =========================
                HEADER
            ========================= */}

            <section className="border-b border-slate-800 bg-slate-900">

                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
                        JobForge
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight">
                        Find your next opportunity
                    </h1>

                    <p className="mt-3 max-w-2xl text-slate-400">
                        Search opportunities and find
                        the job that matches your skills.
                    </p>

                </div>

            </section>


            {/* =========================
                SEARCH + FILTERS
            ========================= */}

            <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

                        {/* Search */}

                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={search}
                            onChange={handleSearchChange}
                            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                        />


                        {/* Location */}

                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={handleLocationChange}
                            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                        />


                        {/* Job Type */}

                        <select
                            value={jobType}
                            onChange={handleJobTypeChange}
                            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                        >

                            <option value="">
                                All Job Types
                            </option>

                            <option value="Full-time">
                                Full-time
                            </option>

                            <option value="Part-time">
                                Part-time
                            </option>

                            <option value="Internship">
                                Internship
                            </option>

                            <option value="Contract">
                                Contract
                            </option>

                        </select>


                        {/* Skill */}

                        <input
                            type="text"
                            placeholder="Skill e.g. React"
                            value={skill}
                            onChange={handleSkillChange}
                            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                        />


                        {/* Sort */}

                        <select
                            value={sort}
                            onChange={handleSortChange}
                            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                        >

                            <option value="">
                                Sort By
                            </option>

                            <option value="newest">
                                Newest
                            </option>

                            <option value="oldest">
                                Oldest
                            </option>

                            <option value="salary-high">
                                Salary: High → Low
                            </option>

                            <option value="salary-low">
                                Salary: Low → High
                            </option>

                        </select>

                    </div>


                    <div className="mt-5 flex items-center justify-between">

                        <p className="text-sm text-slate-400">
                            {pagination.totalJobs} jobs found
                        </p>

                        <button
                            onClick={clearFilters}
                            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                        >
                            Clear Filters
                        </button>

                    </div>

                </div>

            </section>


            {/* =========================
                JOB LIST
            ========================= */}

            <main className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">

                {loading && (

                    <div className="py-20 text-center">

                        <p className="text-lg text-slate-400">
                            Loading jobs...
                        </p>

                    </div>
                )}


                {!loading &&
                    error && (

                        <div className="rounded-xl border border-red-900 bg-red-950/40 p-6 text-center">

                            <p className="text-red-400">
                                {error}
                            </p>

                        </div>
                    )}


                {!loading &&
                    !error &&
                    jobs.length === 0 && (

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

                            <h2 className="text-xl font-semibold">
                                No jobs found
                            </h2>

                            <p className="mt-2 text-slate-400">
                                Try changing your search
                                or filters.
                            </p>

                        </div>
                    )}


                {!loading &&
                    !error &&
                    jobs.length > 0 && (

                        <div className="grid gap-6 md:grid-cols-2">

                            {jobs.map((job) => (

                                <div
                                    key={job._id}
                                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/50"
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <div>

                                            <h2 className="text-xl font-bold">
                                                {job.title}
                                            </h2>

                                            <p className="mt-1 text-blue-400">
                                                {job.company}
                                            </p>

                                        </div>

                                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                                            {job.jobType}
                                        </span>

                                    </div>


                                    <div className="mt-5 space-y-2 text-sm text-slate-400">

                                        <p>
                                            📍 {job.location}
                                        </p>

                                        <p>
                                            💰 ₹{job.salary.toLocaleString()}
                                        </p>

                                        <p>
                                            💼 {job.experience}
                                        </p>

                                    </div>


                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-400">
                                        {job.description}
                                    </p>


                                    <div className="mt-5 flex flex-wrap gap-2">

                                        {job.skills.map(
                                            (item, index) => (

                                                <span
                                                    key={index}
                                                    className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                                                >
                                                    {item}
                                                </span>

                                            )
                                        )}

                                    </div>


                                    <div className="mt-6 border-t border-slate-800 pt-5">

                                        <Link
                                            to={`/jobs/${job._id}`}
                                            className="inline-flex rounded-lg bg-blue-600 px-5 py-2.5 font-semibold transition hover:bg-blue-500"
                                        >
                                            View Job
                                        </Link>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}


                {/* =========================
                    PAGINATION
                ========================= */}

                {!loading &&
                    !error &&
                    pagination.totalPages > 0 && (

                        <div className="mt-10 flex items-center justify-center gap-6">

                            <button
                                onClick={handlePrevious}
                                disabled={
                                    !pagination.hasPreviousPage
                                }
                                className="rounded-lg border border-slate-700 px-5 py-2.5 font-semibold transition hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                ← Previous
                            </button>


                            <div className="text-sm text-slate-400">

                                Page{" "}

                                <span className="font-semibold text-white">
                                    {page}
                                </span>

                                {" "}of{" "}

                                <span className="font-semibold text-white">
                                    {pagination.totalPages}
                                </span>

                            </div>


                            <button
                                onClick={handleNext}
                                disabled={
                                    !pagination.hasNextPage
                                }
                                className="rounded-lg border border-slate-700 px-5 py-2.5 font-semibold transition hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next →
                            </button>

                        </div>
                    )}

            </main>

        </div>
    );
}

export default Jobs;