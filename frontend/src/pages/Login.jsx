import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import api from "../api/axios";

import { useAuth } from "../context/AuthContext";


function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();


    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });


    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setLoading(true);


        try {

            const response = await api.post(
                "/auth/login",
                formData
            );


            const {
                token,
                user
            } = response.data;


            login(token, user);


            setMessage(
                "Login successful!"
            );


            if (user.role === "admin") {

                navigate(
                    "/admin/dashboard"
                );

            } else if (user.role === "recruiter") {

                navigate(
                    "/recruiter/dashboard"
                );

            } else {

                navigate("/jobs");

            }


        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow">

                <h1 className="text-3xl font-bold text-center">
                    Login
                </h1>


                <p className="text-gray-600 text-center mt-2">
                    Welcome back to JobForge
                </p>


                {message && (

                    <div className="mt-5 bg-blue-100 text-blue-700 p-3 rounded-lg">
                        {message}
                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >

                    <div>

                        <label className="block font-medium mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full border p-3 rounded-lg"
                        />

                    </div>


                    <div>

                        <label className="block font-medium mb-1">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full border p-3 rounded-lg"
                        />

                    </div>


                    {/* FORGOT PASSWORD */}

                    <div className="text-right">

                        <Link
                            to="/forgot-password"
                            className="text-blue-600 hover:underline text-sm font-medium"
                        >
                            Forgot Password?
                        </Link>

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>


                <p className="text-center text-gray-600 mt-6">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="text-blue-600 hover:underline"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );
}

export default Login;