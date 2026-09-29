import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaClock } from "react-icons/fa";

/* ===============================
   LOAD MY COURSES
================================ */

const loadMyCourses = async (setCourses) => {
  try {

    const res = await fetch(
      "http://localhost/linux/backend/api/student/mycourses.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_id: localStorage.getItem("clerk_id") || "test-user"
        })
      }
    );

    const data = await res.json();

    if (!data || !data.success) {
      setCourses([]);
      return;
    }

    setCourses(data.data || []);

  } catch (e) {

    console.error("mycourses error:", e);
    setCourses([]);

  }
};

/* ===============================
   COMPONENT
================================ */

function MyCoursesApp() {

  const [MY_COURSES, setMY_COURSES] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadMyCourses(setMY_COURSES);
  }, []);

  /* ===============================
     FILTER COURSES
  ================================ */

  const filteredCourses = MY_COURSES.filter((course) => {

    const progress = Number(course.progress || 0);

    if (filter === "all") return true;

    if (filter === "in-progress") {
      return progress > 0 && progress < 100;
    }

    if (filter === "completed") {
      return progress === 100;
    }

    return true;

  });

  /* ===============================
     UI
  ================================ */

  return (

    <div className="h-full flex flex-col">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">

        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <FaGraduationCap className="text-green-500" />
          My Courses
        </h2>

        {/* FILTER BUTTONS */}

        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto">

          {["all", "in-progress", "completed"].map((f) => (

            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap ${
                filter === f
                  ? "bg-green-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f === "all"
                ? "All"
                : f === "in-progress"
                ? "Active"
                : "Done"}

            </button>

          ))}

        </div>

      </div>

      {/* COURSE LIST */}

      <div className="flex-1 overflow-auto -mx-1 px-1 space-y-2 sm:space-y-3 pb-2">

        {filteredCourses.length === 0 && (

          <div className="text-center text-slate-500 py-10">
            No courses enrolled yet
          </div>

        )}

        {filteredCourses.map((course, index) => (

          <motion.div
            key={course.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4"
          >

            {/* COURSE TITLE */}

            <div className="font-semibold text-sm sm:text-base">
              {course.title}
            </div>

            {/* INSTRUCTOR */}

            <div className="text-xs sm:text-sm text-slate-500">
              {course.instructor || "Linux School"}
            </div>

            {/* DURATION */}

            <div className="mt-2 flex items-center gap-2">
              <FaClock className="text-slate-400" />
              <span className="text-xs">
                {course.duration || "Self paced"}
              </span>
            </div>

            {/* PROGRESS */}

            <div className="mt-2 text-xs sm:text-sm">
              Progress: {course.progress || 0}%
            </div>

          </motion.div>

        ))}

      </div>

    </div>

  );

}

export default MyCoursesApp;