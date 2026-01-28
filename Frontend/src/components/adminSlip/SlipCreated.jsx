export default function SlipCreated({ slip, theme, onApprove, onReject, error }) {
    const total =
        slip.type === "Regular"
            ? Object.values(slip.clothes || {}).reduce((sum, v) => sum + (v || 0), 0)
            : (() => {
                const base = Object.entries(slip.paidItems || {})
                .filter(([k]) => k !== "customItems")
                .reduce((sum, [, v]) => sum + (v || 0), 0);

                const custom = (slip.paidItems?.customItems || []).reduce(
                (sum, item) => sum + (item.qty || 0),
                0
                );

                return base + custom;
            }
        )();       
    
        const formatDateOnly = (dateStr) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return "";

            return d.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        };

    return (
        <div
            className={`border-2 p-3 text-xs space-y-2 h-80 flex flex-col`}
        >
            <div>
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold tracking-wide">
                        #{slip?.userId?.bagNo}
                        </p>
                        <p className="text-[12px] ">{formatDateOnly(slip?.createdAt)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-[12px] opacity-80">
                            {slip?.userId?.emailId}
                        </p>
                        <p className="text-[12px] opacity-80">
                            {slip?.type}
                        </p>
                    </div>
                </div>
                
            </div>
            <div className="flex-1 overflow-y-auto border-t pt-2">
                {/* Regular clothes */}
                {slip.type === "Regular" && (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-2">
                    {Object.entries(slip.clothes || {}).map(([k, v]) =>
                        v > 0 ? (
                        <div key={k} className="flex justify-between w-[85%]">
                            <span className="opacity-70">{k}</span>
                            <span>{v}</span>
                        </div>
                        ) : null
                    )}
                    </div>
                )}

                {/* Paid items */}
                {slip.type === "Paid" && (
                    <div className="gap-x-3 gap-y-1 pt-2">
                        {Object.entries(slip.paidItems || {}).map(([k, v]) => {
                            if (k === "customItems") {
                            return v?.map((item, i) => (
                                <div key={i} className="flex justify-between col-span-2">
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
                )}
            </div>
            <div className="border border-dashed px-1 mt-1 py-1 flex justify-between font-semibold">
                <span>Total</span>
                <span>{total}</span>
            </div>
            <div className="flex justify-end gap-2 mt-auto">
                <div className="dropdown dropdown-top">
                    <div
                        tabIndex={0}
                        role="button"
                        className="border-2 px-3 py-1 text-xs hover:bg-red-600"
                    >
                        Reject
                    </div>
                    <div
                        tabIndex={0}
                        className={`dropdown-content z-10 mb-2 w-64 border bg-white text-black ${theme === "dark" && ("dark:bg-black dark:text-white")}`}>
                    <div className="p-3 border space-y-3">
                    <p className="text-xs opacity-80">
                        Are you sure you want to reject this slip? It will be permanently deleted and cannot be recovered.
                    </p>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => document.activeElement?.blur()}
                            className={`border px-2 py-1 text-xs hover:bg-black hover:text-white ${theme==='dark' && ("dark:hover:bg-white dark:hover:text-black")}`}
                        >
                            No
                        </button>
                        <button
                            onClick={() => {
                                onReject(slip._id);
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

                <button 
                    onClick={() => onApprove(slip._id)}
                    className="border-2 px-2 py-1 hover:bg-green-800"
                >
                    Approve
                </button>
            </div>
        </div>
    );
}
