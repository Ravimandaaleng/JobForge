const mongoose = require("mongoose");

const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");

const sendEmail = require("../utils/sendEmail");


/* =========================
   CREATE JOB
========================= */

const createJob = async (req, res) => {
    try {
        const {
            title,
            company,
            description,
            location,
            salary,
            jobType,
            experience,
            skills
        } = req.body;

        if (
            !title ||
            !company ||
            !description ||
            !location ||
            salary === undefined ||
            !jobType ||
            !experience ||
            !skills
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (Number(salary) < 0) {
            return res.status(400).json({
                message: "Salary cannot be negative"
            });
        }

        if (
            !Array.isArray(skills) ||
            skills.length === 0
        ) {
            return res.status(400).json({
                message: "At least one skill is required"
            });
        }

        const job = await Job.create({
    title: title.trim(),
    company: company.trim(),
    description: description.trim(),
    location: location.trim(),
    salary: Number(salary),
    jobType,
    experience: experience.trim(),
    skills,
    recruiter: req.user.id
});


// ========================================
// SEND NEW JOB EMAIL TO STUDENTS
// ========================================

try {

    const students = await User.find({
        role: "student",
        emailVerified: true
    }).select("email name");


    for (const student of students) {

        await sendEmail({
            to: student.email,

            subject: `🚀 New Job Posted: ${job.title}`,

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    background: #f8fafc;
                ">

                    <div style="
                        background: #0f172a;
                        color: white;
                        padding: 20px;
                        border-radius: 10px 10px 0 0;
                    ">

                        <h1 style="margin: 0;">
                            JobForge 🚀
                        </h1>

                        <p style="margin-bottom: 0; color: #cbd5e1;">
                            New job opportunity available
                        </p>

                    </div>


                    <div style="
                        background: white;
                        padding: 25px;
                        border-radius: 0 0 10px 10px;
                    ">

                        <p>
                            Hello ${student.name},
                        </p>

                        <p>
                            A new job has been posted on JobForge.
                        </p>


                        <h2 style="color: #2563eb;">
                            ${job.title}
                        </h2>


                        <p>
                            <strong>Company:</strong>
                            ${job.company}
                        </p>

                        <p>
                            <strong>Location:</strong>
                            ${job.location}
                        </p>

                        <p>
                            <strong>Job Type:</strong>
                            ${job.jobType}
                        </p>

                        <p>
                            <strong>Experience:</strong>
                            ${job.experience}
                        </p>

                        <p>
                            <strong>Salary:</strong>
                            ₹${Number(job.salary).toLocaleString("en-IN")}
                        </p>


                        <p>
                            <strong>Required Skills:</strong>
                        </p>

                        <p>
                            ${job.skills.join(", ")}
                        </p>


                        <div style="
                            margin-top: 25px;
                            padding: 15px;
                            background: #eff6ff;
                            border-radius: 8px;
                        ">

                            <p style="margin: 0;">
                                Login to JobForge to view the complete
                                job details and apply.
                            </p>

                        </div>


                        <p style="
                            margin-top: 30px;
                            color: #64748b;
                        ">

                            Good luck with your job search! 🎯

                        </p>

                    </div>

                </div>
            `
        });

    }


    console.log(
        `New job notification sent to ${students.length} students`
    );


} catch (emailError) {

    console.error(
        "Job notification email error:",
        emailError.message
    );

}

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("Create Job Error:", error);

        res.status(500).json({
            message: "Failed to create job"
        });
    }
};

// ========================================
// CALCULATE JOB MATCH SCORE
// ========================================

const calculateMatchScore = (studentSkills, jobSkills) => {

    if (
        !Array.isArray(studentSkills) ||
        !Array.isArray(jobSkills) ||
        jobSkills.length === 0
    ) {
        return {
            matchScore: 0,
            matchingSkills: []
        };
    }


    // Convert student skills to lowercase
    const studentSkillSet = new Set(
        studentSkills.map(
            skill => skill.trim().toLowerCase()
        )
    );


    // Find matching skills
    const matchingSkills = jobSkills.filter(
        skill =>
            studentSkillSet.has(
                skill.trim().toLowerCase()
            )
    );


    // Calculate percentage
    const matchScore = Math.round(
        (matchingSkills.length / jobSkills.length) * 100
    );


    return {
        matchScore,
        matchingSkills
    };
};
/* =========================
   GET JOBS
   SEARCH + FILTER
   PAGINATION + SORT
========================= */

const getJobs = async (req, res) => {
    try {

        const {
            location,
            jobType,
            skill,
            search,
            sort
        } = req.query;


        /* =========================
           PAGINATION
        ========================= */

        let page = Number(req.query.page) || 1;

        let limit = Number(req.query.limit) || 10;

        if (page < 1) {
            page = 1;
        }

        if (limit < 1) {
            limit = 10;
        }

        if (limit > 50) {
            limit = 50;
        }

        const skip = (page - 1) * limit;


        /* =========================
           FILTER
        ========================= */

        const filter = {};


        if (location) {
            filter.location = {
                $regex: location,
                $options: "i"
            };
        }


        if (jobType) {
            filter.jobType = jobType;
        }


        if (skill) {
            filter.skills = {
                $regex: skill,
                $options: "i"
            };
        }


        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    company: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }


        /* =========================
           SORTING
        ========================= */

        let sortOption = {
            createdAt: -1
        };

        if (sort === "oldest") {
            sortOption = {
                createdAt: 1
            };
        }

        if (sort === "salary-high") {
            sortOption = {
                salary: -1
            };
        }

        if (sort === "salary-low") {
            sortOption = {
                salary: 1
            };
        }


        /* =========================
           COUNT
        ========================= */

        const totalJobs =
            await Job.countDocuments(filter);


        /* =========================
           GET JOBS
        ========================= */

       let jobs =
    await Job.find(filter)
        .populate(
            "recruiter",
            "name email"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(limit);


// ========================================
// ADD MATCH SCORE FOR STUDENT
// ========================================

if (
    req.user &&
    req.user.role === "student"
) {

    const User = require("../models/User");

    const student =
        await User.findById(req.user.id)
            .select("skills");

    const studentSkills =
        student?.skills || [];


    jobs = jobs.map((job) => {

        const {
            matchScore,
            matchingSkills
        } = calculateMatchScore(
            studentSkills,
            job.skills
        );


        return {
            ...job.toObject(),

            matchScore,

            matchingSkills
        };

    });

}


        /* =========================
           TOTAL PAGES
        ========================= */

        const totalPages =
            Math.ceil(totalJobs / limit);


        /* =========================
           RESPONSE
        ========================= */

        res.status(200).json({

            count: jobs.length,

            totalJobs,

            page,

            limit,

            totalPages,

            hasNextPage:
                page < totalPages,

            hasPreviousPage:
                page > 1,

            jobs
        });

    } catch (error) {

        console.error(
            "Get Jobs Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch jobs"
        });
    }
};


/* =========================
   GET MY JOBS
========================= */

const getMyJobs = async (req, res) => {
    try {

        const jobs = await Job.find({
            recruiter: req.user.id
        })
            .populate(
                "recruiter",
                "name email"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            count: jobs.length,
            jobs
        });

    } catch (error) {

        console.error(
            "Get My Jobs Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch your jobs"
        });
    }
};


/* =========================
   GET SINGLE JOB
========================= */

const getJobById = async (req, res) => {
    try {

        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job = await Job.findById(id)
            .populate(
                "recruiter",
                "name email"
            );

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json({
            job
        });

    } catch (error) {

        console.error(
            "Get Job Error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch job"
        });
    }
};


/* =========================
   UPDATE JOB
========================= */

const updateJob = async (req, res) => {
    try {

        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const {
            title,
            company,
            description,
            location,
            salary,
            jobType,
            experience,
            skills
        } = req.body;

        if (
            !title ||
            !company ||
            !description ||
            !location ||
            salary === undefined ||
            !jobType ||
            !experience ||
            !skills
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (Number(salary) < 0) {
            return res.status(400).json({
                message: "Salary cannot be negative"
            });
        }

        if (
            !Array.isArray(skills) ||
            skills.length === 0
        ) {
            return res.status(400).json({
                message: "At least one skill is required"
            });
        }

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        if (
            job.recruiter.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message:
                    "You can only update your own jobs"
            });
        }

        job.title = title.trim();
        job.company = company.trim();
        job.description = description.trim();
        job.location = location.trim();
        job.salary = Number(salary);
        job.jobType = jobType;
        job.experience = experience.trim();
        job.skills = skills;

        await job.save();

        res.status(200).json({
            message: "Job updated successfully",
            job
        });

    } catch (error) {

        console.error(
            "Update Job Error:",
            error
        );

        res.status(500).json({
            message: "Failed to update job"
        });
    }
};


/* =========================
   DELETE JOB
========================= */

const deleteJob = async (req, res) => {
    try {

        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                message: "Invalid job ID"
            });
        }

        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        if (
            job.recruiter.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message:
                    "You can only delete your own jobs"
            });
        }

        await Application.deleteMany({
            job: job._id
        });

        await Job.findByIdAndDelete(id);

        res.status(200).json({
            message:
                "Job and related applications deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete Job Error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete job"
        });
    }
};


module.exports = {
    createJob,
    getJobs,
    getMyJobs,
    getJobById,
    updateJob,
    deleteJob
};