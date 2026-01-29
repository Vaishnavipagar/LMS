import React from "react";
import { motion } from "framer-motion";
import { FILE_SYSTEM } from "../data/filesystem.jsx";

export default function FinderApp() {
  const isMobile = window.innerWidth < 768;

  return (
    <div className={isMobile ? "space-y-6" : ""}>
      {Object.keys(FILE_SYSTEM).map((folder) => (
        <div key={folder} className="mb-4">
          <div className="font-bold mb-3 flex items-center gap-2 text-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            {folder}
          </div>

          <div className={isMobile ? "grid grid-cols-1 gap-3" : ""}>
            {FILE_SYSTEM[folder].map((file, i) => {
              const Icon = file.icon;
              return (
                <motion.div
                  key={i}
                  className="
                    flex justify-between items-center
                    p-4 border rounded-xl
                    text-sm cursor-pointer
                    bg-white hover:bg-slate-50
                  "
                  whileHover={{ x: isMobile ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex gap-3 items-center text-base">
                    <Icon className="text-slate-500" size={20} />
                    {file.name}
                  </span>
                  <span className="text-sm text-slate-400">{file.size}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}