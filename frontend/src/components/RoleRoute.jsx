import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ children, allowedRole }) {
    const { token, user } = useAuth();

    // User is not logged in
    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // User data is not available
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // User has wrong role
    if (user.role !== allowedRole) {
        return (
            <Navigate
                to="/jobs"
                replace
            />
        );
    }

    // Correct role
    return children;
}

export default RoleRoute;