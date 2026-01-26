import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";

const tools = [
  { name: "Docker", src: "https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" },
  { name: "Kubernetes", src: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" },
  { name: "Ansible", src: "https://upload.wikimedia.org/wikipedia/commons/0/05/Ansible_Logo.png" },
  { name: "Terraform", src: "https://logodix.com/logo/1686023.png" },
  { name: "Jenkins", src: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg" },
  { name: "Git", src: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png" },
  { name: "Prometheus", src: "https://upload.wikimedia.org/wikipedia/commons/3/38/Prometheus_software_logo.svg" },
  { name: "Grafana", src: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Grafana_logo.svg" },
  { name: "AWS", src: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
  { name: "Azure", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/120px-Microsoft_Azure.svg.png" },
  { name: "Python", src: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" },
  { name: "Bash", src: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Bash_Logo_Colored.svg" },
];

export default function BadgesSection() {
  return (
    <section 
      className="relative w-full py-24 px-6 bg-white overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* LEFT SIDE: ORBIT ANIMATION (INCREASED SIZE) */}
        <div className="flex-1 flex justify-center items-center w-full min-h-[500px] lg:min-w-[500px]">
          {/* Container Scaled Up 30%: 
             Mobile: 280px -> 360px
             Desktop: 360px -> 470px
          */}
          <div className="relative w-[360px] h-[360px] md:w-[470px] md:h-[470px] flex justify-center items-center">
            
            {/* Center Text: Scaled up to w-40 (160px) to match larger orbit */}
            <div className="absolute z-10 w-40 h-40 bg-white/80 border border-slate-200 backdrop-blur-md rounded-full flex justify-center items-center shadow-xl shadow-slate-200">
              <h2 className="text-3xl font-black tracking-widest bg-gradient-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent">
                LINUX
              </h2>
            </div>

            {/* Rotating Ring */}
            <div className="absolute w-full h-full rounded-full border border-dashed border-slate-300 animate-[spin_40s_linear_infinite]">
              {tools.map((tool, index) => (
                <div 
                  key={index} 
                  // Icon wrappers slightly larger for balance
                  className="absolute top-1/2 left-1/2 w-[50px] h-[50px] md:w-[64px] md:h-[64px] -mt-[25px] -ml-[25px] md:-mt-[32px] md:-ml-[32px]"
                >
                  <div 
                     className="w-full h-full flex items-center justify-center transition-transform duration-300 hover:scale-125"
                     style={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        // Radius (translation) increased to match 30% larger container (approx 180px mobile, 235px desktop)
                        transform: `rotate(${index * (360 / tools.length)}deg) translate(clamp(180px, 20vw, 235px))`, 
                        marginTop: '-50%',
                        marginLeft: '-50%',
                        width: '100%',
                        height: '100%'
                     }}
                  >
                    {/* Counter-rotation */}
                    <div 
                        className="w-full h-full flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]"
                        title={tool.name}
                    >
                        <img 
                            src={tool.src} 
                            alt={tool.name} 
                            className="w-full h-full object-contain drop-shadow-md" 
                        />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: SUMMARY TEXT */}
        <motion.div 
          className="flex-1 w-full max-w-[550px] bg-white border border-slate-200 rounded-3xl p-10 shadow-2xl shadow-slate-200/60"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-6">
            <span className="inline-block text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">
              About Us
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              The <span className="text-gray-500">Linux School</span>
            </h2>
          </div>

          <p className="text-lg text-slate-700 font-medium leading-relaxed mb-5">
            Bridging the gap between academic learning and industry demands through hands-on, project-centric training.
          </p>
          
          <p className="text-base text-slate-500 leading-relaxed mb-8">
            We don't just teach commands; we build careers. Our curriculum is designed by industry veterans to forge experts in Linux, Cloud, and DevOps.
          </p>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-3 text-slate-600 font-semibold">
              <FiCheckCircle className="text-xl text-green-500 flex-shrink-0" />
              <span>100% Practical Labs</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 font-semibold">
              <FiCheckCircle className="text-xl text-green-500 flex-shrink-0" />
              <span>Industry Mentor Support</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 font-semibold">
              <FiCheckCircle className="text-xl text-green-500 flex-shrink-0" />
              <span>Job-Ready Certification</span>
            </div>
          </div>

          <button className="px-8 py-3.5 rounded-xl border-none bg-slate-900 text-white font-bold text-base cursor-pointer shadow-lg transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto">
  Discover Our Methodology
</button>
        </motion.div>

      </div>
    </section>
  );
}