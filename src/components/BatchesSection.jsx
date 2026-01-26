import React from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiUsers, FiArrowRight, FiCheck } from "react-icons/fi";

const batches = [
  {
    id: 1,
    title: "Linux Masterclass",
    type: "Weekend Batch",
    date: "Jan 20, 2026",
    time: "10:00 AM - 12:00 PM (IST)",
    seatsTotal: 50,
    seatsFilled: 45,
    status: "Filling Fast",
    features: ["Live Projects", "24/7 Support", "Certification"],
    color: "#16a34a", 
  },
  {
    id: 2,
    title: "DevOps Zero to Hero",
    type: "Weekday Evening",
    date: "Jan 22, 2026",
    time: "08:00 PM - 10:00 PM (IST)",
    seatsTotal: 40,
    seatsFilled: 12,
    status: "Open",
    features: ["Docker & K8s", "CI/CD Pipelines", "Interview Prep"],
    color: "#2563eb", 
  },
  {
    id: 3,
    title: "Cloud Native Architect",
    type: "Weekend Batch",
    date: "Feb 05, 2026",
    time: "02:00 PM - 05:00 PM (IST)",
    seatsTotal: 30,
    seatsFilled: 28,
    status: "Almost Full",
    features: ["AWS & Azure", "Terraform", "System Design"],
    color: "#9333ea", 
  },
];

export default function UpcomingBatches() {
  return (
    <section 
      className="relative py-24 px-6 bg-white overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Upcoming <span className="text-gray-500 bg-clip-text">Live Cohorts</span>
          </motion.h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join our live interactive sessions. Limited seats available per batch.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {batches.map((batch, index) => {
            const fillPercentage = (batch.seatsFilled / batch.seatsTotal) * 100;
            
            return (
              <motion.div
                key={batch.id}
                // REMOVED: p-[2px] and overflow-hidden related to the spinner
                // ADDED: Simple hover lift effect
                className="w-full max-w-[380px] group transition-transform duration-300 hover:-translate-y-2"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                
                {/* REMOVED: The "absolute inset" div that created the spinning animation 
                */}

                {/* CARD CONTENT */}
                <div className="relative bg-white h-full rounded-2xl p-8 flex flex-col z-10 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
                  
                  {/* Badge Row */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-3 py-1.5 rounded-md">
                      {batch.type}
                    </span>
                    {fillPercentage > 80 && (
                      <span className="text-xs font-bold text-red-500 animate-pulse flex items-center gap-1">
                        🔥 {batch.status}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-6">
                    {batch.title}
                  </h3>

                  {/* Details */}
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <FiCalendar className="text-lg text-slate-900" />
                      <span>{batch.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <FiClock className="text-lg text-slate-900" />
                      <span>{batch.time}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-slate-100 mb-6"></div>

                  {/* Features */}
                  <ul className="flex flex-wrap gap-3 mb-8">
                    {batch.features.map((feat, i) => (
                      <li 
                        key={i} 
                        className="text-sm text-slate-600 flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-md border border-slate-100"
                      >
                        <FiCheck className="text-green-600" /> {feat}
                      </li>
                    ))}
                  </ul>

                  {/* Progress Bar Section */}
                  <div className="mt-auto mb-6">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Seats Filled</span>
                      <span style={{ color: batch.color }}>{batch.seatsFilled}/{batch.seatsTotal}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ background: batch.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${fillPercentage}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      ></motion.div>
                    </div>
                  </div>

                  {/* Button */}
                  <button 
                    className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-300 group-hover:scale-[1.02]"
                  >
                    Secure Your Seat <FiArrowRight />
                  </button>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}