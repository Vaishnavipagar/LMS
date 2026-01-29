import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { APPS } from "../config/apps";

export default function ContextMenu({
  contextMenu,
  setContextMenu,
  openWindow,
  setWindows,
}) {
  return (
    <AnimatePresence>
      {contextMenu && (
        <motion.div
          className="fixed bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-2xl py-2 min-w-56 max-h-96 overflow-auto z-[99999]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* All Apps */}
          <div className="px-1">
            {Object.entries(APPS).map(([key, app]) => {
              const Icon = app.icon;
              return (
                <button
                  key={key}
                  onClick={() => {
                    openWindow(key);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 text-sm text-slate-700 flex items-center gap-3 rounded-lg"
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: app.color + "30" }}
                  >
                    <Icon size={14} style={{ color: app.color }} />
                  </div>
                  <span className="flex-1">{app.title}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-200 my-2"></div>

          {/* Window actions */}
          <button
            onClick={() => {
              setWindows([]);
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2.5 hover:bg-slate-100 text-sm text-slate-700"
          >
            Close All Windows
          </button>

          <button
            onClick={() => {
              setWindows((prev) =>
                prev.map((w) => ({ ...w, minimized: false }))
              );
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2.5 hover:bg-slate-100 text-sm text-slate-700"
          >
            Show All Windows
          </button>

          <div className="border-t border-slate-200 my-1"></div>

          <button
            onClick={() => setContextMenu(null)}
            className="w-full text-left px-4 py-2.5 hover:bg-slate-100 text-sm text-slate-500"
          >
            Cancel
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}