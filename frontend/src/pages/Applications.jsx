import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";


const statusStyles = {
  Saved: "bg-slate-100 text-slate-600",
  Applied: "bg-[#eeeaff] text-[#7459d0]",
  Assessment: "bg-blue-50 text-blue-700",
  Interviewing: "bg-amber-50 text-amber-700",
  Offer: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const navigate = useNavigate()

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

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this application?");
    if (!confirmed) return;
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  // Job type options are derived from whatever's actually in the data,
  // so the dropdown never shows a type with zero matching applications
  const typeOptions = useMemo(() => {
    const types = new Set(applications.map((app) => app.jobType).filter(Boolean));
    return ["All", ...types];
  }, [applications]);

  // The filtering pipeline: start with everything, narrow by each active filter.
  // Order doesn't matter here since each filter is independent (AND logic).
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        search.trim() === "" ||
        app.company?.toLowerCase().includes(search.trim().toLowerCase());

      const matchesStatus = statusFilter === "All" || app.status === statusFilter;

      const matchesType = typeFilter === "All" || app.jobType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [applications, search, statusFilter, typeFilter]);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f7f5ff] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#8064dc]">Your career workspace</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Applications</h1>
        </div>

        {/* Search + filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company..."
              className="w-full rounded-lg border border-[#e8e2ff] bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#9a80f1]/30"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#e8e2ff] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9a80f1]/30"
          >
            <option>All</option>
            <option>Applied</option>
            <option>Assessment</option>
            <option>Interviewing</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-[#e8e2ff] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9a80f1]/30"
          >
            {typeOptions.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e8e2ff] bg-white shadow-[0_20px_60px_-30px_rgba(87,62,170,0.35)]">
          <div className="flex items-center justify-between border-b border-[#eeeaff] px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">All applications</h2>
              <p className="mt-1 text-sm text-slate-500">{filteredApplications.length} of {applications.length} shown</p>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <p className="px-6 py-10 text-center text-slate-500">No applications match your filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-135 text-left">
                <thead className="bg-[#fbfaff] text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-bold sm:px-6">Company</th>
                    <th scope="col" className="px-5 py-4 font-bold sm:px-6">Role</th>
                    <th scope="col" className="px-5 py-4 font-bold sm:px-6">Status</th>
                    <th scope="col" className="px-5 py-4 font-bold sm:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0edfa]">
                  {filteredApplications.map((app) => (
                    <tr key={app._id} className="transition-colors cursor-pointer hover:bg-[#fbfaff]" onClick={() => navigate(`/applications/${app._id}`)}>
                      <td className="px-5 py-5 font-bold text-slate-800 sm:px-6">{app.company}</td>
                      <td className="px-5 py-5 text-slate-600 sm:px-6">{app.role}</td>
                      <td className="px-5 py-5 sm:px-6">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusStyles[app.status] || "bg-slate-100 text-slate-600"}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-5 sm:px-6 flex gap-3">
                        <Link to={`/applications/${app._id}/edit`} onClick={(e) => e.stopPropagation()} className="text-[#8064dc] hover:underline">
                          Edit
                        </Link>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(app._id)}}className="text-red-500 hover:underline cursor-pointer">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Applications;