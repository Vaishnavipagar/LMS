import React from "react";
import { motion } from "framer-motion";
import { NOTIFICATIONS } from "../data/notifications.jsx";

export default function NotificationsApp() {
  return (
    <div className="space-y-3">
      {NOTIFICATIONS.map((n) => (
        <motion.div
          key={n.id}
          className="border p-3 rounded-lg hover:shadow-sm"
          whileHover={{ x: 2 }}
        >
          <div className="font-semibold text-sm">{n.title}</div>
          <div className="text-xs text-slate-500">{n.message}</div>
        </motion.div>
      ))}
    </div>
  );
}