import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBookOpen, FaSearch, FaClock, FaStar, FaUser, FaPlay } from "react-icons/fa";

/* ================= LOAD COURSES ================= */

const loadCourses = async (setCourses, setError, setLoading) => {
  try {
    setLoading(true);
    setError("");

    const res = await fetch(
      "http://localhost/linux/backend/api/student/courses.php",
      {
        credentials: "include"
      }
    );

    if (!res.ok) {
      throw new Error("Network response failed");
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to load courses");
    }

    setCourses(result.data || []);

  } catch (err) {
    console.error("Courses API error:", err);
    setError("Failed to load courses");
  } finally {
    setLoading(false);
  }
};

/* ================= ENROLL ================= */

const enrollCourse = async (course_id) => {
  try {

    const res = await fetch(
      "http://localhost/linux/backend/api/student/enroll.php",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clerk_id: localStorage.getItem("clerk_id") || "test-user",
          course_id: course_id
        })
      }
    );

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Enroll failed");
    }

    alert("Enrolled Successfully!");

    window.dispatchEvent(new Event("course-enrolled"));

  } catch (err) {
    console.error("Enroll error:", err);
    alert("Enroll failed");
  }
};

/* ================= COMPONENT ================= */

export default function CoursesApp() {

  const [AVAILABLE_COURSES, setAVAILABLE_COURSES] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses(setAVAILABLE_COURSES, setError, setLoading);
  }, []);

  /* ================= FILTER ================= */

  const filteredCourses = AVAILABLE_COURSES.filter(course => {

    const title = (course.title || "").toLowerCase();
    const instructor = (course.instructor || "").toLowerCase();
    const level = (course.level || "").toLowerCase();

    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      instructor.includes(searchQuery.toLowerCase());

    const matchesLevel =
      selectedLevel === "all" ||
      level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  /* ================= UI ================= */

  return (
    <div className="h-full flex flex-col">

      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <FaBookOpen className="text-blue-500" />
          <span className="hidden sm:inline">Browse</span> Courses
        </h2>
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-2">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-sm mb-2">
          Loading courses...
        </div>
      )}

      {!loading && !error && AVAILABLE_COURSES.length === 0 && (
        <div className="text-sm text-gray-500 mb-2">
          No courses available.
        </div>
      )}

      {/* SEARCH */}

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">

        <div className="relative flex-1">

          <FaSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />

          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

        </div>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-3 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >

          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>

        </select>

      </div>

      {/* COURSE GRID */}

      <div className="flex-1 overflow-auto -mx-1 px-1">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 pb-2">

          {filteredCourses.map((course, index) => {

            const color = course.color || "#3B82F6";

            return (

              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >

                <div
                  className="h-16 sm:h-24 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold"
                  style={{ backgroundColor: color }}
                >
                  {(course.title || "C").charAt(0)}
                </div>

                <div className="p-3 sm:p-4">

                  <div className="flex items-start justify-between mb-2">

                    <div className="min-w-0 flex-1">

                      <h3 className="font-semibold text-sm sm:text-base truncate">
                        {course.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1">
                        <FaUser size={10} />
                        {course.instructor || "Linux School"}
                      </p>

                    </div>

                    <span
                      className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full ml-2 flex-shrink-0"
                      style={{
                        backgroundColor: color + "20",
                        color: color
                      }}
                    >
                      {course.level || "Beginner"}
                    </span>

                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3 line-clamp-2">
                    {course.description || "No description available"}
                  </p>

                  <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-slate-500 mb-2 sm:mb-3 flex-wrap">

                    <span className="flex items-center gap-1">
                      <FaClock size={10} />
                      {course.duration || "Self paced"}
                    </span>

                    <span className="flex items-center gap-1">
                      <FaStar size={10} className="text-yellow-500" />
                      {course.rating || "4.8"}
                    </span>

                    <span className="hidden sm:inline">
                      {(course.students || 0).toLocaleString()} students
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <span
                      className="font-bold text-sm sm:text-base"
                      style={{ color: color }}
                    >
                      ₹{course.price}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm rounded-lg transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => enrollCourse(course.id)}
                    >
                      <FaPlay size={10} />
                      Enroll
                    </motion.button>

                  </div>

                </div>

              </motion.div>

            );

          })}

        </div>

      </div>

    </div>
  );
}