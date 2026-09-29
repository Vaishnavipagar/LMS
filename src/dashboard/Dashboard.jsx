import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

import { useWindowManager } from "./hooks/useWindowManager";
import { TOPBAR_HEIGHT, TOPBAR_HEIGHT_MOBILE } from "./constants";

import Window from "./components/Window";
import Dock from "./components/Dock";

import { renderApp } from "./apps";

import Navbar from "../components/Navbar";

export default function Dashboard() {
  const wm = useWindowManager();
  const { user } = useUser();

  const [role, setRole] = useState("student");
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if (user) localStorage.setItem("clerk_id", user.id);
  }, [user]);

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
          localStorage.setItem("user_role", data.role);
        }
      } catch (err) {
        console.error("Role check failed", err);
      }
    };
    checkRole();
  }, [user]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const topbarHeight = isMobile ? TOPBAR_HEIGHT_MOBILE : TOPBAR_HEIGHT;

  return (
    <>
      <Navbar />
      <div
        className="fixed inset-0 overflow-hidden"
        style={{
          paddingTop: topbarHeight,
          backgroundColor: "#f8fafc",
          backgroundImage: isMobile ? "none" : "radial-gradient(#e5e7eb 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <AnimatePresence mode="wait">
          {wm.visible.map((w) => (
            <Window
              key={w.id}
              {...w}
              isMobile={isMobile}
              isFullscreen={isMobile ? true : w.fullscreen}
              onFocus={() => wm.focusWindow(w.id)}
              onClose={() => wm.closeWindow(w.id)}
              onMinimize={() => wm.minimizeWindow(w.id)}
              onToggleFullscreen={() => wm.toggleFullscreen(w.id)}
              onDrag={wm.onDrag}
              onDragEnd={wm.onDragEnd}
              onResize={wm.onResize}
              isLoading={wm.loadingWindows[w.id]}
            >
              {renderApp(w.type, wm.openWindow)}
            </Window>
          ))}
        </AnimatePresence>

        <Dock
          windows={wm.windows}
          onOpenApp={(type) => {
            const existing = wm.windows.find((x) => x.type === type);
            if (existing) wm.focusWindow(existing.id);
            else wm.openWindow(type);
          }}
          isMobile={isMobile}
        />

        {wm.windows.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-slate-500 px-6">
              <div className={`font-semibold mb-2 ${isMobile ? "text-base" : "text-lg"}`}>
                Welcome to The Linux School
              </div>
              <div className={`${isMobile ? "text-xs" : "text-sm"}`}>
                {isMobile ? "Tap icons below to open apps" : "Click icons in the dock to open your courses"}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
