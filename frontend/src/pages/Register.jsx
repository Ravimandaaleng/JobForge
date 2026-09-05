import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";


function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "student"
    });


    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    // ========================================
    // HANDLE INPUT CHANGE
    // ========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // ========================================
    // HANDLE REGISTER
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        setLoading(true);


        try {

            const response = await api.post(
                "/auth/register",
                formData
            );


            setMessage(
                response.data.message
            );


            // ==================================
            // GO TO EMAIL OTP PAGE
            // ==================================

            setTimeout(() => {

                navigate(
                    "/verify-email-otp",
                    {
                        state: {
                            email: response.data.email
                        }
                    }
                );

            }, 1000);


        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">

                {/* ==================================
                    HEADING
                ================================== */}

                <h1 className="text-3xl font-bold text-center text-blue-600">

                    Create Account

                </h1>


                <p className="text-center text-gray-500 mt-2">

                    Join JobForge

                </p>


                {/* ==================================
                    REGISTER FORM
                ================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >

                    {/* NAME */}

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />


                    {/* EMAIL */}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />


                    {/* PHONE */}

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />


                    {/* PASSWORD */}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                        minLength="6"
                    />


                    {/* ROLE */}

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    >

                        <option value="student">
                            Student
                        </option>


                        <option value="recruiter">
                            Recruiter
                        </option>

                    </select>


                    {/* REGISTER BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >

                        {loading
                            ? "Creating Account..."
                            : "Register"
                        }

                    </button>

                </form>


                {/* ==================================
                    MESSAGE
                ================================== */}

                {message && (

                    <p className="mt-4 text-center text-sm">

                        {message}

                    </p>

                )}


                {/* ==================================
                    LOGIN LINK
                ================================== */}

                <p className="text-center mt-6 text-gray-600">

                    Already have an account?{" "}


                    <Link
                        to="/login"
                        className="text-blue-600 font-semibold"
                    >

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

}


export default Register;