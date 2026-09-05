import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";


function ForgotPassword() {

    const navigate = useNavigate();


    const [email, setEmail] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);


    // ========================================
    // HANDLE SUBMIT
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        if (!email) {

            setError(
                "Please enter your email address."
            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await api.post(
                    "/auth/forgot-password",
                    {
                        email
                    }
                );


            setMessage(
                response.data.message
            );


            // ==================================
            // GO TO RESET PASSWORD PAGE
            // ==================================

            setTimeout(() => {

                navigate(
                    "/reset-password",
                    {
                        state: {
                            email
                        }
                    }
                );

            }, 1000);


        } catch (error) {

            setError(

                error.response?.data?.message ||
                "Unable to send password reset OTP."

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

                    Forgot Password

                </h1>


                <p className="text-center text-gray-500 mt-2">

                    Enter your email to receive a reset OTP

                </p>


                {/* ==================================
                    FORM
                ================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >

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


                    {/* ==================================
                        SUCCESS MESSAGE
                    ================================== */}

                    {message && (

                        <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center">

                            {message}

                        </div>

                    )}


                    {/* ==================================
                        ERROR MESSAGE
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
                            ? "Sending OTP..."
                            : "Send Reset OTP"
                        }

                    </button>

                </form>


                {/* ==================================
                    BACK TO LOGIN
                ================================== */}

                <p className="text-center mt-6">

                    <button
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


export default ForgotPassword;