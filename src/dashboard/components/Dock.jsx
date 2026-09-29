import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { ALL_APPS } from "../constants";
import { useUser } from "@clerk/clerk-react"; // ⭐ ADDED

// BASE APPS (without admin)
const BASE_APPS = [
  "courses",
  "mycourses",
  "badges",
  "certificates",
  "notes",
  "word",
  "settings",
  "attendance"
];

export default function Dock({ windows, onOpenApp, isMobile }) {

  const dockRef = useRef(null);
  const [mouseX, setMouseX] = useState(null);

  const { user } = useUser();              // ⭐ ADDED
  const [role, setRole] = useState("student"); // ⭐ ADDED

  /* ================= ROLE CHECK ================= */

  useEffect(() => {

    const checkRole = async () => {

      if (!user?.id) return;

      try {

        const res = await fetch(
          `http://localhost/linux/backend/api/admin/check_role.php?clerk_id=${user.id}`
        );

        const data = await res.json();

        if (data.success) {
          setRole(data.role);
        }

      } catch (err) {
        console.error("Role check failed", err);
      }

    };

    checkRole();

  }, [user]);

  /* ================= DOCK APPS ================= */

  const DOCK_APPS = role === "admin"
    ? [...BASE_APPS, "admin"]
    : BASE_APPS;

  return (
    <motion.div
      className={`fixed z-50 ${
        isMobile 
          ? "bottom-0 left-0 right-0 px-2 pb-2 pt-1" 
          : "bottom-4 left-0 right-0 flex justify-center"
      }`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
    >
      <div
        ref={dockRef}
        onMouseMove={(e) => {
          if (!isMobile) setMouseX(e.clientX);
        }}
        onMouseLeave={() => setMouseX(null)}
        className={`
          flex items-end
          ${isMobile 
            ? "gap-1 px-2 py-2 overflow-x-auto scrollbar-hide justify-between" 
            : "gap-2 px-3 py-2"
          }
          rounded-2xl
          bg-white/80 backdrop-blur-2xl
          border border-white/50
          shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        `}
      >
        {DOCK_APPS.map((appKey) => (
          <DockIcon
            key={appKey}
            appKey={appKey}
            app={ALL_APPS[appKey]}
            dockRef={dockRef}
            mouseX={mouseX}
            windows={windows}
            onOpenApp={onOpenApp}
            isMobile={isMobile}
          />
        ))}
      </div>
    </motion.div>
  );
}

function DockIcon({ appKey, app, dockRef, mouseX, windows, onOpenApp, isMobile }) {

  const ref = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!app) return null;

  const isActive = windows.some(
    (w) => w.type === appKey && !w.minimized
  );

  let distance = 9999;

  if (!isMobile && mouseX && ref.current) {

    const rect = ref.current.getBoundingClientRect();
    const iconCenter = rect.left + rect.width / 2;

    distance = Math.abs(mouseX - iconCenter);

  }

  const baseSize = isMobile ? 40 : 44;
  const maxScale = isMobile ? 1 : 1.5;
  const scaleValue = isMobile ? 1 : Math.max(1, maxScale - distance / 100);

  const spring = useSpring(scaleValue, { stiffness: 400, damping: 25 });
  const y = useTransform(spring, [1, maxScale], [0, -12]);

  const Icon = app.icon;

  return (
    <motion.div
      ref={ref}
      className="relative flex-shrink-0"
      onMouseEnter={() => !isMobile && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      style={{ y: isMobile ? 0 : y }}
    >

      {showTooltip && !isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap shadow-lg z-50"
        >
          {app.title}
        </motion.div>
      )}

      <motion.button
        onClick={() => onOpenApp(appKey)}
        style={{ scale: isMobile ? 1 : spring }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          className={`flex flex-col items-center justify-center rounded-xl border ${
            isActive 
              ? "border-slate-400 bg-slate-100" 
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
          style={{ width: baseSize, height: baseSize }}
        >
          <Icon size={isMobile ? 18 : 20} />
        </motion.div>

        {isActive && (
          <motion.div
            className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full bg-slate-500"
          />
        )}

      </motion.button>

      {isMobile && (
        <div className="text-[9px] text-center mt-0.5">
          {app.title.split(" ")[0]}
        </div>
      )}

    </motion.div>
  );
}