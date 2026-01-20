import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Slip from "../components/Slip";
import axiosClient from "../utils/axiosClient";

export default function Home(){
    const theme = useSelector((state) => state.theme.theme);
    const [category, setCategory] = useState("All");
    const [type, setType] = useState("Regular");
    const [slips, setSlips] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSlips = async () => {
            try {
            setLoading(true);
            const { data } = await axiosClient.get("/slip/my");
            console.log("API data:", data);
            setSlips(data.slips || data);
            } catch (err) {
            console.error("Failed to fetch slips:", err);
            } finally {
            setLoading(false);
            }
        };
    fetchSlips();
    }, []);


    return (
        <div className="w-[96.5%] mx-auto my-2">
            <div className="flex justify-between">
                <div className="flex gap-3">
                    {/* Category */}
                    <div className="dropdown w-44">
                        <div
                        tabIndex={0}
                        role="button"
                        className={`border-2 py-1 px-2.5 m-1 text-center ${theme === "dark"
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
                        {["All", "Slip-Created", "At Clinic", "Ready For Pickup", "Completed"].map(
                            (item) => (
                            <li key={item}>
                                <button onClick={() => setCategory(item)}>{item}</button>
                            </li>
                            )
                        )}
                        </ul>
                    </div>
                    {/* Type */}
                    <div className="dropdown w-44">
                        <div
                        tabIndex={0}
                        role="button"
                        className={`border-2 py-1 px-2.5 m-1 text-center ${theme === "dark"
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
                        {["Regular", "Paid"].map((item) => (
                            <li key={item}>
                            <button onClick={() => setType(item)}>{item}</button>
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
                <div className="relative inline-block">
                    <div
                        className={`absolute inset-0 translate-x-0.5 translate-y-0.5 border-2 border-black bg-black
                        ${theme === "dark" && "dark:border-white dark:bg-white"}
                        `}
                    />
                    <button className={`relative z-9 border-2 px-2 py-2 ${theme === "dark" ? "dark:bg-black dark:text-white" : "bg-white text-black"}`}>
                        +Create Slip
                    </button>
                </div>

            </div>
            <div>
                <Slip
                    loading={loading}
                    slips={slips}
                    category={category}
                    type={type}
                    theme={theme}
                />
            </div>
        </div>
    )
}