import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useWindowManager } from "./hooks/useWindowManager";
import { TOPBAR_HEIGHT, TOPBAR_HEIGHT_MOBILE } from "./constants";

import AnimatedBackground from "./components/AnimatedBackground";
import Window from "./components/Window";
import Dock from "./components/Dock";
import ContextMenu from "./components/ContextMenu";
import MinimizedStack from "./components/MinimizedStack";

import { renderApp } from "./apps";

// ✅ Import your landing Navbar
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const wm = useWindowManager();
  const [contextMenu, setContextMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const topbarHeight = isMobile ? TOPBAR_HEIGHT_MOBILE : TOPBAR_HEIGHT;

  return (
    <>
      {/* ✅ Top Navbar */}
      <Navbar />

      {/* Dashboard Area */}
      <div
        className="fixed inset-0 overflow-hidden"
        style={{
          paddingTop: topbarHeight,
          backgroundColor: "#f8fafc",
          backgroundImage: isMobile ? "none" : "radial-gradient(#e5e7eb 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        onContextMenu={(e) => {
          if (isMobile) return;
          e.preventDefault();
          setContextMenu({ x: e.clientX, y: e.clientY });
        }}
        onClick={() => setContextMenu(null)}
      >
        {/* Background - hide on mobile for performance */}
        {!isMobile && <AnimatedBackground />}

        {/* Windows */}
        <AnimatePresence mode="wait">
          {wm.visible.map((w) => (
            <Window
              key={w.id}
              {...w}
              isMobile={isMobile}
              isFullscreen={isMobile ? true : w.fullscreen}
              onFocus={wm.focusWindow}
              onClose={wm.closeWindow}
              onMinimize={wm.minimizeWindow}
              onToggleFullscreen={wm.toggleFullscreen}
              onDrag={wm.onDrag}
              onDragEnd={wm.onDragEnd}
              onResize={wm.onResize}
              isLoading={wm.loadingWindows[w.id]}
            >
              {renderApp(w.type, wm.openWindow)}
            </Window>
          ))}
        </AnimatePresence>

        {/* Minimized Stack (desktop only) */}
        {!isMobile && (
          <MinimizedStack minimized={wm.minimized} restoreWindow={wm.restoreWindow} />
        )}

        {/* Dock */}
        <Dock
          windows={wm.windows}
          onOpenApp={wm.openWindow}
          isMobile={isMobile}
        />

        {/* Context Menu (desktop only) */}
        {!isMobile && (
          <ContextMenu
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
            openWindow={wm.openWindow}
            setWindows={wm.setWindows}
          />
        )}

        {/* Empty Desktop Hint */}
        {wm.windows.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-slate-500 px-6">
              <div className={`font-semibold mb-2 ${isMobile ? "text-base" : "text-lg"}`}>
                Welcome to The Linux School
              </div>
              <div className={`${isMobile ? "text-xs" : "text-sm"}`}>
                {isMobile 
                  ? "Tap icons below to open apps" 
                  : "Click icons in the dock or right-click to open applications"
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}