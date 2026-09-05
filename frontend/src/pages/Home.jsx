import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-950 to-purple-600/20"></div>

                <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
                    <div className="max-w-3xl">

                        <div className="mb-6 inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                            🚀 Find your next opportunity
                        </div>

                        <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
                            Find a job.
                            <span className="block text-blue-400">
                                Build your future.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                            JobForge connects students, professionals and
                            recruiters in one simple platform. Discover jobs,
                            apply easily and build your career.
                        </p>

                        {/* Buttons */}
                        <div className="mt-8 flex flex-wrap gap-4">

                            <Link
                                to="/jobs"
                                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
                            >
                                Explore Jobs →
                            </Link>

                            {!user && (
                                <Link
                                    to="/register"
                                    className="rounded-lg border border-slate-600 px-6 py-3 font-semibold transition hover:border-blue-400 hover:text-blue-400"
                                >
                                    Get Started
                                </Link>
                            )}

                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="border-y border-slate-800 bg-slate-900/50">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold">
                            Everything you need
                        </h2>

                        <p className="mt-3 text-slate-400">
                            One platform for your complete job search journey.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">

                        {/* Student */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-blue-500/50">
                            <div className="mb-5 text-4xl">
                                🎓
                            </div>

                            <h3 className="text-xl font-semibold">
                                For Students
                            </h3>

                            <p className="mt-3 leading-7 text-slate-400">
                                Discover internships and jobs, build your
                                profile, upload your resume and track your
                                applications.
                            </p>

                            <Link
                                to="/jobs"
                                className="mt-6 inline-block text-blue-400 hover:text-blue-300"
                            >
                                Find Jobs →
                            </Link>
                        </div>

                        {/* Recruiter */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-purple-500/50">
                            <div className="mb-5 text-4xl">
                                💼
                            </div>

                            <h3 className="text-xl font-semibold">
                                For Recruiters
                            </h3>

                            <p className="mt-3 leading-7 text-slate-400">
                                Post job opportunities, manage your jobs,
                                view applicants and update application
                                statuses.
                            </p>

                            {!user && (
                                <Link
                                    to="/register"
                                    className="mt-6 inline-block text-purple-400 hover:text-purple-300"
                                >
                                    Hire Talent →
                                </Link>
                            )}

                            {user?.role === "recruiter" && (
                                <Link
                                    to="/recruiter/dashboard"
                                    className="mt-6 inline-block text-purple-400 hover:text-purple-300"
                                >
                                    Open Dashboard →
                                </Link>
                            )}
                        </div>

                        {/* Admin */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-emerald-500/50">
                            <div className="mb-5 text-4xl">
                                🛡️
                            </div>

                            <h3 className="text-xl font-semibold">
                                For Admins
                            </h3>

                            <p className="mt-3 leading-7 text-slate-400">
                                Manage users, monitor jobs, control platform
                                activity and view important statistics.
                            </p>

                            {user?.role === "admin" && (
                                <Link
                                    to="/admin/dashboard"
                                    className="mt-6 inline-block text-emerald-400 hover:text-emerald-300"
                                >
                                    Admin Dashboard →
                                </Link>
                            )}
                        </div>

                    </div>
                </div>
            </section>

            {/* Why JobForge */}
            <section>
                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

                    <div className="grid items-center gap-12 lg:grid-cols-2">

                        <div>
                            <p className="font-semibold text-blue-400">
                                WHY JOBFORGE?
                            </p>

                            <h2 className="mt-3 text-4xl font-bold">
                                Your complete job search platform.
                            </h2>

                            <p className="mt-5 leading-8 text-slate-400">
                                From discovering the right opportunity to
                                tracking your application, JobForge keeps
                                everything organized in one place.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">

                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                                <div className="text-3xl">🔍</div>
                                <h3 className="mt-4 font-semibold">
                                    Easy Job Search
                                </h3>
                                <p className="mt-2 text-sm text-slate-400">
                                    Search jobs by title, location, skill and
                                    job type.
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                                <div className="text-3xl">📄</div>
                                <h3 className="mt-4 font-semibold">
                                    Resume Upload
                                </h3>
                                <p className="mt-2 text-sm text-slate-400">
                                    Keep your resume ready for job
                                    applications.
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                                <div className="text-3xl">📊</div>
                                <h3 className="mt-4 font-semibold">
                                    Track Applications
                                </h3>
                                <p className="mt-2 text-sm text-slate-400">
                                    Know whether your application is applied,
                                    shortlisted or rejected.
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                                <div className="text-3xl">⚡</div>
                                <h3 className="mt-4 font-semibold">
                                    Simple Workflow
                                </h3>
                                <p className="mt-2 text-sm text-slate-400">
                                    Everything is designed to keep your job
                                    search simple.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            {!user && (
                <section className="border-t border-slate-800">
                    <div className="mx-auto max-w-4xl px-6 py-20 text-center">

                        <h2 className="text-4xl font-bold">
                            Ready to find your next opportunity?
                        </h2>

                        <p className="mt-4 text-slate-400">
                            Create your JobForge account and start exploring
                            opportunities today.
                        </p>

                        <Link
                            to="/register"
                            className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold transition hover:bg-blue-500"
                        >
                            Create Account
                        </Link>

                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-slate-900">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">

                    <p>
                        © 2026 JobForge. All rights reserved.
                    </p>

                    <p>
                        Built with React + Node.js + MongoDB
                    </p>

                </div>
            </footer>

        </div>
    );
}

export default Home;