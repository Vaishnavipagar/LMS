import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBookOpen, FaSearch, FaClock, FaStar, FaUser, FaPlay } from "react-icons/fa";

const AVAILABLE_COURSES = [
  {
    id: 1,
    title: "Linux Fundamentals",
    instructor: "John Smith",
    duration: "8 hours",
    level: "Beginner",
    rating: 4.8,
    students: 1250,
    price: "Free",
    color: "#3B82F6",
    description: "Learn the basics of Linux operating system",
  },
  {
    id: 2,
    title: "Shell Scripting Mastery",
    instructor: "Jane Doe",
    duration: "6 hours",
    level: "Intermediate",
    rating: 4.9,
    students: 890,
    price: "$29",
    color: "#10B981",
    description: "Master bash scripting and automation",
  },
  {
    id: 3,
    title: "System Administration",
    instructor: "Mike Wilson",
    duration: "12 hours",
    level: "Advanced",
    rating: 4.7,
    students: 650,
    price: "$49",
    color: "#8B5CF6",
    description: "Become a Linux system administrator",
  },
  {
    id: 4,
    title: "Network Security",
    instructor: "Sarah Johnson",
    duration: "10 hours",
    level: "Advanced",
    rating: 4.6,
    students: 420,
    price: "$39",
    color: "#EF4444",
    description: "Learn network security fundamentals",
  },
  {
    id: 5,
    title: "Docker & Containers",
    instructor: "Alex Brown",
    duration: "5 hours",
    level: "Intermediate",
    rating: 4.8,
    students: 780,
    price: "$19",
    color: "#0EA5E9",
    description: "Master containerization with Docker",
  },
  {
    id: 6,
    title: "DevOps Essentials",
    instructor: "Emily Chen",
    duration: "15 hours",
    level: "Intermediate",
    rating: 4.9,
    students: 1100,
    price: "$59",
    color: "#F59E0B",
    description: "Complete DevOps pipeline training",
  },
];

export default function CoursesApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const filteredCourses = AVAILABLE_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "all" || course.level.toLowerCase() === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <FaBookOpen className="text-blue-500" />
          <span className="hidden sm:inline">Browse</span> Courses
        </h2>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
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

      {/* Courses Grid */}
      <div className="flex-1 overflow-auto -mx-1 px-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 pb-2">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Course Header */}
              <div 
                className="h-16 sm:h-24 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold"
                style={{ backgroundColor: course.color }}
              >
                {course.title.charAt(0)}
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{course.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1">
                      <FaUser size={10} />
                      {course.instructor}
                    </p>
                  </div>
                  <span 
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded-full ml-2 flex-shrink-0"
                    style={{ 
                      backgroundColor: course.color + "20",
                      color: course.color
                    }}
                  >
                    {course.level}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-slate-500 mb-2 sm:mb-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <FaClock size={10} />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaStar size={10} className="text-yellow-500" />
                    {course.rating}
                  </span>
                  <span className="hidden sm:inline">{course.students.toLocaleString()} students</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm sm:text-base" style={{ color: course.color }}>
                    {course.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm rounded-lg transition-colors"
                    style={{ backgroundColor: course.color }}
                  >
                    <FaPlay size={10} />
                    Enroll
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}