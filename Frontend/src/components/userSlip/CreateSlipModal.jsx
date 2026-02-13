import { useState, useEffect } from "react";
import axiosClient from "../../utils/axiosClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const REGULAR_FIELDS = [
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

const PAID_FIELDS = [
  { key: "jacket", label: "Jacket" },
  { key: "blanket", label: "Blanket" },
  { key: "comforter", label: "Comforter" },
  { key: "hoodie", label: "Hoodie" },
  { key: "sweater", label: "Sweater" },
];

const calcRegular = (clothes = {}) => {
  const outer =
    (clothes.kurta || 0) +
    (clothes.pajama || 0) +
    (clothes.shirt || 0) +
    (clothes.tshirt || 0) +
    (clothes.pant || 0) +
    (clothes.lower || 0) +
    (clothes.shorts || 0) +
    (clothes.bedsheet || 0) +
    (clothes.pillowCover || 0) +
    (clothes.towel || 0) +
    (clothes.duppata || 0);

  const inner =
    (clothes.underGarments || 0) +
    (clothes.socks || 0) +
    (clothes.hankey || 0);

  return { outer, inner, total: outer + inner };
};

const calcPaid = (paid = {}, custom = []) => {
  const base =
    (paid.jacket || 0) +
    (paid.blanket || 0) +
    (paid.comforter || 0) +
    (paid.hoodie || 0) +
    (paid.sweater || 0);

  const customTotal = custom.reduce((s, i) => s + (i.qty || 0), 0);
  return base + customTotal;
};

const slipSchema = z.object({
  type: z.enum(["Regular", "Paid"]),
  clothes: z.any(),
  paidItems: z.any(),
  customItems: z.any(),
}).superRefine((data, ctx) => {

  if (data.type === "Regular") {
    const { outer, inner, total } = calcRegular(data.clothes);

    if (total === 0)
      ctx.addIssue({ code: "custom", message: "Add at least 1 clothing item", path: ["clothes"]});

    if (outer > 10)
      ctx.addIssue({ code: "custom", message: "Outer clothes cannot exceed 10", path: ["clothes"]});

    if (inner > 5)
      ctx.addIssue({ code: "custom", message: "Inner clothes cannot exceed 5", path: ["clothes"]});

    if (total > 15)
      ctx.addIssue({ code: "custom", message: "No more than 15 clothes can be added", path: ["clothes"]});
  }

  if (data.type === "Paid") {
    const total = calcPaid(data.paidItems, data.customItems);

    if (total === 0)
      ctx.addIssue({ code: "custom", message: "Add at least 1 paid item", path: ["customItems"]});

    if (total > 5)
      ctx.addIssue({ code: "custom", message: "Total paid items cannot exceed 5", path: ["customItems"]});

    data.customItems?.forEach((item, i) => {
      if (!item.name?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: `Custom item ${i + 1} name required`,
          path: ["customItems", i, "name"] ,
        });
      }
    });
  }
});

export default function CreateSlipModal({ closeModal, theme, onCreated }) {
  const [type, setType] = useState("Regular");
  const [clothes, setClothes] = useState({});
  const [paidItems, setPaidItems] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const form = useForm({
    resolver: zodResolver(slipSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      type: "Regular",
      clothes: {},
      paidItems: {},
      customItems: [],
    },
  });

  useEffect(() => {
    form.setValue("type", type, { shouldValidate: false });
    form.setValue("clothes", clothes, { shouldValidate: false });
    form.setValue("paidItems", paidItems, { shouldValidate: false });
    form.setValue("customItems", customItems, { shouldValidate: false });
  }, [type, clothes, paidItems, customItems]);


  const getFirstError = (errObj) => {
    for (const key in errObj) {
      if (errObj[key]?.message) return errObj[key].message;
      if (typeof errObj[key] === "object") {
        const nested = getFirstError(errObj[key]);
        if (nested) return nested;
      }
    }
  };

  const inc = (setFn, key) =>
    setFn((p) => ({ ...p, [key]: (p[key] || 0) + 1 }));
  const dec = (setFn, key) =>
    setFn((p) => ({ ...p, [key]: Math.max(0, (p[key] || 0) - 1) }));

  const handleCreate = form.handleSubmit(
    async () => {
      try {
        setLoading(true);
        setError("");

        const payload =
          type === "Regular"
            ? { type, clothes }
            : { type, paidItems: { ...paidItems, customItems } };

        await axiosClient.post("/slip/create", payload);

        await onCreated?.();
        closeModal();
      } catch (err) {
        const msg =
          typeof err?.response?.data === "string"
            ? err.response.data
            : err?.response?.data?.message || "Failed to create slip";

        setError(msg);
      } finally {
        setLoading(false);
      }
    },

    (errors) => {
      setError(getFirstError(errors) || "Invalid slip data");
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div
        className={`border-2 p-3 w-[80%] lg:w-[28%] max-w-md ${
          theme === "dark"
            ? "bg-black border-white text-white"
            : "bg-white border-black text-black"
        }`}
      >
        <div className="flex justify-between items-center p-2 border-b">
          <p className="font-bold tracking-wide">Create Slip</p>
        </div>

        <div className="p-2 space-y-4 text-sm">
          <div>
            <p className="text-[10px] uppercase opacity-60 mb-1">Slip Type</p>
            <div className="flex gap-2">
                {["Regular", "Paid"].map((t) => {
                    const isActive = type === t;

                    return (
                    <button
                        key={t}
                        onClick={() => {
                            setType(t);
                            setError("")
                        }}
                        className={`
                        border px-3 py-1 text-xs transition-colors
                        ${
                            isActive
                            ? theme === "dark"
                                ? "bg-white text-black border-white"
                                : "bg-black text-white border-black"
                            : theme === "dark"
                                ? "border-white text-white hover:bg-white hover:text-black"
                                : "border-black text-black hover:bg-black hover:text-white"
                        }
                        `}
                    >
                        {t}
                    </button>
                    );
                })}
            </div>
        </div>

          {type === "Regular" && (
            <div className="space-y-2">
              {REGULAR_FIELDS.map(({ key, label }) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="opacity-80">{label}</span>
                  <div className="flex border items-center gap-2">
                    <button className="px-2" onClick={() => dec(setClothes, key)}>−</button>
                    <span className="min-w-6 text-center">
                      {clothes[key] || 0}
                    </span>
                    <button className="px-2" onClick={() => inc(setClothes, key)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

            {type === "Paid" && (
                <div className="space-y-3">
                    {/* Default paid fields */}
                    {PAID_FIELDS.map(({ key, label }) => (
                    <div key={key} className="flex justify-between items-center">
                        <span className="opacity-80">{label}</span>
                        <div className="flex border items-center gap-2">
                        <button className="px-2" onClick={() => dec(setPaidItems, key)}>−</button>
                        <span className="min-w-6 text-center">
                            {paidItems[key] || 0}
                        </span>
                        <button className="px-2" onClick={() => inc(setPaidItems, key)}>+</button>
                        </div>
                    </div>
                    ))}

                    {/* Custom items */}
                    {customItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                        <input
                        value={item.name}
                        onChange={(e) => {
                            const next = [...customItems];
                            next[idx] = { ...next[idx], name: e.target.value };
                            setCustomItems(next);
                        }}
                        placeholder="Custom item"
                        className="border px-2 py-1 text-xs w-1/2 bg-transparent"
                        />

                        <div className="flex border items-center gap-2">
                        <button
                            className="px-2"
                            onClick={() => {
                                setCustomItems((prev) => {
                                const next = [...prev];

                                if (next[idx].qty <= 1) {
                                    // remove this item entirely
                                    next.splice(idx, 1);
                                } else {
                                    // just decrement
                                    next[idx] = {
                                    ...next[idx],
                                    qty: next[idx].qty - 1,
                                    };
                                }

                                return next;
                                });
                            }}
                        >
                            −
                        </button>


                        <span className="min-w-6 text-center">{item.qty}</span>

                        <button
                            className="px-2"
                            onClick={() => {
                            const next = [...customItems];
                            next[idx].qty += 1;
                            setCustomItems(next);
                            }}
                        >
                            +
                        </button>
                        </div>
                    </div>
                    ))}

                    {/* Add custom item */}
                    <button
                    onClick={() =>
                        setCustomItems((p) => [...p, { name: "", qty: 1 }])
                    }
                    className="border border-dashed px-3 py-1 text-xs w-full opacity-70 hover:opacity-100"
                    >
                    + Add custom item
                    </button>
                </div>
            )}


          {error && (
            <div className="border border-dashed text-red-600 px-3 py-2 text-xs">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={closeModal} className={`border px-3 py-1 text-xs ${theme === "dark" ? "hover:bg-white hover:text-black hover:border-white" : "hover:bg-black hover:text-white hover:border-black"}`}>
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className={`border px-3 py-1 text-xs ${theme === "dark" ? "hover:bg-white hover:text-black hover:border-white" : "hover:bg-black hover:text-white hover:border-black"}`}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
