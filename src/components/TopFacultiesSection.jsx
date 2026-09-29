import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

const facultyData = [
  {
    id: 1, name: "Amit Singh", role: "AI & Backend Lead",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "10+ yrs building Linux systems, Python backends and production AI services.",
    socials: { linkedin: "#", twitter: "#", github: "#" }, color: "#4F46E5",
  },
  {
    id: 2, name: "Priya Sharma", role: "Data Science & ML",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "ML pipelines, Pandas to PyTorch. Cloud Native Ambassador.",
    socials: { linkedin: "#", twitter: "#", github: "#" }, color: "#059669",
  },
  {
    id: 3, name: "Rahul Verma", role: "Full-Stack Mentor",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    bio: "React, Node and Supabase. Ships high-traffic apps for startups.",
    socials: { linkedin: "#", twitter: "#", github: "#" }, color: "#0EA5E9",
  },
  {
    id: 4, name: "Neha Gupta", role: "Python & Systems",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Distributed systems, Django and automation. Ex-Amazon SDE II.",
    socials: { linkedin: "#", twitter: "#", github: "#" }, color: "#F59E0B",
  },
];

export default function TopFacultiesSection() {
  return (
    <section
      id="mentors"
      className="relative py-20 px-6 bg-white overflow-hidden"
      style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "40px 40px" }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
            initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} viewport={{ once: true }}
          >
            Meet Our <span className="text-gray-500">Mentors</span>
          </motion.h2>
          <motion.p
            className="text-slate-500 max-w-2xl mx-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }} viewport={{ once: true }}
          >
            AI engineers, full-stack developers and data scientists who review your code.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {facultyData.map((f, index) => (
            <motion.div
              key={f.id}
              className="group w-full max-w-[320px] bg-white border border-slate-200 rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2"
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, type: "spring", stiffness: 110 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="w-[110px] h-[110px] mx-auto mb-5 rounded-full p-1 border-[3px] relative" style={{ borderColor: f.color }}>
                <img src={f.image} alt={f.name} loading="lazy" className="w-full h-full rounded-full object-cover bg-slate-100" />
                <div className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition-opacity" style={{ background: f.color }} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{f.name}</h3>
              <span className="block text-xs font-bold uppercase tracking-wide mb-3" style={{ color: f.color }}>{f.role}</span>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">{f.bio}</p>
              <div className="flex justify-center gap-3">
                {[FaLinkedin, FaTwitter, FaGithub].map((Icon, i) => (
                  <span key={i} className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-base transition-all duration-300 hover:bg-slate-900 hover:text-white hover:-translate-y-1 cursor-pointer">
                    <Icon />
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
