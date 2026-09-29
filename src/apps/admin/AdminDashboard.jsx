// AdminDashboard.jsx
import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBarChart2,
  FiUsers,
  FiBook,
  FiBell,
  FiSearch,
  FiSettings,
  FiLogOut,
  FiUserCheck,
  FiCreditCard
} from "react-icons/fi";
import { BsGrid3X3GapFill } from "react-icons/bs";

/* =========================
API BASE
========================= */
const API_BASE = "http://localhost/linux/backend/api";

/* =========================
LAZY LOAD ADMIN MODULES
========================= */
const UsersManager = lazy(() => import("./UsersManager"));
const CoursesManager = lazy(() => import("./CoursesManager"));
const Stats = lazy(() => import("./Stats"));
const CohortsManager = lazy(() => import("./CohortsManager"));
const EnrollmentsManager = lazy(() => import("./EnrollmentsManager"));
const PaymentsManager = lazy(() => import("./PaymentsManager"));
const CertificatesManager = lazy(() => import("./CertificatesManager"));

/* =========================
LOADER
========================= */
const Loader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function AdminDashboard({ user, onLogout }) {

  const location = useLocation();
  const navigate = useNavigate();

  /* =========================
     ROUTE → TAB
  ========================= */

  const getTabFromPath = (path) => {
    if (path.includes("/admin/users")) return "users";
    if (path.includes("/admin/courses")) return "courses";
    if (path.includes("/admin/cohorts")) return "cohorts";
    if (path.includes("/admin/enrollments")) return "enrollments";
    if (path.includes("/admin/payments")) return "payments";
    if (path.includes("/admin/certificates")) return "certificates";
    return "stats";
  };

  const [tab, setTab] = useState(getTabFromPath(location.pathname));

  useEffect(() => {
    setTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* =========================
     SCROLL EFFECT
  ========================= */

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =========================
     NOTIFICATIONS
  ========================= */

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {

    if (!user?.id) return;

    const fetchNotifications = async () => {

      setLoadingNotifications(true);

      try {

        const res = await fetch(
          `${API_BASE}/admin/admin_notifications.php`,
          {
            headers: {
              "X-Clerk-Id": user.id
            },
            credentials: "include"
          }
        );

        const data = await res.json();

        if (data.success) {

          setNotifications(data.notifications || []);

        } else {

          setNotifications([]);

        }

      } catch (err) {

        console.error("Notification fetch failed", err);

      } finally {

        setLoadingNotifications(false);

      }

    };

    fetchNotifications();

  }, [user?.id]);

  const markNotificationAsRead = async (id) => {

    try {

      await fetch(
        `${API_BASE}/admin/admin_notifications.php?action=mark_read&id=${id}`,
        {
          method: "POST",
          headers: { "X-Clerk-Id": user.id },
          credentials: "include"
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );

    } catch (err) {

      console.error("Failed to mark notification", err);

    }

  };

  const unreadCount = notifications.filter(n => !n.read).length;

  /* =========================
     ADMIN TABS
  ========================= */

  const tabs = useMemo(() => [

    {
      id: "stats",
      label: "Overview",
      icon: FiBarChart2,
      component: Stats,
      color: "from-cyan-500 to-blue-600",
      description: "Platform analytics and metrics"
    },

    {
      id: "users",
      label: "Users",
      icon: FiUsers,
      component: UsersManager,
      color: "from-purple-500 to-pink-600",
      description: "Manage students, teachers and admins"
    },

    {
      id: "courses",
      label: "Courses",
      icon: FiBook,
      component: CoursesManager,
      color: "from-green-500 to-emerald-600",
      description: "Create and manage courses"
    },

    {
      id: "enrollments",
      label: "Enrollments",
      icon: FiUserCheck,
      component: EnrollmentsManager,
      color: "from-indigo-500 to-blue-600",
      description: "Track student enrollments"
    },

    {
      id: "certificates",
      label: "Certificates",
      icon: FiBook,
      component: CertificatesManager,
      color: "from-orange-500 to-red-600",
      description: "Approve and manage certificates"
    },

    {
      id: "payments",
      label: "Payments",
      icon: FiCreditCard,
      component: PaymentsManager,
      color: "from-yellow-500 to-orange-600",
      description: "Revenue and payment tracking"
    },

    {
      id: "cohorts",
      label: "Cohorts",
      icon: FiUsers,
      component: CohortsManager,
      color: "from-teal-500 to-cyan-600",
      description: "Manage learning cohorts"
    }

  ], []);

  const ActiveComponent = useMemo(
    () => tabs.find((t) => t.id === tab)?.component,
    [tab, tabs]
  );

  const currentTabInfo = useMemo(
    () => tabs.find((t) => t.id === tab),
    [tab, tabs]
  );

  return (

    <div className="min-h-screen w-full bg-gray-950 text-white overflow-x-hidden">

      {/* HEADER */}

      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 px-8 py-4 ${
          isScrolled
            ? "bg-gray-900/80 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
              <BsGrid3X3GapFill />
            </div>

            <div>
              <h1 className="text-xl font-bold text-cyan-400">
                Admin Control Center
              </h1>
              <p className="text-xs text-gray-400">LMS Management</p>
            </div>

          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-white/5 rounded-xl"
            >
              <FiBell />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"/>
              )}
            </button>

            <button
              onClick={() => navigate("/admin/settings")}
              className="p-2 bg-white/5 rounded-xl"
            >
              <FiSettings/>
            </button>

            <button
              onClick={onLogout}
              className="p-2 bg-red-500/20 rounded-xl"
            >
              <FiLogOut/>
            </button>

            <div className="flex items-center gap-2 ml-2">

              <div className="text-right text-sm">
                <p className="font-medium">{user?.fullName || "Admin"}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>

              {user?.imageUrl && (
                <img
                  src={user.imageUrl}
                  alt="profile"
                  className="w-9 h-9 rounded-full"
                />
              )}

            </div>

          </div>

        </div>

      </motion.header>

      {/* MAIN */}

      <div className="px-8 py-10">

        {/* WELCOME */}

        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-white/10">

          <h2 className="text-3xl font-bold">
            Welcome back, {user?.firstName || "Admin"} 👋
          </h2>

          <p className="text-gray-400 mt-2">
            {currentTabInfo?.description}
          </p>

        </div>

        {/* TABS */}

        <div className="mb-8 flex flex-wrap gap-3">

          {tabs.map(({ id, label, icon: Icon, color }) => {

            const active = tab === id;

            return (

              <button
                key={id}
                onClick={() => {
                  setTab(id);

                  const routeMap = {
                    stats: "/admin",
                    users: "/admin/users",
                    courses: "/admin/courses",
                    cohorts: "/admin/cohorts",
                    enrollments: "/admin/enrollments",
                    payments: "/admin/payments",
                    certificates: "/admin/certificates"
                  };

                  navigate(routeMap[id]);
                }}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 ${
                  active
                    ? `bg-gradient-to-r ${color}`
                    : "bg-white/5"
                }`}
              >

                <Icon/>

                {label}

              </button>

            );

          })}

        </div>

        {/* CONTENT */}

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 min-h-[600px]"
        >

          <Suspense fallback={<Loader />}>

            {ActiveComponent && (
              <ActiveComponent user={user}/>
            )}

          </Suspense>

        </motion.div>

      </div>

    </div>

  );

}