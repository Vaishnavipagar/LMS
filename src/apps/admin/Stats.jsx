import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

import { getStats } from "../../services/admin/statsService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

/* ================= COUNTER ================= */
function Counter({ value = 0 }) {

  const [display, setDisplay] = useState(0);

  useEffect(() => {

    let start = 0;

    const duration = 800;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = value / steps;

    const timer = setInterval(() => {

      start += increment;

      if (start >= value) {

        setDisplay(value);
        clearInterval(timer);

      } else {

        setDisplay(Math.floor(start));

      }

    }, stepTime);

    return () => clearInterval(timer);

  }, [value]);

  return display.toLocaleString();

}

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, icon, delay }) => (

  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.04 }}
    className="relative p-6 rounded-2xl overflow-hidden
    bg-gradient-to-br from-slate-900 to-slate-800
    border border-white/10 shadow-xl group"
  >

    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />

    <div className="flex justify-between items-center mb-4">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-2xl">{icon}</div>
    </div>

    <div className="text-4xl font-bold text-white">
      <Counter value={Number(value || 0)} />
    </div>

  </motion.div>

);

/* ================= CHART WRAPPER ================= */
const ChartBox = ({ title, children }) => (

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-slate-900 to-slate-800
    border border-white/10 p-6 rounded-2xl shadow-xl"
  >

    <h3 className="text-lg font-semibold text-cyan-400 mb-6">
      {title}
    </h3>

    {children}

  </motion.div>

);

export default function Stats() {

  const { user, isLoaded } = useUser();

  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    enrollments: 0,
    certificates: 0
  });

  const [analytics, setAnalytics] = useState({
    users_growth: [],
    enrollments_growth: [],
    top_courses: []
  });

  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!isLoaded || !user?.id) return;

    let isMounted = true;

    const loadDashboard = async () => {

      setLoading(true);
      setError("");

      try {

        const res = await getStats(days, user.id);

        if (!res || res.success !== true) {

          throw new Error(res?.message || "Invalid response");

        }

        if (!isMounted) return;

        /* ===== STATS ===== */

        setStats({
          users: Number(res.stats?.users || 0),
          courses: Number(res.stats?.courses || 0),
          enrollments: Number(res.stats?.enrollments || 0),
          certificates: Number(res.stats?.certificates || 0)
        });

        /* ===== ANALYTICS ===== */

        setAnalytics({

          users_growth: (res.user_growth || []).map(r => ({
            date: r.date,
            count: Number(r.count)
          })),

          enrollments_growth: (res.monthly_enrollments || []).map(r => ({
            month: r.month,
            total: Number(r.total)
          })),

          top_courses: (res.popular_courses || []).map(course => ({
            title: course.title,
            enrollments: Number(course.enrollment_count || 0)
          }))

        });

      } catch (err) {

        console.error("Dashboard error:", err);

        if (isMounted) {
          setError(err.message || "Failed to load stats");
        }

      } finally {

        if (isMounted) {
          setLoading(false);
        }

      }

    };

    loadDashboard();

    return () => {
      isMounted = false;
    };

  }, [user?.id, isLoaded, days]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (

    <div className="space-y-12">

      <div>
        <h1 className="text-2xl font-bold text-white">Admin Analytics</h1>
        <p className="text-gray-400 text-sm">
          Real-time LMS performance overview
        </p>
      </div>

      {/* ================= STATS CARDS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard title="Total Users" value={stats.users} icon="👥" delay={0} />
        <StatCard title="Courses" value={stats.courses} icon="📚" delay={0.1} />
        <StatCard title="Enrollments" value={stats.enrollments} icon="🎯" delay={0.2} />
        <StatCard title="Certificates" value={stats.certificates} icon="🏆" delay={0.3} />

      </div>

      {/* ================= TIME FILTER ================= */}

      <div className="flex gap-3">

        {[7, 30, 90].map(d => (

          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-4 py-2 rounded-lg text-sm transition ${
              days === d
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            Last {d} days
          </button>

        ))}

      </div>

      {/* ================= CHARTS ================= */}

      <div className="grid lg:grid-cols-2 gap-8">

        <ChartBox title="📈 User Growth">

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.users_growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

        </ChartBox>

        <ChartBox title="📊 Enrollment Growth">

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.enrollments_growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

        </ChartBox>

      </div>

      {/* ================= TOP COURSES ================= */}

      <ChartBox title="📚 Top Performing Courses">

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.top_courses}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="title" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Bar dataKey="enrollments" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

      </ChartBox>

    </div>

  );

}