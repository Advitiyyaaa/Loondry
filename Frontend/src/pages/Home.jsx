import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import SlipDisplay from "../components/Slip/SlipDisplay";
import SlipModal from "../components/Slip/SlipModal";
import axiosClient from "../utils/axiosClient";

export default function Home(){
    const theme = useSelector((state) => state.theme.theme);
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [category, setCategory] = useState("All");
    const [type, setType] = useState("All");
    const [slips, setSlips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openSlipId, setOpenSlipId] = useState(null);

    const closeModal = () => setOpenSlipId(null);

    useEffect(() => {
        const fetchSlips = async () => {
            try {
            setLoading(true);
            const { data } = await axiosClient.get("/slip/my");
            setSlips(data.slips || data);
            } catch (err) {
            console.error("Failed to fetch slips:", err);
            } finally {
            setLoading(false);
            }
        };
    fetchSlips();
    }, []);

    const filteredSlips = slips.filter((slip) => {
        const categoryMatch =
            category === "All" || slip.status === category;

        const typeMatch =
            type === "All" || slip.type === type;

        return categoryMatch && typeMatch;
    });

    return (
        <div className="w-[89%] sm:w-[96.5%] mx-auto my-2 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex gap-3 sm">
                    {/* Category */}
                    <div className="dropdown w-1/2 sm:w-44">
                        <span className="text-[10px] uppercase opacity-60 ml-2">Slip Status</span>
                        <div    
                        tabIndex={0}
                        role="button"
                        className={`border-3 py-1 px-2.5 m-1 text-center ${theme === "dark"
                            ? "hover:bg-white hover:text-black border-white"
                            : "hover:bg-black hover:text-white border-black"
                        }`}
                        >
                        {category}
                        </div>
                        <ul
                        tabIndex="-1"
                        className={`dropdown-content menu border-2 z-1 w-42 p-2 shadow-sm bg-white text-black ${theme === "dark" && "dark:bg-black dark:text-white"}`}
                        >
                        {["All", "Slip-Created", "At Clinic", "Ready for Pickup", "Completed"].map(
                            (item) => (
                            <li key={item}>
                                <button onClick={() => {
                                        setCategory(item);
                                        document.activeElement?.blur();
                                    }}
                                >{item}</button>
                            </li>
                            )
                        )}
                        </ul>
                    </div>
                    {/* Type */}
                    <div className="dropdown w-1/2 sm:w-44">
                        <span className="text-[10px] uppercase opacity-60 ml-2">Slip Type</span>
                        <div
                        tabIndex={0}
                        role="button"
                        className={`border-3 py-1 px-2.5 m-1 text-center ${theme === "dark"
                            ? "hover:bg-white hover:text-black border-white"
                            : "hover:bg-black hover:text-white border-black"
                        }`}
                        >
                        {type}
                        </div>
                        <ul
                        tabIndex="-1"
                        className={`dropdown-content menu border-2 z-1 w-42 p-2 shadow-sm bg-white text-black ${theme === "dark" && "dark:bg-black dark:text-white"}`}
                        >
                        {["All","Regular", "Paid"].map((item) => (
                            <li key={item}>
                            <button onClick={() =>{
                                    setType(item);
                                    document.activeElement?.blur();
                                }}
                            >{item}</button>
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
                <div className="relative inline-block mt-1 sm:mt-3 group w-full sm:w-auto">
                    <div
                        className={`absolute inset-0 translate-x-0.5 translate-y-0.5 border-2 border-black bg-black
                        ${theme === "dark" && "dark:border-white dark:bg-white"}
                        transition-transform duration-150 group-hover:translate-x-0 group-hover:translate-y-0
                        `}
                    />
                    <button
                        className={`relative border-2 px-2 py-2 w-full sm:w-auto
                            transition-transform duration-150
                            group-hover:translate-x-0.5 group-hover:translate-y-0.5
                            active:translate-x-0 active:translate-y-0
                            ${theme === "dark" ? "dark:bg-black dark:text-white" : "bg-white text-black"}
                        `}
                    >
                        +Create Slip
                    </button>
                </div>
            </div>
            <div className={`${isAuthenticated ? "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4" : "flex justify-center items-center h-75"}`}>
                {!isAuthenticated ? (
                    <p className="sm:text-xl opacity-70 col-span-2">Login/Register to view your slips!</p>
                ) : (
                <SlipDisplay
                    loading={loading}
                    slips={filteredSlips}
                    theme={theme}
                    onOpen={(id) => setOpenSlipId(id)}
                />)}
                {openSlipId && (
                    <SlipModal
                        slipId={openSlipId}
                        closeModal={() => setOpenSlipId(null)}
                        theme={theme}
                    />
                )}
            </div>
        </div>
    )
}