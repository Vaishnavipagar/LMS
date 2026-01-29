import React from "react";
import { motion } from "framer-motion";
import { ALL_APPS } from "../constants";
import { FaQuestionCircle } from "react-icons/fa";

export default function DefaultApp({ type }) {
  const app = ALL_APPS[type];
  const Icon = app?.icon || FaQuestionCircle;
  const color = app?.color || "#6B7280";

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="mb-6"
      >
        <div 
          className="w-24 h-24 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon className="text-5xl" style={{ color }} />
        </div>
      </motion.div>
      <div className="text-2xl font-bold text-slate-800">{app?.title || type}</div>
      <div className="text-slate-500 mt-2 max-w-xs">
        {app?.description || "This app is coming soon!"}
      </div>
    </div>
  );
}