import React from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

const facultyData = [
  {
    id: 1,
    name: "Amit Singh",
    role: "Founder & Linux Expert",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Ex-RedHat with 10+ years of experience in Kernel development and System Architecture.",
    socials: { linkedin: "#", twitter: "#", github: "#" },
    color: "#141414", 
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "DevOps Architect",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Specializes in Kubernetes, Docker, and CI/CD pipelines. Cloud Native Ambassador.",
    socials: { linkedin: "#", twitter: "#", github: "#" },
    color: "#141414", 
  },
  {
    id: 3,
    name: "Rahul Verma",
    role: "Full Stack Mentor",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    bio: "MERN Stack wizard building scalable applications for high-traffic startups.",
    socials: { linkedin: "#", twitter: "#", github: "#" },
    color: "#141414", 
  },
  {
    id: 4,
    name: "Neha Gupta",
    role: "System Design Lead",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Expert in distributed systems and microservices. Ex-Amazon SDE II.",
    socials: { linkedin: "#", twitter: "#", github: "#" },
    color: "#141414", 
  },
];

export default function FacultySection() {
  return (
    <section 
      className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white overflow-hidden"
      // Dot pattern changed to light gray (#cbd5e1) to be visible on white
      style={{
        backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-3 sm:mb-4 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Meet Our <span className="text-gray-500">Mentors</span>
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Learn from industry veterans who have built systems at scale.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 justify-items-center">
          {facultyData.map((faculty, index) => (
            <motion.div
              key={faculty.id}
              // Card: White bg, light border, subtle shadow
              className="group w-full max-w-[280px] sm:max-w-[300px] md:max-w-[320px] bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200 hover:border-slate-300 hover:-translate-y-2"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1, 
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Image Circle with Glow */}
              <div 
                className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] mx-auto mb-4 sm:mb-6 rounded-full p-1 border-[3px] relative"
                style={{ borderColor: faculty.color }}
              >
                <img 
                  src={faculty.image} 
                  alt={faculty.name} 
                  className="w-full h-full rounded-full object-cover relative z-10 bg-white"
                />
                {/* Glow behind image */}
                <div 
                  className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-300 z-0"
                  style={{ background: faculty.color }}
                ></div>
              </div>

              {/* Info */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">{faculty.name}</h3>
              <span 
                className="block text-xs sm:text-sm font-bold uppercase tracking-wide mb-3 sm:mb-4"
                style={{ color: faculty.color }}
              >
                {faculty.role}
              </span>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                {faculty.bio}
              </p>

              {/* Social Icons */}
              <div className="flex justify-center gap-4">
                {[
                  { icon: FaLinkedin, link: faculty.socials.linkedin },
                  { icon: FaTwitter, link: faculty.socials.twitter },
                  { icon: FaGithub, link: faculty.socials.github }
                ].map((social, i) => (
                  <a 
                    key={i}
                    href={social.link} 
                    // Icons: Light gray bg, dark text -> Dark bg, white text on hover
                    className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-lg transition-all duration-300 hover:bg-slate-900 hover:text-white hover:-translate-y-1"
                  >
                    <social.icon />
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}