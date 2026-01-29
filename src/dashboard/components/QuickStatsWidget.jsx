import React from "react";
import { motion } from "framer-motion";

import { COURSES } from "../data/courses.jsx";
import { BADGES } from "../data/badges.jsx";
import { ATTENDANCE } from "../data/attendance.jsx";
import { surface } from "../constants";

export default function QuickStatsWidget() {
  const activeCourses = COURSES.filter(
    (c) => c.progress < 100 && c.progress > 0
  ).length;

  const completedCourses = COURSES.filter((c) => c.progress === 100).length;

  const presentDays = ATTENDANCE.filter(
    (a) => a.status === "Present"
  ).length;

  const totalDays = 30;
  const attendancePercent = Math.round((presentDays / totalDays) * 100);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <motion.div
      className={`${surface} p-3 w-56`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 18 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-sm font-semibold text-slate-800">
          Quick Stats
        </div>
        <div className="text-[11px] text-slate-500">{today}</div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Active */}
        <div className="relative overflow-hidden rounded-xl p-2 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="text-[11px] text-blue-700 font-medium">
            Active
          </div>
          <div className="text-2xl font-bold text-blue-800 leading-tight">
            {activeCourses}
          </div>
          <div className="absolute -right-3 -bottom-3 w-12 h-12 bg-blue-400/10 rounded-full" />
        </div>

        {/* Completed */}
        <div className="relative overflow-hidden rounded-xl p-2 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="text-[11px] text-green-700 font-medium">
            Done
          </div>
          <div className="text-2xl font-bold text-green-800 leading-tight">
            {completedCourses}
          </div>
          <div className="absolute -right-3 -bottom-3 w-12 h-12 bg-green-400/10 rounded-full" />
        </div>

        {/* Badges */}
        <div className="relative overflow-hidden rounded-xl p-2 bg-gradient-to-br from-yellow-50 to-orange-100 border border-yellow-200">
          <div className="text-[11px] text-orange-700 font-medium">
            Badges
          </div>
          <div className="text-2xl font-bold text-orange-700 leading-tight">
            {BADGES.length}
          </div>
          <div className="absolute -right-3 -bottom-3 w-12 h-12 bg-orange-400/10 rounded-full" />
        </div>

        {/* Attendance */}
        <div className="rounded-xl p-2 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-purple-700 font-medium">
              Attend
            </div>
            <div className="text-[11px] text-slate-600">
              {presentDays} days
            </div>
          </div>

          {/* Ring */}
          <div className="relative w-9 h-9">
            <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
              <path
                d="M18 2
                   a 16 16 0 0 1 0 32
                   a 16 16 0 0 1 0 -32"
                fill="none"
                stroke="#ede9fe"
                strokeWidth="4"
              />
              <path
                d="M18 2
                   a 16 16 0 0 1 0 32
                   a 16 16 0 0 1 0 -32"
                fill="none"
                stroke="#a855f7"
                strokeWidth="4"
                strokeDasharray={`${attendancePercent}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-purple-700">
              {attendancePercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-slate-200/70 text-[11px] text-slate-500 text-center">
        {presentDays} days present this month
      </div>
    </motion.div>
  );
}