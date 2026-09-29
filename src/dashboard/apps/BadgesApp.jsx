import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BadgesApp() {

  const isMobile = window.innerWidth < 768;
  const [badges, setBadges] = useState([]);

  /* ================= LOAD BADGES ================= */

  const loadBadges = async () => {

    try {

      const clerkId = localStorage.getItem("clerk_id");

      if (!clerkId) {
        console.warn("No clerk_id found");
        return;
      }

      const res = await fetch(
        `http://localhost/linux/backend/api/student/badges.php?clerk_id=${clerkId}`
      );

      const data = await res.json();

      console.log("Badges API:", data);

      if (Array.isArray(data)) {
        setBadges(data);
      } else {
        setBadges([]);
      }

    } catch (err) {
      console.error("Badges error:", err);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    loadBadges();
  }, []);

  /* ================= UI ================= */

  return (
    <div className="h-full overflow-auto -mx-1 px-1 pb-2">

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">

        {badges.length === 0 ? (

          <div className="text-center text-gray-400 col-span-full mt-6">
            No badges yet
          </div>

        ) : (

          badges.map((badge, i) => (

            <motion.div
              key={i}
              className="
                border rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center
                bg-white active:scale-[0.97]
              "
              whileHover={!isMobile ? { y: -4 } : {}}
              whileTap={{ scale: 0.96 }}
              style={{ borderLeft: `4px solid ${badge.color}` }}
            >

              <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">
                {badge.icon}
              </div>

              <div className="font-bold text-xs sm:text-base">
                {badge.title}
              </div>

              <div className="text-[10px] sm:text-sm text-slate-500 mt-1">
                {badge.desc}
              </div>

            </motion.div>

          ))

        )}

      </div>

    </div>
  );
}