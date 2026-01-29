import {
  FaHome,
  FaGraduationCap,
  FaStickyNote,
  FaCertificate,
  FaCog,
  FaFolder,
  FaBook,
  FaAward,
  FaCalendarCheck,
  FaChartLine,
  FaUser,
  FaCalendar,
  FaTasks,
  FaEnvelope,
  FaTerminal,
  FaServer
} from "react-icons/fa";

export const APPS = {
  home: {
    title: "Home",
    icon: FaHome,
    color: "#6366f1",
    description: "Dashboard Overview"
  },

  mycourses: {
    title: "My Courses",
    icon: FaGraduationCap,
    color: "#3b82f6",
    description: "Your Learning Progress"
  },

  finder: {
    title: "Finder",
    icon: FaFolder,
    color: "#06b6d4",
    description: "File Management"
  },

  courses: {
    title: "Courses",
    icon: FaBook,
    color: "#10b981",
    description: "Browse All Courses"
  },

  badges: {
    title: "Badges",
    icon: FaAward,
    color: "#f59e0b",
    description: "Achievements & Rewards"
  },

  attendance: {
    title: "Attendance",
    icon: FaCalendarCheck,
    color: "#8b5cf6",
    description: "Attendance Records"
  },

  notes: {
    title: "Notes",
    icon: FaStickyNote,
    color: "#ef4444",
    description: "Study Notes & Materials"
  },

  certificates: {
    title: "Certificates",
    icon: FaCertificate,
    color: "#f97316",
    description: "Your Certificates"
  },

  analytics: {
    title: "Analytics",
    icon: FaChartLine,
    color: "#ec4899",
    description: "Performance Analytics"
  },

  profile: {
    title: "Profile",
    icon: FaUser,
    color: "#14b8a6",
    description: "User Profile"
  },

  calendar: {
    title: "Calendar",
    icon: FaCalendar,
    color: "#84cc16",
    description: "Schedule & Events"
  },

  tasks: {
    title: "Tasks",
    icon: FaTasks,
    color: "#f43f5e",
    description: "To-Do List"
  },

  messages: {
    title: "Messages",
    icon: FaEnvelope,
    color: "#8b5cf6",
    description: "Inbox & Notifications"
  },

  settings: {
    title: "Settings",
    icon: FaCog,
    color: "#64748b",
    description: "System Preferences"
  },

  terminal: {
    title: "Terminal",
    icon: FaTerminal,
    color: "#10b981",
    description: "Linux Command Line"
  },

  monitor: {
    title: "System Monitor",
    icon: FaServer,
    color: "#8b5cf6",
    description: "System Resources"
  },
};