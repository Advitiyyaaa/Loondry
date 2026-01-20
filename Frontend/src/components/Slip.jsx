export default function Slip({ loading, slips, category, type, theme }) {

    const d = new Date(slips.createdAt);
    const parts = d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).replace(/,/g, "").split(" ");
    const formattedDate = `${parts[0]}, ${parts[1]} ${parts[2]} ${parts[3]}`;

    return (
        <div>
        {loading && <p className="text-sm opacity-70">Loading slips...</p>}

        {!loading && slips.length === 0 && (
            <p className="text-sm opacity-70">No slips found.</p>
        )}

        {!loading &&
            slips
            .filter((slip) => {
                const categoryMatch =
                category === "All" || slip.status === category;
                const typeMatch =
                type === "Regular" || slip.type === type;

                return categoryMatch && typeMatch;
            })
            .map((slip) => (
                <div
                key={slip._id}
                className={`border-2 p-3 flex justify-between items-center
                    ${
                    theme === "dark"
                        ? "border-white hover:bg-white hover:text-black"
                        : "border-black hover:bg-black hover:text-white"
                    }
                `}
                >
                <div>
                    <p className="font-bold">{formattedDate}</p>
                    <p className="text-xs opacity-70">{slip.status}</p>
                </div>

                <div className="text-sm">{slip.type}</div>
                </div>
            ))}
        </div>
   );
}
