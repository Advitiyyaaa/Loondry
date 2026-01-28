    import { useDispatch, useSelector } from "react-redux";
    import { useState, useEffect } from "react";
    import SlipDisplay from "../components/userSlip/SlipDisplay";
    import SlipModal from "../components/userSlip/SlipModal";
    import { RotateCcw } from 'lucide-react';
    import CreateSlipModal from "../components/userSlip/CreateSlipModal";
    import axiosClient from "../utils/axiosClient";
    import { useLocation } from "react-router";
    import UserHome from "../components/Home/UserHome";
    import AdminHome from "../components/Home/AdminHome";

    export default function Home(){
        const theme = useSelector((state) => state.theme.theme);
        const { isAuthenticated, user } = useSelector((state) => state.auth);
        const [category, setCategory] = useState("All");
        const [type, setType] = useState("All");
        const [slips, setSlips] = useState([]);
        const [loading, setLoading] = useState(false);
        const [openSlipId, setOpenSlipId] = useState(null);
        const [queueCount, setQueueCount] = useState(0);
        const [queueLoading, setQueueLoading] = useState(false);
        const [openCreate, setOpenCreate] = useState(false);

        const location = useLocation();

        useEffect(() => {
            const id = location.state?.openSlipId;
            if (id) {
                setOpenSlipId(id);
            }
        }, [location.state]);

        const closeModal = () => setOpenSlipId(null);

        const fetchQueueCount = async () => {
            try {
                setQueueLoading(true);
                const { data } = await axiosClient.get("/slip/queue-count");
                setQueueCount(data.slipCreatedCount);
            } catch (err) {
                console.error("Failed to fetch queue count", err);
            } finally {
                setQueueLoading(false);
            }
        };

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

        useEffect(() => {
            fetchQueueCount();
        }, []);

        useEffect(() => {
            fetchSlips();
        }, []);

        const filteredSlips = slips.filter((slip) => {
            const categoryMatch =
                category === "All" || slip.status === category;

            const typeMatch =
                type === "All" || slip.type === type;

            return categoryMatch && typeMatch;
        });

        if (user?.role === "admin") {
            return (
                <AdminHome
                    theme = {theme}
                />
            );
        }

        return (
            <div className="w-[89%] sm:w-[96.5%] mx-auto my-2 min-h-screen">
                <div className="border-2 border-dashed py-2 text-sm opacity-85 text-center w-[99.8%] mx-auto mb-1 flex justify-center items-center">
                    <div>
                        {queueLoading ? "Checking queue…" : `${queueCount} estimated people in queue`}
                        <div className="text-xs">(Based on number of Slips Created)</div>
                    </div>
                    <RotateCcw 
                        onClick={fetchQueueCount}
                        disabled={queueLoading}
                        className="ml-1 opacity-80 hover:opacity-100 disabled:opacity-40"
                    />
                </div>
                {user?.role==="user" && (
                    <UserHome
                        theme={theme}
                        category={category}
                        setCategory={setCategory}
                        type={type}
                        setType={setType}
                        onCreate={() => setOpenCreate(true)}
                    />
                )}
                
                <div className={`${isAuthenticated ? "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4" : "flex justify-center items-center h-75"}`}>
                    {!isAuthenticated ? (
                        <p className="sm:text-xl opacity-70 col-span-2">
                            Login/Register to view and create slips!
                        </p>
                        ) : loading ? (
                        <div className="flex justify-center items-center col-span-2 h-32">
                            <div className="h-6 w-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        </div>  
                        ) : (
                        <SlipDisplay
                            loading={loading}
                            slips={filteredSlips}
                            theme={theme}
                            onOpen={(id) => setOpenSlipId(id)}
                        />
                    )}
                    {openSlipId && user?.role === "user" && (
                        <SlipModal
                            slipId={openSlipId}
                            closeModal={() => setOpenSlipId(null)}
                            theme={theme}
                            fetchedSlips={fetchSlips}
                            queue={fetchQueueCount}
                        />
                    )}
                    {openCreate && user?.role === "user" && (
                        <CreateSlipModal
                            theme={theme}
                            closeModal={() => setOpenCreate(false)}
                            onCreated={async () => {
                                await fetchSlips();
                                await fetchQueueCount();
                            }}
                        />
                    )}
                </div>
            </div>
        )
    }