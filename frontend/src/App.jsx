import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import EmailOTP from "./pages/EmailOTP";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import MyApplication from "./pages/MyApplication";
import JobDetails from "./pages/JobDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import Applicants from "./pages/Applicants";
import RoleRoute from "./components/RoleRoute";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminJobs from "./pages/AdminJobs";
import Notifications from "./pages/Notifications";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


function App() {

    return (
        <BrowserRouter>
        <Navbar />
            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/jobs"
                    element={<Jobs />}
                />

                <Route
    path="/reset-password"
    element={<ResetPassword />}
/>

                <Route
    path="/jobs/:id"
    element={<JobDetails />}
/>

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
    path="/verify-email-otp"
    element={<EmailOTP />}
/>



                <Route
    path="/recruiter/dashboard"
    element={
        <RoleRoute allowedRole="recruiter">
            <RecruiterDashboard />
        </RoleRoute>
    }
/>

<Route
    path="/recruiter/create-job"
    element={
        <RoleRoute allowedRole="recruiter">
            <CreateJob />
        </RoleRoute>
    }
/>

<Route
    path="/forgot-password"
    element={<ForgotPassword />}
/>

<Route
    path="/recruiter/edit-job/:id"
    element={
        <RoleRoute allowedRole="recruiter">
            <EditJob />
        </RoleRoute>
    }
/>

<Route
    path="/recruiter/applicants/:id"
    element={
        <RoleRoute allowedRole="recruiter">
            <Applicants />
        </RoleRoute>
    }
/>
                <Route
                    path="/my-applications"
                    element={
                        <ProtectedRoute>
                            <MyApplication />
                        </ProtectedRoute>
                    }
                />
                <Route
    path="/admin/dashboard"
    element={
        <RoleRoute allowedRole="admin">
            <AdminDashboard />
        </RoleRoute>
    }
/>
<Route
    path="/notifications"
    element={
        <ProtectedRoute>
            <Notifications />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/users"
    element={
        <RoleRoute allowedRole="admin">
            <AdminUsers />
        </RoleRoute>
    }
/>

<Route
    path="/admin/jobs"
    element={
        <RoleRoute allowedRole="admin">
            <AdminJobs />
        </RoleRoute>
    }
/>


            </Routes>

        </BrowserRouter>
    );
}

export default App;