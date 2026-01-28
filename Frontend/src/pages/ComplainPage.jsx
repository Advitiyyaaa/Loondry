import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ComplainCard from "../components/Complain/ComplainCard";
import axiosClient from "../utils/axiosClient";

export default function ComplainPage() {
  const [complains, setComplains] = useState([]);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchComplains = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axiosClient.get("/complain/my");
      setComplains(data || []);
    } catch (err) {
      setError(err?.response?.data || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  if(!isAuthenticated){
    return <div className="w-[89%] min-h-screen sm:w-[96.5%] mx-auto sm:text-xl flex opacity-70 pb-85 justify-center items-center">Login/Register to see your complaints!</div>;
  }

  if (loading) {
    return <div className="p-4 text-sm w-[89%] min-h-screen sm:w-[96.5%] mx-auto tracking-widest">Loading complaints...</div>;
  }

  return (
    <div className="p-4 min-h-screen space-y-3 w-[89%] sm:w-[96.5%] mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">My Complaints</h2>
        <button
          onClick={fetchComplains}
          className="border px-2 py-1 text-xs"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="border border-red-600 text-red-500 border-dashed text-sm px-2 py-1">
          {error}
        </div>
      )}

      {complains.length === 0 ? (
        <p className="text-sm opacity-70">You have not raised any complaints yet.</p>
      ) : (
        <div className="space-y-2">
          {complains.map((c) => (
            <ComplainCard key={c._id} complain={c} />
          ))}
        </div>
      )}
    </div>
  );
}


