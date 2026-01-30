import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserComplainCard from "../components/Complain/UserComplainCard";
import axiosClient from "../utils/axiosClient";

export default function UserComplainPage() {
  const [complains, setComplains] = useState([]);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme.theme);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="p-4 min-h-screen space-y-3 w-[89%] sm:w-[96.5%] mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">My Complaints</h2>
        <button
          disabled={loading}
          onClick={fetchComplains}
          className={`border px-2 py-1 text-xs ${theme==="dark" ?"hover:bg-white hover:text-black":"hover:bg-black hover:text-white"}`}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="border border-red-600 text-red-500 border-dashed text-sm px-2 py-1">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm opacity-70 tracking-widest text-center sm:text-left">
          Loading complaints...
        </p>
      ) : complains.length === 0 ? (
        <p className="text-sm opacity-70">
          You have not raised any complaints yet.
        </p>
      ) : (
        <div className="space-y-3 sm:space-y-2">
          {complains.map((c) => (
            <UserComplainCard key={c._id} complain={c} />
          ))}
        </div>
      )}

    </div>
  );
}


