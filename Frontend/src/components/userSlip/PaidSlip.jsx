export default function PaidSlip({ slip }) {
  const paid = slip?.paidItems;

  if (!paid) return null;

  const BASE_FIELDS = [
    { key: "jacket", label: "Jacket" },
    { key: "blanket", label: "Blanket" },
    { key: "comforter", label: "Comforter" },
    { key: "hoodie", label: "Hoodie" },
    { key: "sweater", label: "Sweater" },
  ];

  return (
    <div className="mt-3 border-t p-2 pt-4 space-y-2 text-sm">
      {BASE_FIELDS.map(({ key, label }) => {
        const qty = paid[key] ?? 0;
        if (!qty) return null;

        return (
          <div key={key} className="flex items-center justify-between">
            <span className="opacity-80">{label}</span>
            <span className="min-w-6 text-center border">{qty}</span>
          </div>
        );
      })}

      {Array.isArray(paid.customItems) &&
        paid.customItems.map((item, i) => (
          <div key={`custom-${i}`} className="flex items-center justify-between">
            <span className="opacity-80">{item.name}</span>
            <span className="min-w-6 text-center border">{item.qty}</span>
          </div>
        ))}
    </div>
  );
}
