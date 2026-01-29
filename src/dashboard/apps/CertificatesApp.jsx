import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaAward, FaDownload, FaShare, FaEye } from "react-icons/fa";

const CERTIFICATES = [
  {
    id: 1,
    title: "Linux Fundamentals",
    issueDate: "2024-01-15",
    instructor: "John Smith",
    grade: "A",
    status: "completed",
    credentialId: "LF-2024-001",
  },
  {
    id: 2,
    title: "Shell Scripting Basics",
    issueDate: "2024-02-20",
    instructor: "Jane Doe",
    grade: "A+",
    status: "completed",
    credentialId: "SS-2024-002",
  },
  {
    id: 3,
    title: "System Administration",
    issueDate: null,
    instructor: "Mike Wilson",
    grade: null,
    status: "in-progress",
    credentialId: null,
    progress: 75,
  },
  {
    id: 4,
    title: "Network Security",
    issueDate: null,
    instructor: "Sarah Johnson",
    grade: null,
    status: "in-progress",
    credentialId: null,
    progress: 30,
  },
];

export default function CertificatesApp() {
  const [filter, setFilter] = useState("all");
  const [selectedCert, setSelectedCert] = useState(null);

  const filteredCerts = CERTIFICATES.filter(cert => {
    if (filter === "all") return true;
    return cert.status === filter;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <FaAward className="text-purple-500" />
          My Certificates
        </h2>
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto">
          {["all", "completed", "in-progress"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap ${
                filter === f
                  ? "bg-purple-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {f === "all" ? "All" : f === "completed" ? "Earned" : "Progress"}
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="flex-1 overflow-auto -mx-1 px-1 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {filteredCerts.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-3 sm:p-4 rounded-xl border-2 ${
                cert.status === "completed"
                  ? "border-purple-200 bg-gradient-to-br from-purple-50 to-white"
                  : "border-slate-200 bg-white"
              }`}
            >
              {/* Certificate Badge */}
              {cert.status === "completed" && (
                <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaAward className="text-white text-sm sm:text-lg" />
                </div>
              )}

              <div className="mb-2 sm:mb-3 pr-6">
                <h3 className="font-bold text-sm sm:text-base">{cert.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500">Instructor: {cert.instructor}</p>
              </div>

              {cert.status === "completed" ? (
                <>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3">
                    <span>Grade: <strong className="text-green-600">{cert.grade}</strong></span>
                    <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mb-2 sm:mb-3 truncate">
                    ID: {cert.credentialId}
                  </div>
                  <div className="flex gap-1.5 sm:gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-purple-500 text-white text-xs sm:text-sm rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <FaEye size={10} />
                      <span className="hidden sm:inline">View</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-100 text-slate-700 text-xs sm:text-sm rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <FaDownload size={10} />
                      <span className="hidden sm:inline">Download</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-100 text-slate-700 text-xs sm:text-sm rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <FaShare size={10} />
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-medium">{cert.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${cert.progress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                  <button className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                    Continue Course
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
