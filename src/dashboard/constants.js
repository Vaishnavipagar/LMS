import {
  FaBookOpen,
  FaGraduationCap,
  FaStar,
  FaAward,
  FaStickyNote,
  FaFileAlt,
  FaCog,
  FaCalendarCheck,
} from "react-icons/fa";

export const STORAGE_KEY = "tls_workspace";
export const TOPBAR_HEIGHT = 90;
export const TOPBAR_HEIGHT_MOBILE = 70;
export const DOCK_HEIGHT = 80;
export const DOCK_HEIGHT_MOBILE = 70;

export const surface =
  "bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-2xl shadow-slate-300/40";

// All apps configuration with proper titles and icons
export const ALL_APPS = {
  courses: { 
    title: "Courses", 
    icon: FaBookOpen, 
    color: "#3B82F6",
    description: "Browse available courses"
  },
  mycourses: { 
    title: "My Courses", 
    icon: FaGraduationCap, 
    color: "#10B981",
    description: "Your enrolled courses"
  },
  badges: { 
    title: "Badges", 
    icon: FaStar, 
    color: "#F59E0B",
    description: "Your achievements"
  },
  certificates: { 
    title: "Certificates", 
    icon: FaAward, 
    color: "#8B5CF6",
    description: "Your certificates"
  },
  notes: { 
    title: "Notes", 
    icon: FaStickyNote, 
    color: "#EC4899",
    description: "Course notes"
  },
  word: { 
    title: "Word", 
    icon: FaFileAlt, 
    color: "#2563EB",
    description: "Document editor"
  },
  settings: { 
    title: "Settings", 
    icon: FaCog, 
    color: "#6B7280",
    description: "App settings"
  },
  attendance: { 
    title: "Attendance", 
    icon: FaCalendarCheck, 
    color: "#EF4444",
    description: "Track attendance"
  },
};