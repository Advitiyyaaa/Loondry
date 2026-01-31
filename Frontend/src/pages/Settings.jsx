import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../store/authSlice";
import { Cog } from 'lucide-react';
import { useNavigate } from "react-router";

export default function Settings() {
    const { user } = useSelector((state) => state.auth);
    const theme = useSelector((state) => state.theme.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const bagSchema = (currentBag, lastBagChangeAt) =>
    z.object({
        bagNo: z
        .string()
        .min(1, "Bag number is required")
        .refine((val) => !isNaN(val), "Bag number must be a number")
        .refine((val) => Number(val) > 0, "Invalid bag number")
        .refine(
            (val) => Number(val) !== Number(currentBag),
            "Enter different Bag Number than your current bag Number"
        )
        .refine(() => {
            if (!lastBagChangeAt) return true;

            const now = new Date();
            const last = new Date(lastBagChangeAt);
            const diffDays =
            (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

            return diffDays >= 10;
        }, "Bag number can only be changed once in 10 days"),
    });

    const schema = bagSchema(user?.bagNo, user?.lastBagChangeAt);

    const {
        register,
        handleSubmit,
        formState: { errors },
        } = useForm({
        resolver: zodResolver(schema),
    });

    //Change Bag Number
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setMsg("");
            setError("");

            const res = await axiosClient.put("/user/bagNumber/change", {
                bagNo: data?.bagNo,
        });
        setMsg(res?.data?.message);
        reset();
        } catch (err) {
            setError(err?.response?.data || "Failed to update bag number");
        } finally {
            setLoading(false);
        }
    };

    //Delete Account
    const deleteAccount = async () => {
        try {
            await axiosClient.delete("/user/delete");
            dispatch(logoutUser());
            navigate("/");
        } catch (err) {
            alert(err?.response?.data || "Failed to delete account");
        }
    };

    return (
        <div className="w-[89%] sm:w-[96.5%] mx-auto min-h-screen p-4 space-y-4">
            <div className="flex items-center gap-1">
                <Cog />
                <h1 className="text-xl font-semibold">Settings</h1>
            </div>
            

            {/* Change Bag Number */}
            {user?.role === "user" && (
                <div className="border-2 p-4 space-y-3">
                    <h2 className="font-semibold">Change Bag Number</h2>
                    <p className="text-xs opacity-70">
                        You can change your bag number once every 10 days.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <input
                        type="number"
                        placeholder={`Current: ${user?.bagNo}`}
                        {...register("bagNo")}
                        className="w-full border p-2 text-sm bg-transparent placeholder:text-gray-500"
                    />

                    {errors.bagNo && (
                        <p className="text-red-500 text-xs">{errors.bagNo.message}</p>
                    )}

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
                        disabled={loading}
                        className={`border px-3 py-1 text-sm ${
                        theme === "dark"
                            ? "hover:bg-white hover:text-black"
                            : "hover:bg-black hover:text-white"
                        }`}
                    >
                        Update Bag Number
                    </button>
                    </form>
                </div>
            )}
            

            {/* Danger Zone */}
            <div className="border-2 border-red-600 p-4 space-y-3">
                <h2 className="font-semibold text-red-500">Danger Zone</h2>
                <p className="text-xs opacity-70">
                    Deleting your account will remove all slips, complaints and data permanently.
                </p>

                <div className="dropdown dropdown-top">
                    <div
                        tabIndex={0}
                        role="button"
                        className={`border px-3 py-1 text-sm hover:bg-red-600`}
                    >
                        Delete My Account
                    </div>

                    <div
                        tabIndex={0}
                        className={`dropdown-content z-10 mb-2 w-64 border bg-white text-black ${theme === "dark" && ("dark:bg-black dark:text-white")}`}
                    >
                        <div className="p-3 border space-y-3">
                            <p className="text-xs opacity-80">
                                This will permanently delete your account. Are you sure?
                            </p>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => document.activeElement?.blur()}
                                    className={`border px-2 py-1 text-xs hover:bg-black hover:text-white ${theme==='dark' && ("dark:hover:bg-white dark:hover:text-black")}`}
                                >
                                    No
                                </button>
                                <button
                                    onClick={()=>{
                                        deleteAccount();
                                    }}
                                    className="border px-2 py-1 text-xs hover:bg-red-600"
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
