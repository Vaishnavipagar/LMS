import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SystemMonitorApp() {
  const [systemStats, setSystemStats] = useState({
    cpu: 35,
    memory: 68,
    disk: 42,
    networkIn: 1.2,
    networkOut: 0.8,
    processes: 142,
    uptime: "3 days, 5 hours",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats((prev) => ({
        cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() * 6 - 3))),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() * 4 - 2))),
        disk: Math.max(35, Math.min(75, prev.disk + (Math.random() * 2 - 1))),
        networkIn: Math.max(
          0.1,
          Math.min(5, prev.networkIn + (Math.random() * 0.4 - 0.2))
        ),
        networkOut: Math.max(
          0.1,
          Math.min(3, prev.networkOut + (Math.random() * 0.3 - 0.15))
        ),
        processes: prev.processes + Math.floor(Math.random() * 5 - 2),
        uptime: prev.uptime,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getColor = (value) => {
    if (value < 50) return "#10B981";
    if (value < 75) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(systemStats).map(([key, value]) => {
          if (key === "uptime") return null;

          const isPercentage = ["cpu", "memory", "disk"].includes(key);
          const label = key.charAt(0).toUpperCase() + key.slice(1);

          const formattedValue = isPercentage
            ? `${value.toFixed(1)}%`
            : key.includes("network")
            ? `${value.toFixed(2)} MB/s`
            : value;

          return (
            <div key={key} className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-gray-700">{label}</div>
                <div className="text-lg font-bold" style={{ color: getColor(value) }}>
                  {formattedValue}
                </div>
              </div>

              {isPercentage && (
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    style={{ backgroundColor: getColor(value) }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Uptime */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border">
        <div className="font-semibold">System Uptime</div>
        <div className="text-2xl font-bold mt-1">{systemStats.uptime}</div>
      </div>

      {/* Process List */}
      <div className="border rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b font-semibold">Top Processes</div>

        {[
          { name: "bash", pid: 1421, cpu: 12.5, memory: 1.2, user: "student" },
          { name: "node", pid: 1567, cpu: 8.3, memory: 45.6, user: "app" },
          { name: "nginx", pid: 1234, cpu: 2.1, memory: 12.3, user: "www-data" },
          { name: "postgres", pid: 1345, cpu: 1.8, memory: 32.4, user: "postgres" },
          { name: "systemd", pid: 1, cpu: 0.5, memory: 0.8, user: "root" },
        ].map((proc, i) => (
          <div key={i} className="flex justify-between px-4 py-3 hover:bg-gray-50">
            <div>
              <div className="font-medium">{proc.name}</div>
              <div className="text-xs text-gray-500">
                PID: {proc.pid} • User: {proc.user}
              </div>
            </div>
            <div className="text-right text-sm">
              <div>{proc.cpu}% CPU</div>
              <div className="text-gray-500">{proc.memory} MB</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}