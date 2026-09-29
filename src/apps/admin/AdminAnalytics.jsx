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
import { motion } from "framer-motion";

export default function AdminAnalytics({
  usersGrowth = [],
  enrollmentsGrowth = [],
  topCourses = []
}) {

  // ✅ ensure numbers (fix for API string values)
  const safeUsersGrowth = usersGrowth.map(x => ({
    ...x,
    count: Number(x.count || 0)
  }));

  const safeEnrollmentsGrowth = enrollmentsGrowth.map(x => ({
    ...x,
    count: Number(x.count || 0)
  }));

  const safeTopCourses = topCourses.map(x => ({
    ...x,
    enrollment_count: Number(x.enrollment_count || 0)
  }));

  return (
    <div className="space-y-10">

      {/* USERS GROWTH */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-black/40 border border-cyan-400/20 p-6 rounded-2xl"
      >
        <h3 className="text-cyan-400 font-semibold mb-4">
          📈 User Growth
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safeUsersGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#06b6d4"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ENROLLMENT GROWTH */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-black/40 border border-cyan-400/20 p-6 rounded-2xl"
      >
        <h3 className="text-cyan-400 font-semibold mb-4">
          📊 Enrollment Growth
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safeEnrollmentsGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* TOP COURSES */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-black/40 border border-cyan-400/20 p-6 rounded-2xl"
      >
        <h3 className="text-cyan-400 font-semibold mb-4">
          📚 Top Courses
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={safeTopCourses}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="title" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />

            {/* ⭐ FIXED FIELD NAME */}
            <Bar dataKey="enrollment_count" fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

    </div>
  );
}