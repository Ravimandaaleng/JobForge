import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../api/axios";


function EmailOTP() {

    const navigate = useNavigate();

    const location = useLocation();


    // Email passed from Register page
    const email =
        location.state?.email || "";


    const [otp, setOtp] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const [resending, setResending] = useState(false);


    // ========================================
    // VERIFY OTP
    // ========================================

    const handleVerifyOTP = async (e) => {

        e.preventDefault();


        setMessage("");

        setError("");


        if (!otp) {

            setError("Please enter the OTP.");

            return;

        }


        if (otp.length !== 6) {

            setError("OTP must be 6 digits.");

            return;

        }


        try {

            setLoading(true);


            const response =
                await api.post(
                    "/auth/verify-email-otp",
                    {
                        email,
                        otp
                    }
                );


            setMessage(
                response.data.message
            );


            // Go to login after successful verification
            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (error) {

            setError(

                error.response?.data?.message ||
                "OTP verification failed."

            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // RESEND OTP
    // ========================================

    const handleResendOTP = async () => {

        setMessage("");

        setError("");


        if (!email) {

            setError(
                "Email address is missing. Please register again."
            );

            return;

        }


        try {

            setResending(true);


            const response =
                await api.post(
                    "/auth/resend-email-otp",
                    {
                        email
                    }
                );


            setMessage(
                response.data.message
            );


        } catch (error) {

            setError(

                error.response?.data?.message ||
                "Could not resend OTP."

            );

        } finally {

            setResending(false);

        }

    };


    // ========================================
    // NO EMAIL
    // ========================================

    if (!email) {

        return (

            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                <div className="bg-white p-8 rounded-xl shadow-md text-center">

                    <h2 className="text-2xl font-bold mb-4">
                        Email Verification
                    </h2>

                    <p className="text-gray-600 mb-6">
                        Email address is missing.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/register")
                        }
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                        Back to Register
                    </button>

                </div>

            </div>

        );

    }


    // ========================================
    // OTP PAGE
    // ========================================

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">


                {/* HEADER */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-gray-800">
                        Verify Your Email
                    </h1>

                    <p className="text-gray-500 mt-3">
                        We sent a 6-digit OTP to
                    </p>

                    <p className="font-semibold text-blue-600 mt-1">
                        {email}
                    </p>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleVerifyOTP}
                    className="space-y-5"
                >

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter OTP
                        </label>

                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => {

                                const value =
                                    e.target.value.replace(
                                        /\D/g,
                                        ""
                                    );

                                setOtp(value);

                            }}
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* SUCCESS MESSAGE */}

                    {message && (

                        <div className="p-3 rounded-lg bg-green-100 text-green-700 text-sm text-center">

                            {message}

                        </div>

                    )}


                    {/* ERROR MESSAGE */}

                    {error && (

                        <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm text-center">

                            {error}

                        </div>

                    )}


                    {/* VERIFY BUTTON */}

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            otp.length !== 6
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
                    >

                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}

                    </button>

                </form>


                {/* RESEND */}

                <div className="text-center mt-6">

                    <p className="text-gray-500 text-sm mb-2">
                        Didn't receive the OTP?
                    </p>

                    <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resending}
                        className="text-blue-600 hover:text-blue-800 font-semibold disabled:text-gray-400"
                    >

                        {resending
                            ? "Sending..."
                            : "Resend OTP"}

                    </button>

                </div>


                {/* LOGIN */}

                <div className="text-center mt-6">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/login")
                        }
                        className="text-gray-500 hover:text-gray-700 text-sm"
                    >

                        Back to Login

                    </button>

                </div>

            </div>

        </div>

    );

}


export default EmailOTP;