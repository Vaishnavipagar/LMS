import { useEffect, useState } from "react";
import { listPaymentsAdmin, paymentsSummary, listCoursesAdmin } from "../lib/adminApi";
import { Spinner, EmptyState, Select, StatusBadge, useToasts } from "../components/ui";

function inr(n) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
  } catch {
    return `₹${n || 0}`;
  }
}

export default function PaymentsAdmin() {
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filterCourse, setFilterCourse] = useState("");
  const [summary, setSummary] = useState({ count: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const { push, stack } = useToasts();

  const load = async (courseId = "") => {
    setLoading(true);
    try {
      const [p, c, s] = await Promise.all([
        listPaymentsAdmin(courseId || null),
        listCoursesAdmin(""),
        paymentsSummary(courseId || null),
      ]);
      setItems(p);
      setCourses(c);
      setSummary(s);
    } catch (e) {
      push(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load(filterCourse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCourse]);

  return (
    <div>
      {stack}
      <h1 className="text-2xl font-extrabold tracking-tight">Purchases</h1>
      <p className="text-[13px] text-gray-500 mt-1">Course-wise purchase information from website checkouts.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 max-w-2xl">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Payments</p>
          <p className="text-2xl font-extrabold mt-1">{summary.count}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Revenue</p>
          <p className="text-2xl font-extrabold mt-1">{inr(summary.revenue)}</p>
        </div>
      </div>

      <div className="mt-5 max-w-sm">
        <Select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
          <option value="">All courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </Select>
      </div>

      <div className="mt-4">
        {loading ? (
          <Spinner label="Loading purchases…" />
        ) : items.length === 0 ? (
          <EmptyState title="No purchases yet" hint="Completed checkouts appear here with buyer and course." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-x-auto">
            {items.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 min-w-[620px]">
                <div className="flex-1 min-w-[200px]">
                  <p className="font-bold text-[13px]">{p.profiles?.email || p.student_email || "Student"}</p>
                  <p className="text-[12px] text-gray-500">{p.courses?.title || "Deleted course"}</p>
                </div>
                <span className="font-extrabold text-[13px]">{inr(p.amount)}</span>
                <span className="text-[12px] text-gray-500 capitalize">{p.provider || "—"}</span>
                <StatusBadge status={p.status} />
                <span className="text-[12px] text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
