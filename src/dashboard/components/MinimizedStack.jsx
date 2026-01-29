import React from "react";
import { motion } from "framer-motion";
import { ALL_APPS } from "../constants";

export default function MinimizedStack({ minimized, restoreWindow }) {
  if (!minimized.length) return null;

  return (
    <div className="fixed bottom-24 left-4 z-40">
      <div className="flex flex-col gap-2">
        {minimized.map((w) => {
          const app = ALL_APPS[w.type];
          const Icon = app?.icon;
          
          return (
            <motion.button
              key={w.id}
              onClick={() => restoreWindow(w.id)}
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0, x: -20 }}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl border border-white/50 shadow-lg flex items-center justify-center backdrop-blur-sm"
              style={{ backgroundColor: (app?.color || "#666") + "40" }}
              title={app?.title || w.type}
            >
              {Icon && <Icon size={20} style={{ color: app.color }} />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}