import { useState } from "react";
import axiosClient from "../../utils/axiosClient";

export default function AdminComplainCard({ complain, onResolved}) {
    const [active, setActive] = useState(false);
    const [reply, setReply] = useState("");
    const [error, setError] = useState("");

    const resolve = async () => {
        if (!reply.trim()) {
            setError("Clinic note is required to resolve");
            return;
        }

        try {
            setError("");
            await axiosClient.put(`/complain/admin/resolve/${complain._id}`, {
            clinicNote: reply,
            });

            setActive(false);
            setReply("");
            onResolved();
        } catch (err) {
            console.log(err?.response);
            setError(err?.response?.data || "Failed to resolve complaint");
        }
    };


    const formatDate = (d) =>
      new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    const formatTimeOnly = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).toUpperCase();

    return (
        <div className="border mt-3 text-sm mb-8">
            <div className="flex flex-col gap-0.5 px-3 p-2">
                <div className="flex justify-between items-center">
                    <p className={`font-semibold py-0.5 pl-1 pr-2 border border-dashed`}>#{complain?.userId?.bagNo}</p>
                    <p
                        className={`text-xs font-semibold tracking-wider ${
                            complain?.resolved ? "text-green-600" : "text-orange-600"
                        }`}
                        >
                        {complain?.resolved ? `Resolved on ${formatDate(complain?.resolvedAt)} at ${formatTimeOnly(complain?.resolvedAt)}` : "Pending"}
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="font-semibold">{complain?.userId?.emailId}</p>
                    <p className="text-xs opacity-70">
                        Raised on {formatDate(complain?.createdAt)} at {formatTimeOnly(complain?.createdAt)}
                    </p>
                </div>
                {complain?.slipId && (
                    <div className="border border-dashed py-2 my-2 text-xs space-y-1">
                        <div className="flex justify-between px-2 py-1">
                        <span className="font-semibold">
                            {complain?.slipId?.type} Slip
                        </span>
                        <span className="opacity-70">
                            {complain?.slipId?.status}
                        </span>
                        </div>

                        {/* Items */}
                        <div className="border-t border-dashed pt-2 space-y-1 px-2">
                        {complain.slipId.type === "Regular" &&
                            Object.entries(complain.slipId.clothes || {}).map(([k, v]) =>
                            v > 0 ? (
                                <div key={k} className="flex justify-between">
                                <span className="opacity-70">{k}</span>
                                <span>{v}</span>
                                </div>
                            ) : null
                            )}

                        {complain.slipId.type === "Paid" &&
                            Object.entries(complain.slipId.paidItems || {}).map(([k, v]) => {
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
                    </div>
                )}

            </div>
            <div className="border-t border-dashed pt-1 px-3 py-2">
                <p className="font-semibold text-blue-500">User Note</p>
                <p className="opacity-80 whitespace-pre-wrap">{complain?.userNote}</p>
            </div>

            {complain?.resolved && complain?.clinicNote && (
                <div className="border-t pt-1 px-3 py-2 border-dashed">
                <p className="font-semibold text-yellow-500">Clinic Reply</p>
                <p className="opacity-80 whitespace-pre-wrap">
                    {complain?.clinicNote}
                </p>
                </div>
            )}

            {!complain?.resolved && (
                
                <div className="border-t pt-2 space-y-2 px-3 py-2 border-dashed">
                    
                {active ? (
                    <>
                    <textarea
                        value={reply}
                        onChange={(e) => setReply(e?.target?.value)}
                        placeholder="Write clinic note..."
                        className="w-full border p-2 text-xs min-h-20"
                    />
                    {error && (
                        <p className="text-red-500 text-xs border border-red-400 px-2 py-1">
                            {error}
                        </p>
                    )}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setActive(false);
                                setReply("");
                                setError("");
                            }}
                            className="border px-2 py-1 hover:bg-red-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={resolve}
                            className="border px-2 py-1 hover:bg-green-700"
                        >
                            Resolve
                        </button>
                    </div>
                    
                    </>
                ) : (
                    <button
                    onClick={() => setActive(true)}
                    className="border px-2 py-1 hover:bg-yellow-600"
                    >
                        Reply & Resolve
                    </button>
                )}
                </div>
        )}
        </div>
    );
}