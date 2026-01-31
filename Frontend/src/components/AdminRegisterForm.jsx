import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import axiosClient from "../utils/axiosClient";

const adminSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters"),

    lastName: z
        .string()
        .trim()
        .optional(), 

    emailId: z
        .string()
        .email("Enter a valid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
});

export default function AdminRegisterForm({ theme }) {
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(adminSchema),
    });

    const submit = async (data) => {
        try {
        setError("");
        setMsg("");

        await axiosClient.post("/user/admin/register", data);

        setMsg("New admin created successfully");
        reset();
        } catch (err) {
        setError(err?.response?.data || "Failed to create admin");
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
        {/* First Name */}
        <div>
            <input
            placeholder="First Name"
            {...register("firstName")}
            className="border p-2 w-full text-sm bg-transparent placeholder:text-gray-500"
            />
            {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
                {errors.firstName.message}
            </p>
            )}
        </div>

        {/* Last Name (Optional) */}
        <div>
        <input
            placeholder="Last Name (optional)"
            {...register("lastName")}
            className="border p-2 w-full text-sm bg-transparent placeholder:text-gray-500"
        />
        </div>

        {/* Email */}
        <div>
            <input
            placeholder="Email"
            {...register("emailId")}
            className="border p-2 w-full text-sm bg-transparent placeholder:text-gray-500"
            />
            {errors.emailId && (
            <p className="text-red-500 text-xs mt-1">
                {errors.emailId.message}
            </p>
            )}
        </div>

        {/* Password */}
        <div>
            <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="border p-2 w-full text-sm bg-transparent placeholder:text-gray-500"
            />
            {errors.password && (
            <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
            </p>
            )}
        </div>

        {/* API messages */}
        {error && (
            <p className="text-red-500 text-xs border border-red-400 px-2 py-1">
            {error}
            </p>
        )}

        {msg && (
            <p className="text-green-500 text-xs border border-green-400 px-2 py-1">
            {msg}
            </p>
        )}

        <button
            disabled={isSubmitting}
            className={`border px-3 py-1 text-sm ${
            theme === "dark"
                ? "hover:bg-white hover:text-black"
                : "hover:bg-black hover:text-white"
            }`}
        >
            Create Admin
        </button>
        </form>
    );
}
