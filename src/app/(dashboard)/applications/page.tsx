"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";

interface Application {
  id: string;
  title: string;
  status: string;
  applicantName: string;
  createdAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewStatus, setReviewStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/applications");
      const data = await res.json();
      setApplications(data.applications ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const handleReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const responseId = formData.get("responseId")?.toString();
    if (!responseId) return;
    const response = await fetch(`/api/applications/${responseId}/review`, {
      method: "POST",
      body: formData
    });
    setReviewStatus(response.ok ? "Review submitted." : "Unable to submit review.");
    event.currentTarget.reset();
  };

  return (
    <div className="px-4 py-8 lg:px-8">
      <Toast message={reviewStatus} onClear={() => setReviewStatus("")} />
      <h1 className="text-2xl font-semibold">Applications</h1>
      <p className="text-sm text-slate-400">Collect staff applications with a lightweight form builder.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form className="card space-y-3" method="post" action="/api/applications">
          <h2 className="text-lg font-semibold">Create application form</h2>
          <input name="communityId" placeholder="Community ID" required />
          <input name="title" placeholder="Application title" required />
          <textarea name="questions" placeholder='Questions JSON (e.g. [{"label":"Age","type":"text"}])' rows={4} required />
          <button className="bg-accent text-black" type="submit">Save form</button>
        </form>

        <form className="card space-y-3" method="post" action="/api/applications/submit">
          <h2 className="text-lg font-semibold">Submit application</h2>
          <input name="applicationId" placeholder="Application ID" required />
          <input name="applicantName" placeholder="Applicant name" required />
          <textarea name="responses" placeholder='Responses JSON (e.g. {"Age":"19"})' rows={4} required />
          <button className="bg-accent text-black" type="submit">Submit</button>
        </form>
      </div>

      <form className="mt-6 card space-y-3" onSubmit={handleReview}>
        <h2 className="text-lg font-semibold">Review submission</h2>
        <input name="responseId" placeholder="Application response ID" required />
        <select name="status">
          <option value="approved">Approve</option>
          <option value="denied">Deny</option>
          <option value="needs-info">Needs info</option>
        </select>
        <textarea name="notes" placeholder="Reviewer notes" rows={2} />
        <button className="bg-accent text-black" type="submit">Submit decision</button>
      </form>

      <div className="mt-8 card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent submissions</h2>
        </div>
        {loading ? (
          <p className="mt-3 text-sm text-slate-400">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No submissions yet.</p>
        ) : (
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.applicantName}</td>
                  <td>{app.status}</td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
