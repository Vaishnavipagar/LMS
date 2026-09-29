import { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
    listEnrollments,
    updateEnrollment,
    deleteEnrollment,
    getEnrollmentStats
} from "../../services/admin/enrollmentService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

const ITEMS_PER_PAGE = 10;

export default function EnrollmentsManager() {
    const { user, isLoaded } = useUser();

    const [enrollments, setEnrollments] = useState([]);
    const [stats, setStats] = useState({
        total_enrollments: 0,
        active_enrollments: 0,
        completed_enrollments: 0,
        today_enrollments: 0,
        avg_progress: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editProgress, setEditProgress] = useState(0);
    const [editStatus, setEditStatus] = useState("");

    const getClerkId = () => user?.id || localStorage.getItem("clerkId");

    const loadEnrollments = async () => {
        const id = getClerkId();
        if (!isLoaded || !id) return;

        setLoading(true);
        setError("");

        try {
            const result = await listEnrollments(id, {
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search,
                status: statusFilter
            });

            if (result?.success) {
                setEnrollments(result.data || []);
                setTotalPages(result.pagination?.pages || 1);
            } else {
                setError(result?.message || "Failed to load enrollments");
            }

            // Load stats
            const statsResult = await getEnrollmentStats(id);
            if (statsResult?.success) {
                setStats(statsResult.stats || {});
            }

        } catch (err) {
            console.error(err);
            setError("Network error loading enrollments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoaded || !user?.id) return;
        loadEnrollments();
    }, [user?.id, isLoaded, currentPage, search, statusFilter]);

    const handleUpdate = async (id) => {
        const adminId = getClerkId();
        if (!adminId) return;

        try {
            const result = await updateEnrollment(adminId, id, {
                progress: editProgress,
                status: editStatus
            });

            if (result?.success) {
                setSuccess("Enrollment updated successfully!");
                setEditingId(null);
                loadEnrollments();
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(result?.message || "Update failed");
            }
        } catch (err) {
            setError("Network error updating enrollment");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this enrollment?")) return;

        const adminId = getClerkId();
        if (!adminId) return;

        try {
            const result = await deleteEnrollment(adminId, id);

            if (result?.success) {
                setSuccess("Enrollment deleted!");
                loadEnrollments();
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(result?.message || "Delete failed");
            }
        } catch (err) {
            setError("Network error deleting enrollment");
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: "bg-green-900/30 text-green-300",
            completed: "bg-blue-900/30 text-blue-300",
            cancelled: "bg-red-900/30 text-red-300"
        };
        return (
            <span className={`px-2 py-1 rounded text-xs ${styles[status] || "bg-gray-800"}`}>
                {status}
            </span>
        );
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return "text-green-400";
        if (progress >= 50) return "text-yellow-400";
        return "text-blue-400";
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 space-y-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Enrollments Management</h2>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-4 rounded-xl">
                    <p className="text-sm opacity-80">Total</p>
                    <p className="text-2xl font-bold">{stats.total_enrollments}</p>
                </div>
                <div className="bg-gradient-to-br from-green-900 to-green-700 p-4 rounded-xl">
                    <p className="text-sm opacity-80">Active</p>
                    <p className="text-2xl font-bold">{stats.active_enrollments}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900 to-purple-700 p-4 rounded-xl">
                    <p className="text-sm opacity-80">Completed</p>
                    <p className="text-2xl font-bold">{stats.completed_enrollments}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-900 to-yellow-700 p-4 rounded-xl">
                    <p className="text-sm opacity-80">Today</p>
                    <p className="text-2xl font-bold">{stats.today_enrollments}</p>
                </div>
                <div className="bg-gradient-to-br from-pink-900 to-pink-700 p-4 rounded-xl">
                    <p className="text-sm opacity-80">Avg Progress</p>
                    <p className="text-2xl font-bold">{Math.round(stats.avg_progress || 0)}%</p>
                </div>
            </div>

            {error && <ErrorMessage message={error} />}
            {success && <p className="text-green-400">{success}</p>}

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search student or course..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-4 py-2 bg-black/40 border border-gray-700 rounded-lg w-64"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-black/40 border border-gray-700 rounded-lg"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <LoadingSpinner />
            ) : enrollments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    No enrollments found
                </div>
            ) : (
                <div className="overflow-x-auto border border-gray-800 rounded-lg">
                    <table className="w-full text-left">
                        <thead className="bg-black/40">
                            <tr>
                                <th className="p-4">Student</th>
                                <th className="p-4">Course</th>
                                <th className="p-4">Progress</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Enrolled</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map((enrollment) => (
                                <tr key={enrollment.id} className="border-t border-gray-800 hover:bg-black/30">
                                    <td className="p-4">
                                        <div>
                                            <p className="font-medium">{enrollment.student_name}</p>
                                            <p className="text-xs text-gray-400">{enrollment.student_email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">{enrollment.course_title}</td>
                                    <td className="p-4">
                                        {editingId === enrollment.id ? (
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={editProgress}
                                                onChange={(e) => setEditProgress(parseInt(e.target.value))}
                                                className="w-20 px-2 py-1 bg-black/60 border border-gray-700 rounded"
                                            />
                                        ) : (
                                            <span className={getProgressColor(enrollment.progress)}>
                                                {enrollment.progress}%
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {editingId === enrollment.id ? (
                                            <select
                                                value={editStatus}
                                                onChange={(e) => setEditStatus(e.target.value)}
                                                className="px-2 py-1 bg-black/60 border border-gray-700 rounded"
                                            >
                                                <option value="active">Active</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        ) : (
                                            getStatusBadge(enrollment.status)
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        {editingId === enrollment.id ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(enrollment.id)}
                                                    className="text-green-400 hover:text-green-300"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="text-gray-400 hover:text-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(enrollment.id);
                                                        setEditProgress(enrollment.progress);
                                                        setEditStatus(enrollment.status);
                                                    }}
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(enrollment.id)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded-lg ${
                                currentPage === i + 1
                                    ? "bg-cyan-500 text-white"
                                    : "bg-black/40 hover:bg-black/60"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </motion.div>
    );
}