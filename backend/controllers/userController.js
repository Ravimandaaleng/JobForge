const fs = require("fs");
const pdfParse = require("pdf-parse");

const User = require("../models/User");


// ========================================
// SKILL DICTIONARY
// ========================================

const SKILL_DICTIONARY = {

    "c": "C",
    "c++": "C++",
    "python": "Python",
    "java": "Java",
    "javascript": "JavaScript",
    "typescript": "TypeScript",

    "html": "HTML",
    "css": "CSS",
    "html/css": "HTML/CSS",

    "react": "React.js",
    "react.js": "React.js",

    "node": "Node.js",
    "node.js": "Node.js",

    "express": "Express.js",
    "express.js": "Express.js",

    "django": "Django",
    "flask": "Flask",

    "mongodb": "MongoDB",
    "mysql": "MySQL",
    "postgresql": "PostgreSQL",
    "sql": "SQL",

    "numpy": "NumPy",
    "pandas": "Pandas",
    "matplotlib": "Matplotlib",
    "scikit-learn": "Scikit-learn",

    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",

    "opencv": "OpenCV",
    "yolo": "YOLO",
    "yolov8": "YOLOv8",
    "mediapipe": "MediaPipe",

    "verilog": "Verilog HDL",
    "verilog hdl": "Verilog HDL",

    "arduino": "Arduino",
    "multisim": "Multisim",

    "git": "Git",
    "github": "GitHub",
    "vs code": "VS Code",
    "postman": "Postman",

    "data structures": "Data Structures",
    "data structures & algorithms":
        "Data Structures & Algorithms",

    "dsa": "DSA"
};


// ========================================
// EXTRACT SKILLS
// ========================================

const extractSkills = (resumeText) => {

    const detectedSkills = new Set();

    const text =
        resumeText
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();


    Object.entries(
        SKILL_DICTIONARY
    ).forEach(([keyword, skillName]) => {

        let found = false;


        // --------------------------------
        // Special handling for C++
        // --------------------------------

        if (keyword === "c++") {

            found =
                /(^|[^a-z0-9])c\+\+([^a-z0-9]|$)/i
                    .test(text);

        }


        // --------------------------------
        // Special handling for C
        // --------------------------------

        else if (keyword === "c") {

            found =
                /(^|[^a-z0-9])c([^a-z0-9]|$)/i
                    .test(text);

        }


        // --------------------------------
        // Normal skills
        // --------------------------------

        else {

            const escapedKeyword =
                keyword.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                );


            const regex =
                new RegExp(
                    `(^|[^a-z0-9])${escapedKeyword}([^a-z0-9]|$)`,
                    "i"
                );


            found =
                regex.test(text);

        }


        if (found) {

            detectedSkills.add(
                skillName
            );

        }

    });


    return Array.from(
        detectedSkills
    );

};


// ========================================
// GET PROFILE
// ========================================

const getProfile = async (req, res) => {

    try {

        const user =
            await User.findById(req.user.id)
                .select("-password");


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        res.status(200).json({
            user
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


// ========================================
// UPDATE PROFILE
// ========================================

const updateProfile = async (req, res) => {

    try {

        const {
            name,
            skills
        } = req.body;


        const user =
            await User.findById(req.user.id);


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        if (name) {

            user.name = name;

        }


        if (Array.isArray(skills)) {

            user.skills = [
                ...new Set(
                    skills
                        .map(
                            skill =>
                                skill.trim()
                        )
                        .filter(
                            skill =>
                                skill.length > 0
                        )
                )
            ];

        }


        await user.save();


        res.status(200).json({

            message:
                "Profile updated successfully",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone,

                role: user.role,

                skills: user.skills,

                resume: user.resume

            }

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


// ========================================
// UPLOAD RESUME
// ========================================

const uploadResume = async (req, res) => {

    try {

        // -------------------------------
        // Check file
        // -------------------------------

        if (!req.file) {

            return res.status(400).json({

                message:
                    "Please upload a PDF resume"

            });

        }


        // -------------------------------
        // Find user
        // -------------------------------

        const user =
            await User.findById(req.user.id);


        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }


        // -------------------------------
        // Save resume path
        // -------------------------------

        user.resume =
            req.file.path;


        // -------------------------------
        // Read PDF
        // -------------------------------

        const pdfBuffer =
            fs.readFileSync(
                req.file.path
            );


        // -------------------------------
        // Extract text
        // -------------------------------

        const pdfData =
            await pdfParse(
                pdfBuffer
            );


        const resumeText =
            pdfData.text;


        // -------------------------------
        // Extract skills
        // -------------------------------

        const detectedSkills =
            extractSkills(
                resumeText
            );


        // -------------------------------
        // Save extracted skills
        // -------------------------------

        user.skills =
            detectedSkills;


        await user.save();


        // -------------------------------
        // Console
        // -------------------------------

        console.log(
            "\n========== EXTRACTED SKILLS =========="
        );

        console.log(
            detectedSkills
        );

        console.log(
            "======================================\n"
        );


        // -------------------------------
        // Response
        // -------------------------------

        res.status(200).json({

            message:
                "Resume uploaded and skills extracted successfully",

            resume:
                user.resume,

            resumeUrl:
                `http://localhost:${process.env.PORT || 5000}/${user.resume}`,

            skills:
                detectedSkills

        });


    } catch (error) {

        console.error(
            "Resume processing error:",
            error
        );


        res.status(500).json({

            message:
                error.message ||
                "Server error"

        });

    }

};


// ========================================
// EXPORT
// ========================================

module.exports = {

    getProfile,

    updateProfile,

    uploadResume

};