import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Search } from 'lucide-react';
import AdminComplainCard from "../components/Complain/AdminComplainCard";
import axiosClient from "../utils/axiosClient";

export default function AdminComplaints() {
    const [complains, setComplains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showUnresolved, setShowUnresolved] = useState(true);
    const theme = useSelector((state) => state.theme.theme);
    const [bagSearch, setBagSearch] = useState("");

    const filteredComplains = complains.filter((c) => {
        if (!bagSearch) return true;
        const bag = String(c?.userId?.bagNo || "");
        return bag.startsWith(bagSearch);
    });


    const fetchComplains = async () => {
        try {
            setLoading(true);
            setError("");
            const { data } = await axiosClient.get("/complain/admin/all", {
                params: showUnresolved ? { unresolved: true } : {},
            });
            setComplains(data || []);
        } catch (err) {
            setError(err?.response?.data || "Failed to load complaints");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplains();
    }, [showUnresolved]);

    return (
        <div className="p-4 min-h-screen space-y-3 w-[89%] sm:w-[96.5%] mx-auto">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Complaints</h2>
            <div className="flex gap-2 items-center">
                <label className="text-xs flex items-center gap-1">
                    <input
                    type="checkbox"
                    checked={showUnresolved}
                    onChange={(e) => setShowUnresolved(e.target.checked)}
                    />
                    Unresolved only
                </label>
                <button
                    disabled={loading}
                    onClick={fetchComplains}
                    className={`border px-2 py-2.5 text-xs ${theme==="dark" ?"hover:bg-white hover:text-black":"hover:bg-black hover:text-white"}`}
                    >
                    Refresh
                </button>
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
        </div>

        {error && (
            <div className="border border-red-400 text-red-600 text-xs px-2 py-1">
            {error}
            </div>
        )}

        {loading ? (
            <p className="text-sm opacity-70 tracking-widest">
                Loading complaints...
            </p>
            ) : filteredComplains.length === 0 ? (
            <p className="text-sm opacity-70">No complaints found.</p>
            ) : (
            <div className="space-y-2">
                {filteredComplains.map((c) => (
                <AdminComplainCard
                    key={c._id}
                    complain={c}
                    onResolved={fetchComplains}
                />
                ))}
            </div>
        )}
        </div>
    );
}


