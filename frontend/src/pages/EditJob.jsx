import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        company: "",
        description: "",
        location: "",
        salary: "",
        jobType: "Full-time",
        experience: "",
        skills: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/jobs/${id}`);

                const job = response.data.job;

                setFormData({
                    title: job.title || "",
                    company: job.company || "",
                    description: job.description || "",
                    location: job.location || "",
                    salary: job.salary || "",
                    jobType: job.jobType || "Full-time",
                    experience: job.experience || "",
                    skills: job.skills
                        ? job.skills.join(", ")
                        : ""
                });

            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load job"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.title.trim() ||
            !formData.company.trim() ||
            !formData.description.trim() ||
            !formData.location.trim() ||
            !formData.salary ||
            !formData.experience.trim() ||
            !formData.skills.trim()
        ) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            setSaving(true);

            const skillsArray = formData.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter((skill) => skill !== "");

            const jobData = {
                title: formData.title.trim(),
                company: formData.company.trim(),
                description: formData.description.trim(),
                location: formData.location.trim(),
                salary: Number(formData.salary),
                jobType: formData.jobType,
                experience: formData.experience.trim(),
                skills: skillsArray
            };

            const response = await api.put(
                `/jobs/${id}`,
                jobData
            );

            setSuccess(
                response.data.message ||
                "Job updated successfully!"
            );

            setTimeout(() => {
                navigate("/recruiter/dashboard");
            }, 1000);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update job"
            );

        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 px-6 py-20 text-center text-white">
                <div className="text-4xl">
                    ⏳
                </div>

                <p className="mt-4 text-slate-400">
                    Loading job...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Header */}
            <section className="border-b border-slate-800 bg-slate-900">
                <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">

                    <button
                        onClick={() =>
                            navigate("/recruiter/dashboard")
                        }
                        className="text-sm text-blue-400 hover:text-blue-300"
                    >
                        ← Back to Dashboard
                    </button>

                    <h1 className="mt-6 text-4xl font-bold">
                        Edit Job
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Update the details of your job posting.
                    </p>

                </div>
            </section>

            {/* Form */}
            <main className="mx-auto max-w-4xl px-6 py-10 lg:px-8">

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8"
                >

                    {/* Error */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400">
                            {success}
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">

                        {/* Title */}
                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Job Title *
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Frontend Developer"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* Company */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Company *
                            </label>

                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="e.g. Google"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* Location */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Location *
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Bangalore"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* Salary */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Salary *
                            </label>

                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                min="0"
                                placeholder="e.g. 800000"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* Job Type */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Job Type *
                            </label>

                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                            >
                                <option value="Full-time">
                                    Full-time
                                </option>

                                <option value="Part-time">
                                    Part-time
                                </option>

                                <option value="Internship">
                                    Internship
                                </option>

                                <option value="Contract">
                                    Contract
                                </option>
                            </select>

                        </div>

                        {/* Experience */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Experience *
                            </label>

                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="e.g. 0-2 years"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* Skills */}
                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Skills *
                            </label>

                            <input
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="React, Node.js, MongoDB"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                            />

                            <p className="mt-2 text-xs text-slate-500">
                                Separate skills using commas.
                            </p>

                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Job Description *
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="8"
                                placeholder="Describe the role, responsibilities and requirements..."
                                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                            />

                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving Changes..."
                                : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/recruiter/dashboard")
                            }
                            className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-300 hover:border-slate-500 hover:text-white"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </main>
        </div>
    );
}

export default EditJob;