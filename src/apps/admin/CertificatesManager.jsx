import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  listCertificates,
  approveCertificate,
  rejectCertificate
} from "../../services/admin/certificateService";

export default function CertificatesManager() {
  const { user, isLoaded } = useUser();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  /* LOAD CERTIFICATES */
  const loadCertificates = async () => {
    if (!isLoaded || !user?.id) return;

    setLoading(true);
    setError("");

    try {
      const result = await listCertificates(user.id);

      if (result?.success) {
        setCertificates(result.data || []);
      } else {
        setError(result?.message || "Failed to load certificates");
      }
    } catch (err) {
      console.error(err);
      setError("Network error loading certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, [user?.id, isLoaded]);

  /* APPROVE */
  const handleApprove = async (id) => {
    if (!user?.id) return;
    if (!window.confirm("Approve this certificate?")) return;

    setActionLoading(true);

    try {
      const result = await approveCertificate(user.id, id);

      if (result?.success) {
        loadCertificates();
      } else {
        alert(result?.message || "Failed to approve certificate");
      }
    } catch (err) {
      console.error(err);
      alert("Error approving certificate");
    } finally {
      setActionLoading(false);
    }
  };

  /* REJECT */
  const handleReject = async (id) => {
    if (!user?.id) return;

    const reason = window.prompt("Enter rejection reason:", "Not specified");
    if (reason === null) return;

    setActionLoading(true);

    try {
      const result = await rejectCertificate(user.id, id, reason);

      if (result?.success) {
        loadCertificates();
      } else {
        alert(result?.message || "Failed to reject certificate");
      }
    } catch (err) {
      console.error(err);
      alert("Error rejecting certificate");
    } finally {
      setActionLoading(false);
    }
  };

  /* FILTER */
  const filteredCerts = certificates.filter(
    (cert) => filterStatus === "all" || cert.status === filterStatus
  );

  /* STATUS BADGE */
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-900/30 text-yellow-300",
      approved: "bg-green-900/30 text-green-300",
      rejected: "bg-red-900/30 text-red-300"
    };

    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[status] || "bg-gray-800"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Certificate Management</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded text-red-400">
          {error}
        </div>
      )}

      {/* FILTER */}
      <div className="mb-4 flex gap-4 items-center">
        <div>
          <label className="block text-sm mb-1">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 bg-black/40 border border-gray-700 rounded"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="text-sm text-gray-400">
          Showing: {filteredCerts.length} of {certificates.length}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-black/30 rounded animate-pulse"></div>
          ))}
        </div>
      ) : filteredCerts.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No certificates found
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              className="bg-black/30 p-4 rounded border border-gray-800"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="font-semibold">{cert.student_name}</div>
                    {getStatusBadge(cert.status)}
                  </div>

                  <div className="text-sm text-gray-400 mt-1">
                    Course: {cert.course_title}
                  </div>

                  <div className="text-sm text-gray-400">
                    Email: {cert.student_email}
                  </div>

                  <div className="text-xs mt-2 text-gray-500">
                    Created:{" "}
                    {cert.created_at
                      ? new Date(cert.created_at).toLocaleDateString()
                      : "-"}
                  </div>

                  {cert.rejection_reason && (
                    <div className="mt-2 p-2 bg-red-900/20 rounded text-sm">
                      <span className="font-semibold">Reason:</span>{" "}
                      {cert.rejection_reason}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {cert.status === "pending" && (
                    <>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleApprove(cert.id)}
                        className="px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-sm"
                      >
                        Approve
                      </button>

                      <button
                        disabled={actionLoading}
                        onClick={() => handleReject(cert.id)}
                        className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {cert.status === "approved" && (
                    <div className="text-sm text-green-400">✓ Approved</div>
                  )}

                  {cert.status === "rejected" && (
                    <div className="text-sm text-red-400">✗ Rejected</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}