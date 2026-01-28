export default function RegularSlip({
  slip,
  localClothes,
  increment,
  decrement,
}) {
    const CLOTHES_FIELDS = [
        { key: "kurta", label: "Kurta" },
        { key: "pajama", label: "Pajama" },
        { key: "shirt", label: "Shirt" },
        { key: "tshirt", label: "T-Shirt" },
        { key: "pant", label: "Pant" },
        { key: "lower", label: "Lower" },
        { key: "shorts", label: "Shorts" },
        { key: "bedsheet", label: "Bedsheet" },
        { key: "pillowCover", label: "Pillow Cover" },
        { key: "towel", label: "Towel" },
        { key: "duppata", label: "Dupatta" },

        { key: "underGarments", label: "Under Garments" },
        { key: "socks", label: "Socks" },
        { key: "hankey", label: "Hankey" },
    ];  
    return (
        <div className="mt-3 border-t p-0.5 pt-2 space-y-2 text-sm">
        {CLOTHES_FIELDS.map(({ key, label }) => {
            const qty = localClothes?.[key] ?? 0;

            return (
            <div key={key} className="flex items-center justify-between">
                <span className="opacity-80">{label}</span>

                <div className="flex border items-center gap-2">
                {slip?.status === "Slip-Created" && (
                    <button
                    onClick={() => decrement(key)}
                    className="px-2 leading-none"
                    >
                    −
                    </button>
                )}

                <span className="min-w-6 text-center">{qty}</span>

                {slip?.status === "Slip-Created" && (
                    <button
                    onClick={() => increment(key)}
                    className="px-2 leading-none"
                    >
                    +
                    </button>
                )}
                </div>
            </div>
            );
        })}
        </div>
    );
    }
