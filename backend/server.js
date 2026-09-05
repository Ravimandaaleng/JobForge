const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

const {
    initializeSocket
} = require("./socket/socket");


const authRoutes =
    require("./routes/authRoutes");

const jobRoutes =
    require("./routes/jobRoutes");

const applicationRoutes =
    require("./routes/applicationRoutes");

const userRoutes =
    require("./routes/userRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const notificationRoutes =
    require("./routes/notificationRoutes");


// ========================================
// ENVIRONMENT VARIABLES
// ========================================

dotenv.config();


// ========================================
// DATABASE
// ========================================

connectDB();


// ========================================
// EXPRESS APP
// ========================================

const app = express();


// ========================================
// HTTP SERVER
// ========================================

const server =
    http.createServer(app);


// ========================================
// SOCKET.IO
// ========================================

const io =
    new Server(server, {

        cors: {

            origin:
                "http://localhost:5173",

            methods: [
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE"
            ]

        }

    });


// ========================================
// INITIALIZE SOCKET HELPER
// ========================================

initializeSocket(io);


// ========================================
// SOCKET CONNECTION
// ========================================

io.on("connection", (socket) => {

    console.log(
        "Socket connected:",
        socket.id
    );


    // ====================================
    // GET VERIFIED USER ID
    // ====================================

    const userId =
        socket.user.id;


    // ====================================
    // JOIN USER'S PRIVATE ROOM
    // ====================================

    socket.join(
        `user_${userId}`
    );


    console.log(
        `User ${userId} joined notification room`
    );


    // ====================================
    // DISCONNECT
    // ====================================

    socket.on(
        "disconnect",
        () => {

            console.log(
                "Socket disconnected:",
                socket.id
            );

        }
    );

});


// ========================================
// EXPRESS MIDDLEWARE
// ========================================

app.use(
    cors()
);


app.use(
    express.json()
);


app.use(
    express.urlencoded({
        extended: true
    })
);


// ========================================
// STATIC UPLOADS
// ========================================

app.use(
    "/uploads",
    express.static("uploads")
);


// ========================================
// HOME ROUTE
// ========================================

app.get(
    "/",
    (req, res) => {

        res.status(200).json({

            message:
                "JobForge API is running 🚀"

        });

    }
);


// ========================================
// AUTH ROUTES
// ========================================

app.use(
    "/api/auth",
    authRoutes
);


// ========================================
// JOB ROUTES
// ========================================

app.use(
    "/api/jobs",
    jobRoutes
);


// ========================================
// APPLICATION ROUTES
// ========================================

app.use(
    "/api/applications",
    applicationRoutes
);


// ========================================
// USER ROUTES
// ========================================

app.use(
    "/api/users",
    userRoutes
);


// ========================================
// ADMIN ROUTES
// ========================================

app.use(
    "/api/admin",
    adminRoutes
);


// ========================================
// NOTIFICATION ROUTES
// ========================================

app.use(
    "/api/notifications",
    notificationRoutes
);


// ========================================
// 404 ROUTE
// ========================================

app.use(
    (req, res) => {

        res.status(404).json({

            message:
                `Route not found: ${req.method} ${req.originalUrl}`

        });

    }
);


// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use(
    (err, req, res, next) => {

        console.error(
            "Global Error:",
            err
        );


        // ====================================
        // MONGOOSE VALIDATION ERROR
        // ====================================

        if (
            err.name ===
            "ValidationError"
        ) {

            return res.status(400).json({

                message:
                    "Validation failed",

                error:
                    err.message

            });

        }


        // ====================================
        // INVALID MONGODB OBJECT ID
        // ====================================

        if (
            err.name ===
            "CastError"
        ) {

            return res.status(400).json({

                message:
                    "Invalid ID"

            });

        }


        // ====================================
        // DUPLICATE VALUE
        // ====================================

        if (
            err.code === 11000
        ) {

            return res.status(400).json({

                message:
                    "Duplicate value already exists"

            });

        }


        // ====================================
        // MULTER ERROR
        // ====================================

        if (
            err.name ===
            "MulterError"
        ) {

            return res.status(400).json({

                message:
                    err.message

            });

        }


        // ====================================
        // OTHER ERRORS
        // ====================================

        const statusCode =
            err.statusCode || 500;


        res.status(statusCode).json({

            message:
                err.message ||
                "Internal server error"

        });

    }
);


// ========================================
// START SERVER
// ========================================

const PORT =
    process.env.PORT || 5000;


server.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );


        console.log(
            "Socket.IO server ready ⚡"
        );

    }
);