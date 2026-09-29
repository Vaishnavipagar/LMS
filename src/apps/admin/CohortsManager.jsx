import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  Plus,
  Clock,
  TrendingUp,
  Search,
  X
} from "lucide-react";

import { listCohorts, createCohort, deleteCohort } from "../../services/admin/cohortService";
import { listCourses } from "../../services/admin/courseService";

export default function CohortsManager() {

  const [cohorts, setCohorts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCohort, setEditingCohort] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    startDate: "",
    endDate: "",
    maxSeats: 50,
    description: "",
    schedule: ""
  });

  /* =========================
     COHORT STATUS
  ========================== */

  const getStatus = (start, end) => {

    if (!start || !end) return "upcoming";

    const today = new Date();
    const s = new Date(start);
    const e = new Date(end);

    if (s > today) return "upcoming";
    if (e < today) return "completed";

    return "active";
  };

  /* =========================
     LOAD DATA
  ========================== */

  const loadData = async () => {

    setLoading(true);

    try {

      const [cohortsData, coursesData] = await Promise.all([
        listCohorts(),
        listCourses()
      ]);

      setCohorts(Array.isArray(cohortsData) ? cohortsData : cohortsData?.data || []);
      setCourses(Array.isArray(coursesData) ? coursesData : coursesData?.data || []);

    } catch (err) {

      console.error("Load error:", err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================
     CREATE / UPDATE COHORT
  ========================== */

  const handleCreate = async () => {

    if (!formData.title || !formData.courseId || !formData.startDate || !formData.endDate) {
      alert("Please fill all required fields");
      return;
    }

    try {

      await createCohort({
        course_id: formData.courseId,
        title: formData.title,
        start_date: formData.startDate,
        end_date: formData.endDate,
        max_seats: parseInt(formData.maxSeats),
        description: formData.description,
        schedule: formData.schedule
      });

      setFormData({
        title: "",
        courseId: "",
        startDate: "",
        endDate: "",
        maxSeats: 50,
        description: "",
        schedule: ""
      });

      setEditingCohort(null);
      setShowCreateModal(false);
      loadData();

    } catch (err) {

      console.error("Create error:", err);

    }

  };

/* =========================
   DELETE COHORT
========================== */

const handleDelete = async (id) => {

  const confirmDelete = window.confirm("Delete this cohort?");
  if (!confirmDelete) return;

  try {

    const clerkId =
      localStorage.getItem("admin_clerk_id") ||
      localStorage.getItem("clerkId");

    const res = await deleteCohort(id, clerkId);

    if (!res?.success) {
      throw new Error(res?.message || "Delete failed");
    }

    setCohorts(prev => prev.filter(c => c.id !== id));

  } catch (err) {

    console.error("Delete error:", err);
    alert(err.message || "Failed to delete cohort");

  }

};

  /* =========================
     SEARCH
  ========================== */

  const filteredCohorts = cohorts.filter(cohort =>
    (cohort.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cohort.course_title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* =========================
     STATUS BADGE
  ========================== */

  const StatusBadge = ({ status }) => {

    const config = {
      active: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Active", icon: TrendingUp },
      upcoming: { bg: "bg-amber-500/20", text: "text-amber-400", label: "Upcoming", icon: Clock },
      completed: { bg: "bg-slate-500/20", text: "text-slate-400", label: "Completed", icon: Calendar }
    };

    const { bg, text, label, icon: Icon } = config[status] || config.completed;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${bg} ${text} text-xs font-medium`}>
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
    );
  };

  const formatDate = (d) => {

    if (!d) return "-";

    try {
      return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
    } catch {
      return "-";
    }

  };

  return (

    <div className="p-6">

      {/* HEADER */}

      <div className="flex justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-white">Cohort Management</h1>
          <p className="text-slate-400">Manage learning cohorts</p>
        </div>

        <button
          onClick={() => {
            setEditingCohort(null);
            setShowCreateModal(true);
          }}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> New Cohort
        </button>

      </div>

      {/* SEARCH */}

      <div className="mb-6 relative">

        <Search className="absolute left-3 top-3 text-gray-400" />

        <input
          type="text"
          placeholder="Search cohorts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-3 w-full bg-slate-800 rounded-lg text-white"
        />

        {searchTerm && (
          <button
            className="absolute right-3 top-3"
            onClick={() => setSearchTerm("")}
          >
            <X size={18} />
          </button>
        )}

      </div>

      {/* TABLE */}

      <div className="bg-slate-900 rounded-xl overflow-hidden">

        <div className="grid grid-cols-12 px-4 py-3 text-xs uppercase text-slate-400 border-b border-slate-800">
          <div className="col-span-3">Cohort</div>
          <div className="col-span-2">Course</div>
          <div className="col-span-2">Dates</div>
          <div className="col-span-2">Seats</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {filteredCohorts.map((cohort) => (

          <div
            key={cohort.id}
            className="grid grid-cols-12 p-4 border-b border-slate-800 items-center hover:bg-slate-800/40"
          >

            <div className="col-span-3 text-white font-medium">
              {cohort.title}
            </div>

            <div className="col-span-2 text-slate-300">
              {cohort.course_title || "-"}
            </div>

            <div className="col-span-2 text-slate-400 text-sm">
              {formatDate(cohort.start_date)} - {formatDate(cohort.end_date)}
            </div>

            <div className="col-span-2 text-slate-300 flex items-center gap-2">
              <Users size={14} />
              {cohort.enrolled_count || 0} / {cohort.max_seats} seats
            </div>

            <div className="col-span-2">
              <StatusBadge status={getStatus(cohort.start_date, cohort.end_date)} />
            </div>

            <div className="col-span-1 flex justify-end gap-3 text-sm">

              <button
                onClick={() => {
                  setEditingCohort(cohort);
                  setFormData({
                    title: cohort.title,
                    courseId: cohort.course_id,
                    startDate: cohort.start_date,
                    endDate: cohort.end_date,
                    maxSeats: cohort.max_seats,
                    description: cohort.description || "",
                    schedule: cohort.schedule || ""
                  });
                  setShowCreateModal(true);
                }}
                className="text-amber-400 hover:text-amber-300"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(cohort.id)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* CREATE / EDIT MODAL */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">

          <div className="bg-slate-900 p-6 rounded-xl w-[500px] space-y-4">

            <h2 className="text-xl font-bold text-white">
              {editingCohort ? "Edit Cohort" : "Create Cohort"}
            </h2>

            <input
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-3 bg-slate-800 rounded"
            />

            <select
              value={formData.courseId}
              onChange={(e) =>
                setFormData({ ...formData, courseId: e.target.value })
              }
              className="w-full p-3 bg-slate-800 rounded"
            >
              <option value="">Select Course</option>

              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}

            </select>

            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full p-3 bg-slate-800 rounded"
            />

            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full p-3 bg-slate-800 rounded"
            />

            <input
              type="number"
              value={formData.maxSeats}
              onChange={(e) =>
                setFormData({ ...formData, maxSeats: e.target.value })
              }
              className="w-full p-3 bg-slate-800 rounded"
            />

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 bg-slate-800 rounded"
            />

            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-700 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-purple-600 rounded"
              >
                {editingCohort ? "Update" : "Create"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}