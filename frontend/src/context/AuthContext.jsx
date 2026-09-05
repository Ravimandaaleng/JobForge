import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";


import api from "../api/axios";

import socket from "../socket";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    // ========================================
    // USER STATE
    // ========================================

    const [user, setUser] = useState(() => {

        const storedUser =
            localStorage.getItem("user");

        return storedUser
            ? JSON.parse(storedUser)
            : null;

    });


    // ========================================
    // TOKEN STATE
    // ========================================

    const [token, setToken] = useState(() => {

        return localStorage.getItem("token");

    });


    // ========================================
    // UNREAD NOTIFICATION COUNT
    // ========================================

    const [unreadCount, setUnreadCount] =
        useState(0);


    // ========================================
    // FETCH UNREAD NOTIFICATION COUNT
    // ========================================

    const fetchUnreadCount = async () => {

        if (!token) {

            setUnreadCount(0);

            return;

        }


        try {

            const response =
                await api.get(
                    "/notifications"
                );


            setUnreadCount(
                response.data.unreadCount
            );

        } catch (error) {

            console.error(
                "Notification Count Error:",
                error
            );

        }

    };


    // ========================================
    // INITIAL NOTIFICATION COUNT
    // ========================================

    useEffect(() => {

        if (!token) {

            setUnreadCount(0);

            return;

        }


        // Get existing unread notifications
        // when user logs in or refreshes page

        fetchUnreadCount();

    }, [token]);


    // ========================================
    // SOCKET.IO CONNECTION
    // ========================================

    useEffect(() => {

        // ====================================
        // CHECK AUTHENTICATION
        // ====================================

        if (!token || !user?._id) {

            socket.disconnect();

            return;

        }


        // ====================================
        // SEND JWT TO SOCKET.IO
        // ====================================

        socket.auth = {
            token: token
        };


        // ====================================
        // SOCKET CONNECTED
        // ====================================

        const handleConnect = () => {

            console.log(
                "Socket connected:",
                socket.id
            );

        };


        // ====================================
        // SOCKET CONNECTION ERROR
        // ====================================

        const handleConnectError =
            (error) => {

                console.error(
                    "Socket connection error:",
                    error.message
                );

            };


        // ====================================
        // SOCKET DISCONNECTED
        // ====================================

        const handleDisconnect =
            (reason) => {

                console.log(
                    "Socket disconnected:",
                    reason
                );

            };


        // ====================================
        // NEW NOTIFICATION
        // ====================================

        const handleNewNotification =
            (notification) => {

                console.log(
                    "New notification:",
                    notification
                );


                // Increase badge immediately

                setUnreadCount(
                    (previousCount) =>
                        previousCount + 1
                );

            };


        // ====================================
        // REGISTER EVENTS
        // ====================================

        socket.on(
            "connect",
            handleConnect
        );


        socket.on(
            "connect_error",
            handleConnectError
        );


        socket.on(
            "disconnect",
            handleDisconnect
        );


        socket.on(
            "newNotification",
            handleNewNotification
        );


        // ====================================
        // CONNECT SOCKET
        // ====================================

        socket.connect();


        // ====================================
        // CLEANUP
        // ====================================

        return () => {

            socket.off(
                "connect",
                handleConnect
            );


            socket.off(
                "connect_error",
                handleConnectError
            );


            socket.off(
                "disconnect",
                handleDisconnect
            );


            socket.off(
                "newNotification",
                handleNewNotification
            );


            socket.disconnect();

        };

    }, [token, user?._id]);


    // ========================================
    // LOGIN
    // ========================================

    const login = (
        newToken,
        newUser
    ) => {

        // Save JWT

        localStorage.setItem(
            "token",
            newToken
        );


        // Save user

        localStorage.setItem(
            "user",
            JSON.stringify(newUser)
        );


        // Update state

        setToken(newToken);

        setUser(newUser);

    };


    // ========================================
    // LOGOUT
    // ========================================

    const logout = () => {

        // Remove JWT

        localStorage.removeItem(
            "token"
        );


        // Remove user

        localStorage.removeItem(
            "user"
        );


        // Disconnect Socket.IO

        socket.disconnect();


        // Clear state

        setToken(null);

        setUser(null);

        setUnreadCount(0);
        window.location.href = "/";
    };


    // ========================================
    // CONTEXT PROVIDER
    // ========================================

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


// ========================================
// CUSTOM AUTH HOOK
// ========================================

export const useAuth = () => {

    return useContext(
        AuthContext
    );

};