import React from "react";
import { motion } from "framer-motion";
import { BADGES } from "../data/badges.jsx";

export default function BadgesApp() {
  const isMobile = window.innerWidth < 768;

  return (
    <div className="h-full overflow-auto -mx-1 px-1 pb-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        {BADGES.map((badge, i) => (
          <motion.div
            key={i}
            className="
              border rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center
              bg-white
              active:scale-[0.97]
            "
            whileHover={!isMobile ? { y: -4 } : {}}
            whileTap={{ scale: 0.96 }}
            style={{ borderLeft: `4px solid ${badge.color}` }}
          >
            <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">{badge.icon}</div>
            <div className="font-bold text-xs sm:text-base truncate">{badge.title}</div>
            <div className="text-[10px] sm:text-sm text-slate-500 mt-1 line-clamp-2">{badge.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}