export default function Slip({ loading, slips, theme }) {
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

  return (
    <>
      {loading &&
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`border-2 p-3 flex justify-between items-center animate-pulse
              ${theme === "dark" ? "border-white" : "border-black"}
            `}
          >
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-700"></div>
              <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-600"></div>
            </div>
            <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
          </div>
        ))}

      {!loading && slips.length === 0 && (
        <p className="text-sm opacity-70 col-span-2">No slips found.</p>
      )}

      {!loading &&
        slips.map((slip) => (
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
              <p className="font-bold">{formatDate(slip.createdAt)}</p>
              <p className="text-xs opacity-70">{slip.status}</p>
            </div>

            <div className="text-sm">{slip.type}</div>
          </div>
        ))}
    </>
  );
}
