import { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const cardClasses = "bg-[#9a80f1] text-white p-4 py-8 rounded w-50 flex justify-center items-center flex-col";
const headClasses = "text-xl font-bold";
const valueClasses = "font-bold text-l";

const STATUS_COLORS = {
  Saved: "#94A3B8",
  Applied: "#8064DC",
  Assessment: "#3B82F6",
  Interviewing: "#F59E0B",
  Offer: "#10B981",
  Rejected: "#EF4444",
};

const SOURCE_COLORS = ["#8064DC", "#10B981", "#F59E0B", "#EF4444", "#64748B"];

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/applications")
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Derived numbers — recalculated only when applications actually changes
  const stats = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter((a) => a.status === "Interviewing").length;
    const rejected = applications.filter((a) => a.status === "Rejected").length;
    const offers = applications.filter((a) => a.status === "Offer").length;

    return { total, interviews, rejected, offers };
  }, [applications]);

  const statusData = useMemo(() => {
    const counts = {};
    applications.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ name: status, value: count }));
  }, [applications]);

  const monthData = useMemo(() => {
    const counts = {};
    applications.forEach((app) => {
      const date = new Date(app.applicationDate || app.createdAt);
      const month = date.toLocaleString("default", { month: "short" });
      counts[month] = (counts[month] || 0) + 1;
    });
    return Object.entries(counts).map(([month, count]) => ({ month, count }));
  }, [applications]);

  const sourceData = useMemo(() => {
    const counts = {};
    applications.forEach((app) => {
      const src = app.source || "Unknown";
      counts[src] = (counts[src] || 0) + 1;
    });
    return Object.entries(counts).map(([source, count]) => ({ source, count }));
  }, [applications]);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-4">
      <div className="cards flex flex-wrap gap-5 justify-center items-center mb-10">
        <div className={cardClasses}>
          <div className={headClasses}>Applications</div>
          <div className={valueClasses}>{stats.total}</div>
        </div>
        <div className={cardClasses}>
          <div className={headClasses}>Interviews</div>
          <div className={valueClasses}>{stats.interviews}</div>
        </div>
        <div className={cardClasses}>
          <div className={headClasses}>Rejected</div>
          <div className={valueClasses}>{stats.rejected}</div>
        </div>
        <div className={cardClasses}>
          <div className={headClasses}>Offers</div>
          <div className={valueClasses}>{stats.offers}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
        <div className="bg-white rounded p-5 shadow">
          <h2 className="mb-4 font-bold text-slate-900">Status distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#94A3B8"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded p-5 shadow">
          <h2 className="mb-4 font-bold text-slate-900">Applications by month</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8064DC" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded p-5 shadow lg:col-span-2">
          <h2 className="mb-4 font-bold text-slate-900">Application source</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sourceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="source" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {sourceData.map((entry, index) => (
                  <Cell key={entry.source} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;