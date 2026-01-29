import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";


export default function AdminDashboard() {

  const theme = useSelector((state) => state.theme.theme);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    created: 0,
    atClinic: 0,
    ready: 0,
    completed: 0,
    complains: 0,
  });

  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
  try {
    setLoading(true);
    setError("");

    const [slipRes, complainRes] = await Promise.all([
      axiosClient.get("/slip/admin/all"),
      axiosClient.get("/complain/admin/all", { params: { unresolved: true } }),
    ]);

    const slips = slipRes.data?.data || [];
    const unresolvedComplains = complainRes.data || [];

    const next = {
      created: slips.filter(s => s.status === "Slip-Created").length,
      atClinic: slips.filter(s => s.status === "At Clinic").length,
      ready: slips.filter(s => s.status === "Ready for Pickup").length,
      completed: slips.filter(s => s.status === "Completed").length,
      complains: unresolvedComplains.length,
    };

    setStats(next);
    setRecent(slips.slice(0, 6));
  } catch (err) {
    setError(err?.response?.data || err?.message || "Failed to load dashboard");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center w-[89%] sm:w-[96.5%] mx-auto min-h-screen">
        <div className="h-8 w-8 rounded-full border-2 border-current border-t-transparent animate-spin opacity-60 mt-50" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 w-[89%] sm:w-[96.5%] mx-auto min-h-screen">
      {error && (
        <div className="border border-red-400 text-red-600 text-xs px-2 py-1">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          theme={theme}
          title="Slip-Created"
          value={stats.created}
          onClick={() => navigate(`/home?status=${encodeURIComponent("Slip-Created")}`)}
        />

        <StatCard
          theme={theme}
          title="At Clinic"
          value={stats.atClinic}
          onClick={() => navigate(`/home?status=${encodeURIComponent("At Clinic")}`)}
        />

        <StatCard
          theme={theme}
          title="Ready"
          value={stats.ready}
          onClick={() => navigate(`/home?status=${encodeURIComponent("Ready for Pickup")}`)}
        />

        <StatCard
          theme={theme}
          title="Completed"
          value={stats.completed}
          onClick={() => navigate(`/home?status=${encodeURIComponent("Completed")}`)}
        />
        <StatCard theme={theme} title="Complaints" value={stats.complains} onClick={() => navigate("/admin/complaints")} />
      </div>


      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold">Recent Slips</h2>
          <button
            disabled={loading}
            onClick={fetchDashboard}
            className={`border px-2 py-1 text-xs ${theme === "dark" ? "hover:bg-white hover:text-black" : "hover:bg-black hover:text-white"}`}
          >
            Refresh
          </button>
        </div>

        <div className="space-y-2">
          {recent.map((s) => (
            <div key={s._id} className="flex justify-between text-xs border p-2">
              <div>
                <p className="font-semibold">#{s?.userId?.bagNo}</p>
                <p className="opacity-70">{s?.userId?.emailId}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{s.status}</p>
                <p className="opacity-70">{s.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, onClick, theme }) {
  return (
    <div
      onClick={onClick}
      className={`border-2 p-3 flex flex-col gap-1 cursor-pointer transition ${theme === "dark" ? "hover:bg-white hover:text-black" : "hover:bg-black hover:text-white"}`}
    >
      <p className="text-xs opacity-70">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

