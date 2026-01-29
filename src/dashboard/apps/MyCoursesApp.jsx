import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaPlay, FaBookmark, FaClock, FaChevronRight } from "react-icons/fa";

const MY_COURSES = [
  {
    id: 1,
    title: "Linux Fundamentals",
    instructor: "John Smith",
    progress: 85,
    totalLessons: 24,
    completedLessons: 20,
    duration: "8 hours",
    lastAccessed: "2 hours ago",
    thumbnail: "/courses/linux.jpg",
    color: "#3B82F6",
  },
  {
    id: 2,
    title: "Shell Scripting Mastery",
    instructor: "Jane Doe",
    progress: 60,
    totalLessons: 18,
    completedLessons: 11,
    duration: "6 hours",
    lastAccessed: "1 day ago",
    thumbnail: "/courses/shell.jpg",
    color: "#10B981",
  },
  {
    id: 3,
    title: "System Administration",
    instructor: "Mike Wilson",
    progress: 30,
    totalLessons: 32,
    completedLessons: 10,
    duration: "12 hours",
    lastAccessed: "3 days ago",
    thumbnail: "/courses/sysadmin.jpg",
    color: "#8B5CF6",
  },
  {
    id: 4,
    title: "Network Security Basics",
    instructor: "Sarah Johnson",
    progress: 15,
    totalLessons: 20,
    completedLessons: 3,
    duration: "10 hours",
    lastAccessed: "1 week ago",
    thumbnail: "/courses/security.jpg",
    color: "#EF4444",
  },
];

export default function MyCoursesApp() {
  const [filter, setFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = MY_COURSES.filter(course => {
    if (filter === "all") return true;
    if (filter === "in-progress") return course.progress > 0 && course.progress < 100;
    if (filter === "completed") return course.progress === 100;
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <FaGraduationCap className="text-green-500" />
          My Courses
        </h2>
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto">
          {["all", "in-progress", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap ${
                filter === f
                  ? "bg-green-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f === "all" ? "All" : f === "in-progress" ? "Active" : "Done"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="bg-blue-50 rounded-xl p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-2xl font-bold text-blue-600">{MY_COURSES.length}</div>
          <div className="text-[10px] sm:text-xs text-blue-600">Enrolled</div>
        </div>
        <div className="bg-green-50 rounded-xl p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-2xl font-bold text-green-600">
            {MY_COURSES.filter(c => c.progress === 100).length}
          </div>
          <div className="text-[10px] sm:text-xs text-green-600">Completed</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-2xl font-bold text-purple-600">
            {Math.round(MY_COURSES.reduce((acc, c) => acc + c.progress, 0) / MY_COURSES.length)}%
          </div>
          <div className="text-[10px] sm:text-xs text-purple-600">Avg Progress</div>
        </div>
      </div>

      {/* Courses List */}
      <div className="flex-1 overflow-auto -mx-1 px-1 space-y-2 sm:space-y-3 pb-2">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedCourse(course)}
          >
            <div className="flex gap-3 sm:gap-4">
              {/* Thumbnail placeholder */}
              <div 
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0"
                style={{ backgroundColor: course.color }}
              >
                {course.title.charAt(0)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{course.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 truncate">{course.instructor}</p>
                  </div>
                  <button className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0 hidden sm:block">
                    <FaBookmark className="text-slate-400" size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 mt-1 sm:mt-2 text-[10px] sm:text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FaClock size={10} />
                    {course.duration}
                  </span>
                  <span>{course.completedLessons}/{course.totalLessons}</span>
                  <span className="hidden sm:inline">Last: {course.lastAccessed}</span>
                </div>

                <div className="mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 h-1.5 sm:h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: course.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium" style={{ color: course.color }}>
                    {course.progress}%
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, x: 3 }}
                whileTap={{ scale: 0.95 }}
                className="self-center p-2 sm:p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors flex-shrink-0"
              >
                <FaPlay size={10} className="text-slate-600" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
