
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EmailOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get email from navigation state or sessionStorage
    const email =
        location.state?.email ||
        sessionStorage.getItem("verificationEmail") ||
        "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!email) {
            setError("Email address is missing. Please register again.");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/verify-email-otp",
                {
                    email: email.trim().toLowerCase(),
                    otp: otp
                }
            );

            setMessage(
                response.data.message ||
                "Email verified successfully!"
            );

            // Clear stored email after successful verification
            sessionStorage.removeItem("verificationEmail");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "OTP verification failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        setError("");
        setMessage("");

        if (!email) {
            setError("Email address is missing. Please register again.");
            return;
        }

        try {
            setResending(true);

            const response = await api.post(
                "/auth/resend-email-otp",
                {
                    email: email.trim().toLowerCase()
                }
            );

            setMessage(
                response.data.message ||
                "A new OTP has been sent to your email."
            );

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to resend OTP. Please try again."
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
                    Verify Your Email
                </h2>

                <p className="text-center text-gray-600 mb-6">
                    Enter the 6-digit OTP sent to
                </p>

                <p className="text-center font-semibold text-blue-600 mb-6 break-all">
                    {email || "Email not found"}
                </p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
                        {message}
                    </div>
                )}

                <form onSubmit={handleVerifyOTP}>

                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setOtp(value);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-widest outline-none focus:ring-2 focus:ring-blue-500 mb-5"
                    />

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>

                </form>

                <div className="text-center mt-6">

                    <p className="text-gray-600 text-sm mb-3">
                        Didn't receive the OTP?
                    </p>

                    <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resending || !email}
                        className="text-blue-600 font-semibold hover:underline disabled:opacity-50"
                    >
                        {resending ? "Sending..." : "Resend OTP"}
                    </button>

                </div>

                <div className="text-center mt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="text-gray-500 text-sm hover:text-blue-600"
                    >
                        Back to Register
                    </button>
                </div>

            </div>
        </div>
    );
};

export default EmailOTP;
