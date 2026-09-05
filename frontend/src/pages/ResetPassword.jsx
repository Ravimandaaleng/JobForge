import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../api/axios";


function ResetPassword() {

    const navigate = useNavigate();

    const location = useLocation();


    // ========================================
    // EMAIL FROM FORGOT PASSWORD PAGE
    // ========================================

    const emailFromState =
        location.state?.email || "";


    const [email, setEmail] =
        useState(emailFromState);


    const [otp, setOtp] =
        useState("");


    const [newPassword, setNewPassword] =
        useState("");


    const [confirmPassword, setConfirmPassword] =
        useState("");


    const [message, setMessage] =
        useState("");


    const [error, setError] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    // ========================================
    // HANDLE RESET PASSWORD
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        // ==================================
        // VALIDATION
        // ==================================

        if (
            !email ||
            !otp ||
            !newPassword ||
            !confirmPassword
        ) {

            setError(
                "Please fill in all fields."
            );

            return;

        }


        if (otp.length !== 6) {

            setError(
                "OTP must be 6 digits."
            );

            return;

        }


        if (newPassword.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;

        }


        if (
            newPassword !==
            confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        // ==================================
        // API REQUEST
        // ==================================

        try {

            setLoading(true);


            const response =
                await api.post(
                    "/auth/reset-password",
                    {
                        email,
                        otp,
                        newPassword
                    }
                );


            setMessage(
                response.data.message
            );


            // ==================================
            // GO TO LOGIN
            // ==================================

            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (error) {

            setError(

                error.response?.data?.message ||
                "Password reset failed."

            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">


                {/* ==================================
                    HEADING
                ================================== */}

                <h1 className="text-3xl font-bold text-center text-blue-600">

                    Reset Password

                </h1>


                <p className="text-center text-gray-500 mt-2">

                    Enter the OTP sent to your email

                </p>


                {/* ==================================
                    FORM
                ================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >

                    {/* EMAIL */}

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />


                    {/* OTP */}

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength="6"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => {

                            const value =
                                e.target.value.replace(
                                    /\D/g,
                                    ""
                                );

                            setOtp(value);

                        }}
                        className="w-full border p-3 rounded-lg text-center text-xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />


                    {/* NEW PASSWORD */}

                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(
                                e.target.value
                            )
                        }
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        minLength="6"
                        required
                    />


                    {/* CONFIRM PASSWORD */}

                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(
                                e.target.value
                            )
                        }
                        className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        minLength="6"
                        required
                    />


                    {/* ==================================
                        SUCCESS
                    ================================== */}

                    {message && (

                        <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center">

                            {message}

                        </div>

                    )}


                    {/* ==================================
                        ERROR
                    ================================== */}

                    {error && (

                        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center">

                            {error}

                        </div>

                    )}


                    {/* ==================================
                        BUTTON
                    ================================== */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >

                        {loading
                            ? "Resetting Password..."
                            : "Reset Password"
                        }

                    </button>

                </form>


                {/* ==================================
                    LOGIN
                ================================== */}

                <p className="text-center mt-6">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        className="text-blue-600 font-semibold"
                    >

                        Back to Login

                    </button>

                </p>

            </div>

        </div>

    );

}


export default ResetPassword;