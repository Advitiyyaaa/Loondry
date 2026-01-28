import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import axiosClient from "../utils/axiosClient";

export default function CreateComplain() {
    const [note, setNote] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [slip, setSlip] = useState(null);
    const [slipLoading, setSlipLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const theme = useSelector((state) => state.theme.theme);
    
    const [params] = useSearchParams();
    const slipId = params.get("slip");

    const navigate = useNavigate();

    useEffect(() => {
        if (!slipId) return;

        const fetchSlip = async () => {
        try {
            setSlipLoading(true);
            const { data } = await axiosClient.get(`/slip/${slipId}`);
            setSlip(data.slip || data);
        } catch {
            setError("Unable to load slip details");
        } finally {
            setSlipLoading(false);
        }
        };

        fetchSlip();
    }, [slipId]);

    const submit = async () => {
        if (!note.trim()) {
        setError("Please describe your issue");
        return;
        }

        try {
        setLoading(true);
        setError("");

        await axiosClient.post("/complain/create", {
            userNote: note,
            slipId,
        });

        setSuccess("Complaint submitted successfully");
        setNote("");

        // setTimeout(() => navigate("/complaints"), 1200);
        } catch (err) {
        setError(err?.response?.data || "Failed to submit complaint");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="p-4 w-[89%] sm:w-[96.5%] mx-auto space-y-3 min-h-screen">
        <h2 className="text-lg font-semibold">Raise a Complaint</h2>

        {/* Slip Preview */}
        {slipId && (
            <div className="border py-2 text-xs space-y-2">
                {slipLoading ? (
                <p className="opacity-70">Loading slip...</p>
                ) : slip ? (
                <>
                    <div className="flex justify-between">
                        <span className="px-2 font-semibold">{slip?.type} Slip</span>
                        <span className="px-2 opacity-70">{slip?.status}</span>
                    </div>
                    {/* Items */}
                    <div className="border-t pt-1 space-y-1 px-2">
                    {slip.type === "Regular" &&
                        Object.entries(slip.clothes || {}).map(([k, v]) =>
                        v > 0 ? (
                            <div key={k} className="flex justify-between">
                            <span className="opacity-70">{k}</span>
                            <span>{v}</span>
                            </div>
                        ) : null
                        )}

                    {slip.type === "Paid" &&
                        Object.entries(slip.paidItems || {}).map(([k, v]) => {
                        if (k === "customItems") {
                            return v?.map((item, i) => (
                            <div key={i} className="flex justify-between">
                                <span className="opacity-70">{item.name}</span>
                                <span>{item.qty}</span>
                            </div>
                            ));
                        }

                        return v > 0 ? (
                            <div key={k} className="flex justify-between">
                            <span className="opacity-70">{k}</span>
                            <span>{v}</span>
                            </div>
                        ) : null;
                        })}
                    </div>
                </>
                ) : null}
            </div>
            )}


        <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe your issue..."
            className="w-full border p-2 text-sm min-h-30"
        />

        {error && (
            <p className="border border-red-500 text-red-400 border-dashed text-sm px-2 py-2">
                {error}
            </p>
        )}
        {success && (
            <p className="border border-green-500 text-sm border-dashed px-2 py-2">
                {success}
            </p>
        )}

        <div className="flex justify-end gap-2">
            <button
                onClick={() => navigate(-1)}
                className={`border px-3 py-1 text-xs ${theme === "dark" ? "hover:bg-white hover:text-black":"hover:bg-black hover:text-white"}`}
            >
                Cancel
            </button>
            <button
                disabled={loading}
                onClick={submit}
                className={`border px-3 py-1 text-xs ${theme === "dark" ? "hover:bg-white hover:text-black":"hover:bg-black hover:text-white"}`}
            >
                Submit
            </button>
        </div>
        </div>
    );
}
