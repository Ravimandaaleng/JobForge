import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);

    const [name, setName] = useState("");
    const [skills, setSkills] = useState("");

    const [resume, setResume] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [newSkill, setNewSkill] = useState("");

    // ========================================
    // FETCH PROFILE
    // ========================================

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "/users/profile"
            );

            const data = response.data.user;

            setProfile(data);

            setName(data.name || "");

            setSkills(
                data.skills
                    ? data.skills.join(", ")
                    : ""
            );

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load profile"
            );

        } finally {
            setLoading(false);
        }
    };


    // ========================================
    // LOAD PROFILE
    // ========================================

    useEffect(() => {
        fetchProfile();
    }, []);


    // ========================================
    // UPDATE PROFILE
    // ========================================


const handleAddSkill = () => {

    const skill = newSkill.trim();

    if (!skill) {
        return;
    }

    const currentSkills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

    const alreadyExists = currentSkills.some(
        (item) =>
            item.toLowerCase() ===
            skill.toLowerCase()
    );

    if (alreadyExists) {
        setNewSkill("");
        return;
    }

    currentSkills.push(skill);

    setSkills(
        currentSkills.join(", ")
    );

    setNewSkill("");
};


const handleRemoveSkill = (skillToRemove) => {

    const currentSkills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

    const updatedSkills = currentSkills.filter(
        (skill) =>
            skill.toLowerCase() !==
            skillToRemove.toLowerCase()
    );

    setSkills(
        updatedSkills.join(", ")
    );
};

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const skillsArray = skills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill !== "");

            const response = await api.put(
                "/users/profile",
                {
                    name: name.trim(),
                    skills: skillsArray
                }
            );

            setProfile(response.data.user);

            setSuccess(
                response.data.message ||
                "Profile updated successfully!"
            );

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {
            setSaving(false);
        }
    };


    // ========================================
    // UPLOAD RESUME
    // ========================================

    const handleResumeUpload = async (e) => {
        e.preventDefault();

        if (!resume) {
            setError(
                "Please select a PDF resume."
            );
            return;
        }

        if (resume.type !== "application/pdf") {
            setError(
                "Only PDF files are allowed."
            );
            return;
        }

        if (resume.size > 5 * 1024 * 1024) {
            setError(
                "Resume must be smaller than 5 MB."
            );
            return;
        }

        try {
            setUploading(true);
            setError("");
            setSuccess("");

            const formData = new FormData();

            formData.append(
                "resume",
                resume
            );

            const response = await api.post(
                "/users/resume",
                formData
            );


            // ==================================
            // UPDATE PROFILE WITH NEW DATA
            // ==================================

            setProfile((previous) => ({
                ...previous,

                resume:
                    response.data.resume,

                skills:
                    response.data.skills || []
            }));


            // ==================================
            // UPDATE SKILLS INPUT
            // ==================================

            const extractedSkills =
                response.data.skills || [];

            setSkills(
                extractedSkills.join(", ")
            );


            // ==================================
            // CLEAR FILE
            // ==================================

            setResume(null);

            const input =
                document.getElementById(
                    "resumeInput"
                );

            if (input) {
                input.value = "";
            }


            // ==================================
            // SUCCESS MESSAGE
            // ==================================

            setSuccess(
                response.data.message ||
                "Resume uploaded and skills extracted successfully!"
            );

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to upload resume"
            );

        } finally {
            setUploading(false);
        }
    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 px-6 py-20 text-center text-white">

                <div className="text-4xl">
                    ⏳
                </div>

                <p className="mt-4 text-slate-400">
                    Loading profile...
                </p>

            </div>
        );
    }


    // ========================================
    // PAGE
    // ========================================

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* ==================================
                HEADER
            ================================== */}

            <section className="border-b border-slate-800 bg-slate-900">

                <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">

                    <div className="flex items-center gap-5">

                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 text-4xl">
                            👤
                        </div>

                        <div>

                            <h1 className="text-3xl font-bold">
                                {profile?.name || user?.name}
                            </h1>

                            <p className="mt-1 text-slate-400">
                                {profile?.email || user?.email}
                            </p>

                            <span className="mt-3 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs capitalize text-blue-400">
                                {profile?.role || user?.role}
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================
                MAIN
            ================================== */}

            <main className="mx-auto max-w-5xl space-y-8 px-6 py-10 lg:px-8">


                {/* ==================================
                    MESSAGES
                ================================== */}

                {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400">
                        {success}
                    </div>
                )}


                {/* ==================================
                    PROFILE INFORMATION
                ================================== */}

                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

                    <div className="mb-6">

                        <h2 className="text-2xl font-bold">
                            Profile Information
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Keep your profile information up to date.
                        </p>

                    </div>


                    <form onSubmit={handleProfileUpdate}>


                        {/* EMAIL */}

                        <div className="mb-6">

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Email
                            </label>

                            <input
                                type="email"
                                value={
                                    profile?.email || ""
                                }
                                disabled
                                className="w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-500"
                            />

                            <p className="mt-2 text-xs text-slate-500">
                                Email cannot be changed.
                            </p>

                        </div>


                        {/* NAME */}

                        <div className="mb-6">

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your name"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                            />

                        </div>


                        {/* SKILLS */}

                        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

    <div className="mb-6">

        <h2 className="text-2xl font-bold">
            Your Skills
        </h2>

        <p className="mt-2 text-sm text-slate-400">
            Skills detected from your resume.
            You can add or remove skills before saving.
        </p>

    </div>


    {/* ==================================
        DETECTED SKILLS
    ================================== */}

    <div className="flex flex-wrap gap-3">

        {skills ? (

            skills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill !== "")
                .map((skill, index) => (

                    <div
                        key={`${skill}-${index}`}
                        className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
                    >

                        <span>
                            {skill}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                handleRemoveSkill(skill)
                            }
                            className="text-blue-400 hover:text-red-400"
                            title="Remove skill"
                        >
                            ✕
                        </button>

                    </div>

                ))

        ) : (

            <p className="text-slate-500">
                No skills detected yet.
            </p>

        )}

    </div>


    {/* ==================================
        ADD SKILL
    ================================== */}

    <div className="mt-6 flex flex-col gap-3 sm:flex-row">

        <input
            type="text"
            value={newSkill}
            onChange={(e) =>
                setNewSkill(e.target.value)
            }
            onKeyDown={(e) => {

                if (e.key === "Enter") {

                    e.preventDefault();

                    handleAddSkill();

                }

            }}
            placeholder="Add a skill, e.g. Docker"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />


        <button
            type="button"
            onClick={handleAddSkill}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
        >
            + Add Skill
        </button>

    </div>


    {/* ==================================
        SAVE
    ================================== */}

    <button
        type="button"
        onClick={handleProfileUpdate}
        disabled={saving}
        className="mt-5 rounded-lg bg-green-600 px-6 py-3 font-semibold hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
        {saving
            ? "Saving..."
            : "Save Skills"}
    </button>

</section>


                        <button
                            type="submit"
                            disabled={saving}
                            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Profile"}
                        </button>

                    </form>

                </section>


                {/* ==================================
                    SKILLS
                ================================== */}

                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <h2 className="text-2xl font-bold">
                                Your Skills
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Skills detected from your resume.
                            </p>

                        </div>

                        {profile?.skills?.length > 0 && (
                            <span className="w-fit rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                                {profile.skills.length} skills detected
                            </span>
                        )}

                    </div>


                    <div className="mt-5 flex flex-wrap gap-3">

                        {profile?.skills?.length > 0 ? (

                            profile.skills.map(
                                (skill, index) => (

                                    <span
                                        key={`${skill}-${index}`}
                                        className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
                                    >
                                        {skill}
                                    </span>

                                )
                            )

                        ) : (

                            <p className="text-slate-500">
                                No skills detected yet. Upload your resume.
                            </p>

                        )}

                    </div>

                </section>


                {/* ==================================
                    RESUME
                ================================== */}

                <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

                    <div className="mb-6">

                        <h2 className="text-2xl font-bold">
                            Resume
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Upload your latest resume as a PDF.
                            JobForge will automatically detect your skills.
                        </p>

                    </div>


                    {/* EXISTING RESUME */}

                    {profile?.resume && (

                        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-green-500/20 bg-green-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">

                                <div className="text-3xl">
                                    📄
                                </div>

                                <div>

                                    <p className="font-semibold">
                                        Resume uploaded
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Skills have been extracted from your resume.
                                    </p>

                                </div>

                            </div>


                            <a
                                href={`http://localhost:5000/${profile.resume}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-green-500/30 px-5 py-2 text-center text-sm font-semibold text-green-400 hover:bg-green-500/10"
                            >
                                View Resume
                            </a>

                        </div>

                    )}


                    {/* UPLOAD FORM */}

                    <form onSubmit={handleResumeUpload}>

                        <div className="rounded-xl border-2 border-dashed border-slate-700 p-8 text-center transition hover:border-blue-500/50">

                            <div className="text-4xl">
                                📄
                            </div>

                            <h3 className="mt-4 font-semibold">
                                Upload your resume
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                PDF only · Maximum 5 MB
                            </p>


                            <input
                                id="resumeInput"
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={(e) =>
                                    setResume(
                                        e.target.files[0]
                                    )
                                }
                                className="mx-auto mt-5 block w-full max-w-md text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-blue-500"
                            />


                            {resume && (

                                <p className="mt-4 text-sm text-blue-400">
                                    Selected: {resume.name}
                                </p>

                            )}

                        </div>


                        <button
                            type="submit"
                            disabled={
                                uploading ||
                                !resume
                            }
                            className="mt-5 rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {uploading
                                ? "Extracting Skills..."
                                : "Upload & Analyze Resume"}
                        </button>

                    </form>

                </section>

            </main>

        </div>
    );
}

export default Profile;