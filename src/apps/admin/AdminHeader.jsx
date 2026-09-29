// src/pages/admin/AdminHeader.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ user, sidebarOpen, toggleSidebar }) => {

  const [searchFocused, setSearchFocused] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [role, setRole] = useState("student");

  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: 'New certificate request', time: '5m ago', read: false },
    { id: 2, title: 'Course completed: Linux Basics', time: '1h ago', read: false },
    { id: 3, title: 'New user registered', time: '2h ago', read: true },
  ];

  /* ===============================
     FETCH USER ROLE
  ============================== */
  useEffect(() => {

    const getRole = async () => {

      if (!clerkUser?.id) return;

      try {

        const res = await fetch(
          `http://localhost/linux/backend/api/admin/check_role.php?clerk_id=${clerkUser.id}`
        );

        const data = await res.json();

        if (data.success) {
          setRole(data.role);
        }

      } catch (err) {
        console.error("Role check failed", err);
      }

    };

    getRole();

  }, [clerkUser]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-20 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40"
    >

      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">

        <motion.button
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>

        {/* SEARCH BAR */}
        <motion.div
          animate={{
            width: searchFocused ? 400 : 280,
            backgroundColor: searchFocused ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'
          }}
          className="relative hidden md:block"
        >

          <input
            type="text"
            placeholder="Search courses, users, certificates..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full px-4 py-2.5 pl-11 bg-transparent border border-white/10 rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
              placeholder:text-gray-500 transition-all duration-200"
          />

          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <div className="absolute right-3 top-2.5 hidden md:block">
            <span className="text-xs bg-white/10 px-1.5 py-1 rounded text-gray-400">⌘K</span>
          </div>

        </motion.div>

      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3">

        {/* NOTIFICATIONS */}
        <motion.div className="relative">

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setProfileOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors relative"
          >

            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002
                6.002 0 00-4-5.659V5a2 2 0 10-4
                0v.341C7.67 6.165 6 8.388 6
                11v3.159c0 .538-.214
                1.055-.595
                1.436L4 17h5m6
                0v1a3 3 0
                11-6 0v-1m6
                0H9" />
            </svg>

            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}

          </motion.button>

        </motion.div>

        {/* PROFILE */}
        <motion.div className="relative">

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >

            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-white">{user?.fullName || 'User'}</p>
              <p className="text-xs text-gray-400">{role}</p>
            </div>

            <div className="relative">
              <img
                src={user?.imageUrl || 'https://via.placeholder.com/40'}
                alt="Profile"
                className="w-9 h-9 rounded-full border-2 border-blue-500/50"
              />
            </div>

          </motion.button>

          <AnimatePresence>
            {profileOpen && (

              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
              >

                <div className="p-3 border-b border-white/10">
                  <p className="text-sm text-white font-medium">{user?.fullName}</p>
                  <p className="text-xs text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>

                <div className="p-2">

                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                  >
                    Profile
                  </button>

                  {/* STUDENT DASHBOARD */}
                  <button
                    onClick={() => navigate("/student/dashboard")}
                    className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                  >
                    Student Dashboard
                  </button>

                  {/* TEACHER PANEL */}
                  {role === "teacher" && (
                    <button
                      onClick={() => navigate("/teacher/dashboard")}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                      Teacher Panel
                    </button>
                  )}

                  {/* ADMIN PANEL */}
                  {role === "admin" && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                      Admin Panel
                    </button>
                  )}

                </div>

                <div className="p-2 border-t border-white/10">

                  <button
                    onClick={() => signOut()}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                  >
                    Sign Out
                  </button>

                </div>

              </motion.div>

            )}
          </AnimatePresence>

        </motion.div>

      </div>

    </motion.header>
  );
};

export default AdminHeader;