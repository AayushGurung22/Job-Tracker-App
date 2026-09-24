import { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";


const inputClasses = 'mt-2 w-full rounded-lg border border-[#ded6fb] bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#9a80f1] focus:ring-4 focus:ring-[#9a80f1]/15'
const labelClasses = 'text-sm font-semibold text-slate-700'

const AddApplication = () => {
  const { id } = useParams(); // undefined when adding, has a value when editing
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [initialData, setInitialData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false)

  // If editing, fetch the existing application and pre-fill the form
  useEffect(() => {
    if (isEditMode) {
      fetch(`http://localhost:5000/api/applications/${id}`)
        .then((res) => res.json())
        .then((data) => setInitialData(data))
        .catch((err) => console.error(err));
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault()


    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log("Sending:", data);

    const url = isEditMode
      ? `http://localhost:5000/api/applications/${id}`
      : "http://localhost:5000/api/applications";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }

      const saved = await res.json();
      console.log("Saved:", saved);
      setIsSubmitted(true)

      if (isEditMode) {
        navigate("/applications"); // go back to the list after editing
      } else {
        e.target.reset();
      }

    } catch (err) {
      console.log("Failed to save application:", err.message);
    }
  }
  if (isEditMode && !initialData) return <p>Loading...</p>;

  return (
    <main className="min-h-[calc(100vh-73px)]  px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#8064dc]">Your career workspace</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{isEditMode ? "Edit application" : "Add a new application"}</h1>
          <p className="mt-3 max-w-xl text-slate-500">Keep your search organized by capturing the details that matter.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#e8e2ff] bg-white p-5 shadow-[0_20px_60px_-30px_rgba(87,62,170,0.35)] sm:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="company" className={labelClasses}>Company</label>
              <input id="company" name="company" type="text" required defaultValue={initialData?.company} placeholder="e.g. Google" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="role" className={labelClasses}>Role</label>
              <input id="role" name="role" type="text" required defaultValue={initialData?.role} placeholder="e.g. Product Designer" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="location" className={labelClasses}>Location</label>
              <input id="location" name="location" type="text" defaultValue={initialData?.location} placeholder="e.g. New Delhi, N" className={inputClasses} />
            </div>
            <div>
              <label htmlFor="job-type" className={labelClasses}>Job Type</label>
              <select id="job-type" name="jobType" className={inputClasses} defaultValue={initialData?.jobType}>
                <option value="" disabled>Select job type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Freelance</option>
              </select>
            </div>
            <div>
              <label htmlFor="work-mode" className={labelClasses}>Work Mode</label>
              <select id="work-mode" name="workMode" className={inputClasses} defaultValue={initialData?.workMode}>
                <option value="" disabled>Select work mode</option>
                <option>On-site</option>
                <option>Hybrid</option>
                <option>Remote</option>
              </select>
            </div>
            <div>
              <label htmlFor="salary" className={labelClasses}>Salary</label>
              <input id="salary" name="salary" type="text" placeholder="e.g. ₹5,00,000 - ₹7,00,000" defaultValue={initialData?.salary} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="source" className={labelClasses}>Source</label>
              <select id="source" name="source" className={inputClasses} defaultValue={initialData?.source}>
                <option value="" disabled>Where did you find it?</option>
                <option>LinkedIn</option>
                <option>Company Website</option>
                <option>Naukri.com</option>
                <option>Indeed</option>
                <option>Referral</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className={labelClasses}>Status</label>
              <select id="status" name="status" className={inputClasses} defaultValue={initialData?.status || "Applied"}>
                <option>Saved</option>
                <option>Applied</option>
                <option>Assessment</option>
                <option>Interviewing</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
            <div>
              <label htmlFor="application-date" className={labelClasses}>Application Date</label>
              <input id="application-date" name="applicationDate" type="date" defaultValue={initialData?.appliedDate ? initialData.appliedDate.slice(0, 10) : ""} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="job-url" className={labelClasses}>Job URL</label>
              <input id="job-url" name="jobUrl" type="url" defaultValue={initialData?.jobUrl} placeholder="https://company.com/job" className={inputClasses} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="notes" className={labelClasses}>Notes</label>
              <textarea id="notes" name="notes" rows="4" defaultValue={initialData?.notes} placeholder="Add interview details, contacts, or reminders..." className={`${inputClasses} resize-y`} />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
            {isSubmitted ? <p className="text-sm font-medium text-[#7459d0]" role="status">Application saved successfully.</p> : <span />}
            <button type="submit" className=" cursor-pointer w-full rounded-lg bg-[#9a80f1] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#9a80f1]/25 transition hover:bg-[#866be5] focus:outline-none focus:ring-4 focus:ring-[#9a80f1]/25 sm:w-auto">
              Save application
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default AddApplication
