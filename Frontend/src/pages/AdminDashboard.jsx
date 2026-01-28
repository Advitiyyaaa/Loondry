import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    created: 0,
    atClinic: 0,
    ready: 0,
    completed: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [allRes] = await Promise.all([
        axiosClient.get("/slip/admin/all"),
      ]);

      const slips = allRes.data?.data || [];

      const next = {
        created: slips.filter(s => s.status === "Slip-Created").length,
        atClinic: slips.filter(s => s.status === "At Clinic").length,
        ready: slips.filter(s => s.status === "Ready for Pickup").length,
        completed: slips.filter(s => s.status === "Completed").length,
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
    return <div className="p-6 text-sm">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 space-y-4 w-[98%] mx-auto min-h-screen">
      {error && (
        <div className="border border-red-400 text-red-600 text-xs px-2 py-1">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Slip-Created" value={stats.created} />
        <StatCard title="At Clinic" value={stats.atClinic} />
        <StatCard title="Ready" value={stats.ready} />
        <StatCard title="Completed" value={stats.completed} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold">Recent Slips</h2>
          <button
            onClick={fetchDashboard}
            className="border px-2 py-1 text-xs"
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

function StatCard({ title, value }) {
  return (
    <div className="border p-3 flex flex-col gap-1">
      <p className="text-xs opacity-70">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
