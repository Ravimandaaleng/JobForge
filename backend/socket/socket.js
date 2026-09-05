const jwt = require("jsonwebtoken");


// ========================================
// SOCKET.IO INSTANCE
// ========================================

let io;


// ========================================
// INITIALIZE SOCKET.IO
// ========================================

const initializeSocket = (socketIO) => {

    io = socketIO;


    // ====================================
    // SOCKET AUTHENTICATION
    // ====================================

    io.use((socket, next) => {

        try {

            // Get JWT from Socket.IO handshake
            const token =
                socket.handshake.auth?.token;


            // Token missing
            if (!token) {

                return next(
                    new Error(
                        "Authentication required"
                    )
                );

            }


            // Verify JWT
            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );


            // Store verified user information
            // inside socket
            socket.user = decoded;


            next();

        } catch (error) {

            console.error(
                "Socket authentication failed:",
                error.message
            );


            return next(
                new Error(
                    "Invalid socket token"
                )
            );

        }

    });

};


// ========================================
// GET SOCKET.IO INSTANCE
// ========================================

const getIO = () => {

    if (!io) {

        throw new Error(
            "Socket.IO has not been initialized"
        );

    }

    return io;

};


// ========================================
// EXPORT
// ========================================

module.exports = {

    initializeSocket,

    getIO

};