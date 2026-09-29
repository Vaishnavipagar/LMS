// src/components/AdminSidebar.jsx

import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiUserCheck,
  FiCreditCard,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useClerk } from "@clerk/clerk-react";

export default function AdminSidebar({ isOpen, toggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();

  /* ---------- UPDATED FINAL ADMIN MENU (ONLY NECESSARY LMS ITEMS) ---------- */
  const menu = [
    { label: "Dashboard", path: "/admin", icon: FiHome },
    { label: "Users", path: "/admin/users", icon: FiUsers },
    { label: "Courses", path: "/admin/courses", icon: FiBook },
    { label: "Cohorts", path: "/admin/cohorts", icon: FiUserCheck },
    { label: "Enrollments", path: "/admin/enrollments", icon: FiUserCheck },
    { label: "Payments", path: "/admin/payments", icon: FiCreditCard },
    { label: "Settings", path: "/admin/settings", icon: FiSettings },
  ];

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 to-gray-950 border-r border-white/10 flex flex-col z-50 overflow-hidden"
    >
      {/* HEADER */}
      <div className="p-5 border-b border-white/10 flex justify-between items-center">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                Admin Panel
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={toggle}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition ml-auto"
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            ☰
          </motion.div>
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menu.map((item) => (
          <Link key={item.path} to={item.path}>
            <motion.div
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-4 py-3 rounded-xl flex items-center gap-3 transition-all
              ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />

              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {isActive(item.path) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-8 bg-cyan-400 rounded-r-full"
                />
              )}
            </motion.div>
          </Link>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-3 border-t border-white/10">
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition"
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />

          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}