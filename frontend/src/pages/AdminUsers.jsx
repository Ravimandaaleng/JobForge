
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";


function AdminUsers() {

    const navigate = useNavigate();


    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [updatingId, setUpdatingId] = useState(null);

    const [deletingId, setDeletingId] = useState(null);


    // ========================================
    // FETCH USERS
    // ========================================

    const fetchUsers = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get(
                    "/admin/users"
                );

            setUsers(
                response.data.users
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load users"
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // LOAD USERS
    // ========================================

    useEffect(() => {

        fetchUsers();

    }, []);


    // ========================================
    // CHANGE ROLE
    // ========================================

    const handleRoleChange = async (
        userId,
        newRole
    ) => {

        try {

            setUpdatingId(userId);

            const response =
                await api.patch(
                    `/admin/users/${userId}/role`,
                    {
                        role: newRole
                    }
                );


            setUsers(
                (previousUsers) =>
                    previousUsers.map(
                        (user) => {

                            if (
                                user._id === userId
                            ) {

                                return {
                                    ...user,
                                    role:
                                        response.data.user.role
                                };

                            }

                            return user;

                        }
                    )
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to update user role"
            );

        } finally {

            setUpdatingId(null);

        }

    };


    // ========================================
    // DELETE USER
    // ========================================

    const handleDelete = async (
        userId,
        userName
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${userName}?`
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeletingId(userId);

            await api.delete(
                `/admin/users/${userId}`
            );


            setUsers(
                (previousUsers) =>
                    previousUsers.filter(
                        (user) =>
                            user._id !== userId
                    )
            );

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to delete user"
            );

        } finally {

            setDeletingId(null);

        }

    };


    // ========================================
    // ROLE BADGE
    // ========================================

    const getRoleBadge = (role) => {

        if (role === "admin") {

            return (
                <span className="inline-flex bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Admin
                </span>
            );

        }


        if (role === "recruiter") {

            return (
                <span className="inline-flex bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Recruiter
                </span>
            );

        }


        return (
            <span className="inline-flex bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                Student
            </span>
        );

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <div className="text-center">

                    <div className="text-5xl">
                        👥
                    </div>

                    <p className="text-xl font-medium mt-4">
                        Loading users...
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
                        Failed to load users
                    </h2>

                    <p className="text-red-600 mt-3">
                        {error}
                    </p>

                    <button
                        onClick={fetchUsers}
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
                            Manage Users
                        </h1>

                        <p className="text-gray-600 mt-2">
                            View and manage all JobForge users.
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
                    USER COUNT
                ================================== */}

                <div className="bg-white p-6 rounded-xl shadow mt-8">

                    <p className="text-gray-500">
                        Total Users
                    </p>

                    <p className="text-3xl font-bold mt-1">
                        {users.length}
                    </p>

                </div>


                {/* ==================================
                    NO USERS
                ================================== */}

                {users.length === 0 ? (

                    <div className="bg-white mt-6 p-12 rounded-xl shadow text-center">

                        <div className="text-6xl">
                            👥
                        </div>

                        <h2 className="text-2xl font-bold mt-5">
                            No users found
                        </h2>

                    </div>

                ) : (

                    /* ==================================
                       DESKTOP TABLE
                    ================================== */

                    <div className="bg-white rounded-xl shadow mt-6 overflow-hidden">

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-900 text-white">

                                    <tr>

                                        <th className="text-left px-6 py-4">
                                            User
                                        </th>

                                        <th className="text-left px-6 py-4">
                                            Email
                                        </th>

                                        <th className="text-left px-6 py-4">
                                            Role
                                        </th>

                                        <th className="text-left px-6 py-4">
                                            Skills
                                        </th>

                                        <th className="text-left px-6 py-4">
                                            Joined
                                        </th>

                                        <th className="text-left px-6 py-4">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {users.map(
                                        (user) => {

                                            const isUpdating =
                                                updatingId ===
                                                user._id;

                                            const isDeleting =
                                                deletingId ===
                                                user._id;


                                            return (

                                                <tr
                                                    key={
                                                        user._id
                                                    }
                                                    className="border-b hover:bg-gray-50"
                                                >


                                                    {/* USER */}

                                                    <td className="px-6 py-5">

                                                        <div className="flex items-center gap-3">

                                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                                                                {user.name
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    ?.toUpperCase() ||
                                                                    "?"}

                                                            </div>

                                                            <div>

                                                                <p className="font-semibold">
                                                                    {
                                                                        user.name
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* EMAIL */}

                                                    <td className="px-6 py-5">

                                                        <p className="text-gray-600">
                                                            {
                                                                user.email
                                                            }
                                                        </p>

                                                    </td>


                                                    {/* ROLE */}

                                                    <td className="px-6 py-5">

                                                        {getRoleBadge(
                                                            user.role
                                                        )}

                                                    </td>


                                                    {/* SKILLS */}

                                                    <td className="px-6 py-5">

                                                        {user.skills?.length >
                                                        0 ? (

                                                            <div className="flex flex-wrap gap-1 max-w-xs">

                                                                {user.skills
                                                                    .slice(
                                                                        0,
                                                                        3
                                                                    )
                                                                    .map(
                                                                        (
                                                                            skill,
                                                                            index
                                                                        ) => (

                                                                            <span
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                                                            >
                                                                                {
                                                                                    skill
                                                                                }
                                                                            </span>

                                                                        )
                                                                    )}

                                                                {user.skills.length >
                                                                    3 && (

                                                                    <span className="text-xs text-gray-500 px-2 py-1">

                                                                        +
                                                                        {
                                                                            user
                                                                                .skills
                                                                                .length -
                                                                            3
                                                                        }

                                                                        more

                                                                    </span>

                                                                )}

                                                            </div>

                                                        ) : (

                                                            <span className="text-gray-400 text-sm">
                                                                No skills
                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* JOINED */}

                                                    <td className="px-6 py-5">

                                                        <p className="text-gray-600 text-sm">

                                                            {user.createdAt
                                                                ? new Date(
                                                                    user.createdAt
                                                                ).toLocaleDateString(
                                                                    "en-IN",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        year: "numeric"
                                                                    }
                                                                )
                                                                : "Unknown"}

                                                        </p>

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td className="px-6 py-5">

                                                        <div className="flex flex-col gap-2">


                                                            {/* CHANGE ROLE */}

                                                            <select
                                                                value={
                                                                    user.role
                                                                }
                                                                disabled={
                                                                    isUpdating ||
                                                                    isDeleting
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handleRoleChange(
                                                                        user._id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="border border-gray-300 px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                                                            >

                                                                <option value="student">
                                                                    Student
                                                                </option>

                                                                <option value="recruiter">
                                                                    Recruiter
                                                                </option>

                                                                <option value="admin">
                                                                    Admin
                                                                </option>

                                                            </select>


                                                            {/* DELETE */}

                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user._id,
                                                                        user.name
                                                                    )
                                                                }
                                                                disabled={
                                                                    isUpdating ||
                                                                    isDeleting
                                                                }
                                                                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >

                                                                {isDeleting
                                                                    ? "Deleting..."
                                                                    : "Delete"}

                                                            </button>

                                                        </div>

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


export default AdminUsers;
