import React from "react";
import { motion } from "framer-motion";
import { APPS } from "../config/apps";

export default function LaunchpadApp({ openWindow }) {
  return (
    <div className="p-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {Object.entries(APPS).map(([key, app]) => {
        const Icon = app.icon;
        return (
          <motion.button
            key={key}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openWindow(key)}
            className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-slate-100"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow"
              style={{ backgroundColor: app.color + "30" }}
            >
              <Icon size={28} style={{ color: app.color }} />
            </div>
            <div className="text-sm font-medium text-slate-700 text-center">
              {app.title}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}