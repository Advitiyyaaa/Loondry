AdminHome.jsx
import { useEffect, useState } from "react";
import { ChevronsRight, Search } from 'lucide-react';
import SlipCreated from "../adminSlip/SlipCreated";
import AtClinic from "../adminSlip/AtClinic";
import ReadyForPickup from "../adminSlip/ReadyForPickup";
import Completed from "../adminSlip/Completed";
import axiosClient from "../../utils/axiosClient";

const STATUSES = [
  "Slip-Created",
  "At Clinic",
  "Ready for Pickup",
  "Completed",
];

export default function AdminHome({theme}) {
    const [slips, setSlips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("Slip-Created");
    const [bagSearch, setBagSearch] = useState("");
    const [error, setError] = useState("");

    const fetchAllSlips = async (status = statusFilter, bag = bagSearch) => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get("/slip/admin/all", {
                params: {
                    status,
                },
            });
            setSlips(data.data || []);
        } catch (err) {
            console.error("Failed to fetch admin slips", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllSlips();
    }, [statusFilter, bagSearch]);

    const handleReject = async (id) => {
        await axiosClient.delete(`/slip/admin/reject/${id}`);
        fetchAllSlips(); 
    };


    const filteredSlips = slips.filter((slip) => {
        if (!bagSearch) return true;

        const bag = String(slip?.userId?.bagNo || "");
        return bag.startsWith(bagSearch);
    });

    const approveSlip = async (id) => {
        try {
            setError("");
            await axiosClient.put(`/slip/admin/approve/${id}`);
            fetchAllSlips();
        } catch (err) {
            const msg =
            err?.response?.data ||
            err?.message ||
            "Something went wrong";
            setError(msg);
        }
    };

    const handleReady = async (id) => {
        try {
            setError("");
            await axiosClient.put(`/slip/admin/ready/${id}`);
            fetchAllSlips();
        } catch (err) {
            const msg =
            err?.response?.data ||
            err?.message ||
            "Something went wrong";
            setError(msg);
        }
    };

    const handleComplete = async (id, otp) => {
        try {
            setError("");
            await axiosClient.put(`/slip/admin/complete/${id}`, { otp });
            fetchAllSlips();
        } catch (err) {
            const msg =
            err?.response?.data ||
            err?.message ||
            "Something went wrong";
            setError(msg);
        }
    };

    const active =
        theme === "dark"
        ? "bg-white text-black border-white"
        : "bg-black text-white border-black";
    const inactive =
        theme === "dark"
        ? "border-white hover:bg-white hover:text-black"
        : "border-black hover:bg-black hover:text-white";

    return (
        <div className="w-[89%] sm:w-[96.5%] mx-auto my-2 min-h-screen transition-all">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex overflow-x-auto gap-2 sm:gap-4 text-[11px] sm:text-sm tracking-wider">
                        {["Slip-Created", "At Clinic", "Ready for Pickup", "Completed"].map(
                            (s, i) => (
                                <div key={s} className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            if (s === statusFilter) return; 
                                            setStatusFilter(s);
                                        }}
                                        className={`
                                            ${statusFilter === s ? active : inactive}
                                            border-2 px-3 py-1 uppercase transition-all 
                                            hover:bg-black hover:text-white
                                            ${theme==="dark" && "dark:hover:bg-white dark:hover:text-black"}
                                        `}
                                    >
                                        {s}
                                    </button>

                                    {i < STATUSES.length - 1 && (
                                        <ChevronsRight className="h-6 w-6 opacity-50" />
                                    )}
                                </div>
                            )
                        )}
                </div>
                <div className="relative flex items-center w-full sm:w-56 sd:w-64">
                    <input
                        type="number"
                        placeholder="Search by Bag No"
                        value={bagSearch}
                        onChange={(e) => setBagSearch(e.target.value)}
                        className="
                        w-full border px-3 py-2 pr-9 text-sm outline-none
                        bg-transparent placeholder:text-gray-500
                        focus:ring-2 focus:ring-offset-0 focus:ring-black
                        dark:focus:ring-white
                        "
                    />
                    <Search className="absolute right-3 h-4 w-4 opacity-60 pointer-events-none" />
                </div>


            </div>
            {loading ? (
                <div className="flex justify-center items-center mt-60">
                    <div className="h-6 w-6 rounded-full border-2 border-current border-t-transparent animate-spin opacity-60" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-3 sm:mt-4">
                    {filteredSlips.length === 0 ? (
                        <div className="col-span-full text-center opacity-60 py-10 text-sm mt-50">
                        No slips found.
                        </div>
                    ) : (
                        filteredSlips.map((slip) => {
                        if (slip?.status === "Slip-Created") {
                            return (
                            <SlipCreated
                                key={slip._id}
                                slip={slip}
                                theme={theme}
                                onApprove={approveSlip}
                                onReject={handleReject}
                                error={error}
                            />
                            );
                        }

                        if (slip?.status === "At Clinic") {
                            return (
                            <AtClinic
                                slip={slip}
                                theme={theme}
                                onReady={handleReady}
                                error={error}
                            />
                            );
                        }

                        if (slip?.status === "Ready for Pickup") {
                            return (
                            <ReadyForPickup
                                slip={slip}
                                theme={theme}
                                onComplete={handleComplete}
                                error={error}
                            />
                            );
                        }

                        if (slip?.status === "Completed") {
                            return (
                            <Completed
                                slip={slip}
                                theme={theme}
                            />
                            );
                        }

                        return null;
                        })
                    )}
                </div>
            )}      
        </div>
    );
}

