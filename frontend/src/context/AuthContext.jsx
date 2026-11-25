
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../api/axios";
import socket from "../socket";

const AuthContext = createContext();

// Safely retrieve stored user
const getStoredUser = () => {
    try {
        const storedUser = localStorage.getItem("user");

        if (
            !storedUser ||
            storedUser === "undefined" ||
            storedUser === "null"
        ) {
            localStorage.removeItem("user");
            return null;
        }

        return JSON.parse(storedUser);

    } catch (error) {
        console.error("Invalid stored user:", error);

        localStorage.removeItem("user");

        return null;
    }
};

// Safely retrieve stored token
const getStoredToken = () => {
    const storedToken = localStorage.getItem("token");

    if (
        !storedToken ||
        storedToken === "undefined" ||
        storedToken === "null"
    ) {
        localStorage.removeItem("token");
        return null;
    }

    return storedToken;
};

export const AuthProvider = ({ children }) => {

    // USER STATE
    const [user, setUser] = useState(getStoredUser);

    // TOKEN STATE
    const [token, setToken] = useState(getStoredToken);

    // UNREAD NOTIFICATION COUNT
    const [unreadCount, setUnreadCount] = useState(0);

    // FETCH UNREAD NOTIFICATIONS
    const fetchUnreadCount = async () => {

        if (!token) {
            setUnreadCount(0);
            return;
        }

        try {
            const response = await api.get("/notifications");

            setUnreadCount(response.data.unreadCount || 0);

        } catch (error) {
            console.error("Notification Count Error:", error);
        }
    };

    // INITIAL NOTIFICATION COUNT
    useEffect(() => {

        if (!token) {
            setUnreadCount(0);
            return;
        }

        fetchUnreadCount();

    }, [token]);

    // SOCKET.IO CONNECTION
    useEffect(() => {

        if (!token || !user?._id) {
            socket.disconnect();
            return;
        }

        socket.auth = { token };

        const handleConnect = () => {
            console.log("Socket connected:", socket.id);
        };

        const handleConnectError = (error) => {
            console.error("Socket connection error:", error.message);
        };

        const handleDisconnect = (reason) => {
            console.log("Socket disconnected:", reason);
        };

        const handleNewNotification = (notification) => {

            console.log("New notification:", notification);

            setUnreadCount(previousCount => previousCount + 1);
        };

        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);
        socket.on("disconnect", handleDisconnect);
        socket.on("newNotification", handleNewNotification);

        socket.connect();

        return () => {

            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            socket.off("disconnect", handleDisconnect);
            socket.off("newNotification", handleNewNotification);

            socket.disconnect();
        };

    }, [token, user?._id]);

    // LOGIN
    const login = (newToken, newUser) => {

        if (!newToken || !newUser) {
            console.error("Invalid login data");
            return;
        }

        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));

        setToken(newToken);
        setUser(newUser);
    };

    // LOGOUT
    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        socket.disconnect();

        setToken(null);
        setUser(null);
        setUnreadCount(0);

        window.location.href = "/";
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                unreadCount,
                setUnreadCount,
                fetchUnreadCount
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// CUSTOM AUTH HOOK
export const useAuth = () => {
    return useContext(AuthContext);
};
