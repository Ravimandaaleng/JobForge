import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Navbar() {

    const {
        user,
        token,
        logout,
        unreadCount
    } = useAuth();


    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = () => {

        logout();

    };


    return (

        <nav className="border-b border-slate-800 bg-slate-900 text-white">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

                {/* LOGO */}

                <Link
                    to="/"
                    className="text-2xl font-bold text-white transition hover:text-blue-400"
                >
                    JobForge
                </Link>


                {/* NAVIGATION */}

                <div className="flex items-center gap-5">

                    {/* JOBS */}

                    <Link
                        to="/jobs"
                        className="transition hover:text-blue-400"
                    >
                        Jobs
                    </Link>


                    {/* PROFILE */}

                    {token && (

                        <Link
                            to="/profile"
                            className="transition hover:text-blue-400"
                        >
                            Profile
                        </Link>

                    )}


                    {/* MY APPLICATIONS */}

                    {user?.role === "student" && (

                        <Link
                            to="/my-applications"
                            className="transition hover:text-blue-400"
                        >
                            My Applications
                        </Link>

                    )}


                    {/* NOTIFICATIONS */}

                    {token && (

                        <Link
                            to="/notifications"
                            className="relative flex items-center gap-1 transition hover:text-blue-400"
                        >

                            <span className="text-xl">
                                🔔
                            </span>


                            {unreadCount > 0 && (

                                <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">

                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount}

                                </span>

                            )}

                        </Link>

                    )}


                    {/* RECRUITER DASHBOARD */}

                    {user?.role === "recruiter" && (

                        <Link
                            to="/recruiter/dashboard"
                            className="transition hover:text-blue-400"
                        >
                            Dashboard
                        </Link>

                    )}


                    {/* ADMIN DASHBOARD */}

                    {user?.role === "admin" && (

                        <Link
                            to="/admin/dashboard"
                            className="transition hover:text-blue-400"
                        >
                            Admin Dashboard
                        </Link>

                    )}


                    {/* LOGGED IN */}

                    {token && user ? (

                        <>

                            <span className="hidden border-l border-slate-700 pl-5 text-slate-300 sm:inline">

                                {user.name}

                            </span>


                            <button
                                onClick={handleLogout}
                                className="rounded-lg bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-500"
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        /* NOT LOGGED IN */

                        <>

                            <Link
                                to="/login"
                                className="transition hover:text-blue-400"
                            >
                                Login
                            </Link>


                            <Link
                                to="/register"
                                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold transition hover:bg-blue-500"
                            >
                                Register
                            </Link>

                        </>

                    )}

                </div>

            </div>

        </nav>

    );

}


export default Navbar;