import React from "react";
import { motion } from "framer-motion";
import { ATTENDANCE } from "../data/attendance.jsx";

export default function AttendanceApp() {
  const isMobile = window.innerWidth < 768;

  return (
    <div className="h-full overflow-auto -mx-1 px-1 pb-2">
      <div className="space-y-2 sm:space-y-3">
        {ATTENDANCE.map((a, i) => (
          <motion.div
            key={i}
            className="
              flex flex-col sm:flex-row
              sm:items-center sm:justify-between
              gap-2 sm:gap-3
              border rounded-xl p-3 sm:p-4 bg-white
            "
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="min-w-0">
              <div className="font-medium text-sm sm:text-base truncate">{a.course}</div>
              <div className="text-xs sm:text-sm text-slate-500">
                {a.date} • {a.time}
              </div>
            </div>

            <span
              className={`self-start sm:self-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ${
                a.status === "Present"
                  ? "bg-green-100 text-green-800"
                  : a.status === "Absent"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {a.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}