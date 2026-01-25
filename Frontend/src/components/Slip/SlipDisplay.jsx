export default function SlipDisplay({ loading, slips, theme, onOpen}) {

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
      {!loading && slips.length === 0 && (
        <p className="text-sm opacity-70 col-span-2">No slips found.</p>
      )}

      {!loading &&
        slips.map((slip) => (
          <div
            key={slip._id}
            onClick={() => onOpen(slip._id)}
            className={`border-2 p-3 flex justify-between items-center cursor-pointer
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
