import { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import RegularSlip from "./RegularSlip";
import PaidSlip from "./PaidSlip";

export default function SlipModal({ slipId, closeModal, theme, fetchedSlips }) {
    const [slip, setSlip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [localClothes, setLocalClothes] = useState({});
    const [updating, setUpdating] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (slip?.clothes) {
            setLocalClothes(slip.clothes);
        }
    }, [slip]);

    useEffect(() => {
        const fetchSlip = async () => {
        try {
            const { data } = await axiosClient.get(`/slip/${slipId}`);
            setSlip(data.slip || data);
            console.log(data);
        } catch (err) {
            console.error("Failed to fetch slip", err);
        } finally {
            setLoading(false);
        }
        };
        
        fetchSlip();
    }, [slipId]);

    const handleUpdate = async () => {
        try {
            setUpdating(true);
            setError("");
            setSuccess(false);

            const { data } = await axiosClient.put(`/slip/update/${slipId}`, {
            clothes: localClothes,
            });

            setSlip(data);
            setLocalClothes(data.clothes);
            setSuccess(true);
        } catch (err) {
            console.error(err);

            const backendMsg =
            typeof err?.response?.data === "string"
                ? err.response.data
                : err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Failed to update slip";

            setError(backendMsg);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
    try {
        await axiosClient.delete(`/slip/delete/${slipId}`);

        // Refresh list in Home
        await fetchedSlips();

        // Close modal
        closeModal();
    } catch (err) {
        const msg =
        typeof err?.response?.data === "string"
            ? err.response.data
            : err?.response?.data?.message || "Failed to delete slip";
        setError(msg);
    }
    };



    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "";

        const parts = d
        .toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        .replace(/,/g, "")
        .split(" ");

        return `${parts[0]}, ${parts[1]} ${parts[2]} ${parts[3]}`;
    };

    const increment = (key) => {
        setSuccess(false);
        setLocalClothes((prev) => ({
            ...prev,
            [key]: (prev[key] || 0) + 1,
        }));
    };

    const decrement = (key) => {
        setSuccess(false);
        setLocalClothes((prev) => ({
            ...prev,
            [key]: Math.max(0, (prev[key] || 0) - 1),
        }));
    };

    const hasChanges = slip?.clothes
        ? Object.keys(slip.clothes).some(
            (key) => slip.clothes[key] !== localClothes[key]
            )
        : false;

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            {loading ? (
                <div className="h-6 w-6 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : (
            <div className={`border-2 p-3 w-[28%] max-w-md ${theme === "dark"? "bg-black border-white text-white" : "bg-white border-black text-black"}`}>
                <div className="flex justify-between items-center p-2">
                    <p className="font-bold">{formatDate(slip?.createdAt)}</p>
                    <div className="flex gap-4">
                        <p className="text-sm tracking-wider font-semibold">{slip?.status}</p>
                        <p className="text-sm tracking-wider font-semibold">{slip?.type}</p>
                    </div>
                </div>
                    
                <div className="px-2 text-sm">
                    {slip?.type === "Regular" && (
                        <RegularSlip
                            slip={slip}
                            localClothes={localClothes}
                            increment={increment}
                            decrement={decrement}
                        />
                    )}

                    {slip?.type === "Paid" && <PaidSlip slip={slip} />}

                </div>
                {error && (
                    <div className={`w-[96%] mx-auto mt-2 border border-dashed text-red-600 ${theme === "dark" ? "border-white" : "border-black"} px-3 py-2 text-xs tracking-wide`}>
                        {error}
                    </div>
                )}
                {success && !error && (
                    <div className={`w-[96%] mx-auto border mt-2 border-dashed text-green-600 ${theme === "dark" ? "border-white" : "border-black"} px-3 py-2 text-xs tracking-wide`}>
                        Slip Updated Successfully
                    </div>
                )}
                {(slip?.status === "At Clinic" || slip?.status === "Ready for Pickup") && (
                    <div className="mt-2 border border-dashed mx-2 py-2 text-center">
                        <p className="text-[10px] uppercase tracking-widest opacity-60">
                            Pickup OTP
                        </p>
                        <p className="mt-1 text-lg font-bold tracking-wider">
                            {slip?.otp}
                        </p>
                    </div>
                )}

                <div className="flex justify-between mt-3 items-center px-2">
                    <div className="flex gap-2"> 
                        {(slip?.status !== "At Clinic" && slip?.status !== "Ready for Pickup") && (
                            <div className="dropdown dropdown-top">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="border-2 px-3 py-1 text-sm hover:bg-red-600"
                                >
                                    Delete
                                </div>

                                <div
                                    tabIndex={0}
                                    className={`dropdown-content z-10 mb-2 w-64 border bg-white text-black ${theme === "dark" && ("dark:bg-black dark:text-white")}`}>
                                    <div className="p-3 border space-y-3">
                                    <p className="text-xs opacity-80">
                                        Are you sure you want to delete this slip? This action cannot be undone.
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
                                            handleDelete();
                                            document.activeElement?.blur();
                                        }}
                                        className="border px-2 py-1 text-xs hover:bg-red-600"
                                        >
                                        Yes
                                        </button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        )}   
                        
                        {slip?.status === "Slip-Created" && slip?.type==="Regular" && (
                            <button
                            onClick={handleUpdate}
                            disabled={updating || !hasChanges}
                            className="border-2 px-3 py-1 text-sm hover:bg-blue-700"
                            >
                                {updating ? "Updating..." : "Update"}
                            </button>
                        )}
                    </div>
                    <button
                        onClick={closeModal}
                        className={`border-2 px-3 py-1 hover:bg-black hover:text-white ${theme==='dark' && ("dark:hover:bg-white dark:hover:text-black")}`}
                    >
                        Close
                    </button>
                </div>
                
            </div>
            )}
        </div>
    )
}