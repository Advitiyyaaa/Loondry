import { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";

export default function SlipModal({ slipId, closeModal, theme }) {
    const [slip, setSlip] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className={`border-2 p-4 w-[90%] max-w-md
                ${theme === "dark" ? "bg-black text-white border-white" : "bg-white text-black border-black"}
           `}>
                <p className="font-bold mb-2">{formatDate(slip?.createdAt)}</p>
                <p className="text-sm mb-4">{slipId}</p>

                <button
                    onClick={closeModal}
                    className="border-2 px-3 py-1"
                >
                    Close
                </button>
            </div>
        </div>
    )
}