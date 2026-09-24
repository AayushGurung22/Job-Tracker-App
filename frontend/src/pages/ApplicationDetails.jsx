import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const statusStyles = {
  Saved: "bg-slate-100 text-slate-600",
  Applied: "bg-[#eeeaff] text-[#7459d0]",
  Assessment: "bg-blue-50 text-blue-700",
  Interviewing: "bg-amber-50 text-amber-700",
  Offer: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/applications/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setApplication(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this application?");
    if (!confirmed) return;
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      navigate("/applications");
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (notFound) return <p className="p-10">Application not found.</p>;

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f7f5ff] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl">
        <Link to="/applications" className="mb-6 inline-block text-sm text-[#8064dc] hover:underline">
          ← Back to applications
        </Link>

        <div className="rounded-2xl border border-[#e8e2ff] bg-white p-6 shadow-[0_20px_60px_-30px_rgba(87,62,170,0.35)] sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{application.role}</h1>
              <p className="mt-1 text-lg text-slate-600">{application.company}</p>
            </div>
            <span className={`inline-flex rounded-full px-4 py-1.5 text-sm font-bold ${statusStyles[application.status] || "bg-slate-100 text-slate-600"}`}>
              {application.status}
            </span>
          </div>

          <div className="grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <DetailRow label="Location" value={application.location} />
            <DetailRow label="Job Type" value={application.jobType} />
            <DetailRow label="Work Mode" value={application.workMode} />
            <DetailRow label="Salary" value={application.salary} />
            <DetailRow label="Source" value={application.source} />
            <DetailRow
              label="Applied Date"
              value={application.applicationDate ? new Date(application.applicationDate).toLocaleDateString() : null}
            />
            {application.jobUrl && (
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-slate-500">Job URL</p>
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-[#8064dc] hover:underline"
                >
                  {application.jobUrl}
                </a>
              </div>
            )}
            {application.notes && (
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-slate-500">Notes</p>
                <p className="mt-1 whitespace-pre-wrap text-slate-700">{application.notes}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3 border-t border-slate-100 pt-6">
            <Link
              to={`/add-application/${application._id}/edit`}
              className="rounded-lg bg-[#9a80f1] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#866be5]"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-bold text-red-600 cursor-pointer hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-slate-800">{value || "—"}</p>
    </div>
  );
}

export default ApplicationDetail;