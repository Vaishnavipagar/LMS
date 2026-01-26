import React from 'react';

export default function HeroSection() {
  return (
    <div 
      className="relative w-full min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden flex flex-col justify-center selection:bg-purple-100"
      style={{
        backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >

      {/* ================= HERO CONTENT ================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-[40px] md:pt-[80px] pb-20 px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* === LEFT COLUMN: TEXT CONTENT (Moved to Left) === */}
        <div className="w-full lg:w-[45%] text-center lg:text-left relative z-30 order-1 lg:order-1 mt-8 lg:mt-0">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Master In<br />
            <span className="text-gray-500">Linux & Cloud</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
            The Linux School is your premier destination for hands-on DevOps training. 
            From Kernel basics to Kubernetes architecture, we build industry-ready engineers.
          </p>

          <button className="
            bg-slate-900 hover:bg-slate-800
            text-white text-[18px] font-bold
            px-10 py-4
            rounded-2xl
            shadow-lg shadow-slate-200
            transition-all duration-300
            hover:-translate-y-1
            hover:shadow-2xl hover:shadow-slate-300
          ">
            Start Learning
          </button>
        </div>

        {/* === RIGHT COLUMN: GRAPHIC CONTAINER (Moved to Right) === */}
        <div className="relative w-full lg:w-[55%] h-[380px] md:h-[500px] order-2 lg:order-2 scale-90 md:scale-100">
          
          {/* BACKGROUND LINES (SVG TREE STRUCTURE) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none visible overflow-visible">
             <defs>
               <filter id="glow">
                 <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                 <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
                 </feMerge>
               </filter>
             </defs>
             
             {/* GRAY CONNECTION LINES */}
             <g stroke="#CBD5E1" strokeWidth="2" fill="none">
               {/* --- CENTRAL VERTICAL BRANCH --- */}
               <path d="M50% 50% L50% 35%" />
               <path d="M50% 35% L38% 22%" />
               <path d="M50% 35% L62% 22%" />

               {/* --- LEFT SIDE BRANCH --- */}
               <path d="M50% 50% L25% 50%" />
               <path d="M25% 50% L25% 75%" />
               <path d="M25% 50% L10% 50%" />

               {/* --- RIGHT SIDE BRANCH --- */}
               <path d="M50% 50% L75% 50%" />
               <path d="M75% 50% L75% 75%" />
               <path d="M75% 50% L90% 50%" />
             </g>

             {/* PURPLE DOTS AT JOINTS */}
             <g fill="#A855F7">
                {/* Top Branch Joints */}
                <circle cx="50%" cy="35%" r="4" />
                <circle cx="38%" cy="22%" r="4" />
                <circle cx="62%" cy="22%" r="4" />
                
                {/* Left Branch Joints */}
                <circle cx="25%" cy="50%" r="4" />
                <circle cx="25%" cy="75%" r="4" />
                
                {/* Right Branch Joints */}
                <circle cx="75%" cy="50%" r="4" />
                <circle cx="75%" cy="75%" r="4" />
             </g>
          </svg>

          {/* === CENTER HUB (PURPLE) === */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="
              w-24 h-24 md:w-28 md:h-28
              bg-gradient-to-b from-[#C084FC] to-[#9333EA]
              rounded-[32px]
              shadow-[0_20px_50px_rgba(168,85,247,0.4)]
              flex items-center justify-center
              text-white
              border-[4px] border-white
            ">
              {/* Terminal Icon */}
              <div className="w-12 h-12 rounded-full border-[3px] border-white flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* === UPPER SATELLITES (Middle Space) === */}
          
          {/* 1. Top Center-Left: Yellow Idea */}
          <div className="absolute top-[22%] left-[38%] -translate-x-1/2 -translate-y-1/2 z-10 animate-float">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#FDE047] rounded-[20px] shadow-2xl shadow-slate-200 flex items-center justify-center text-2xl border-4 border-white">
              💡
            </div>
          </div>

          {/* 2. Top Center-Right: Red Security */}
          <div className="absolute top-[22%] left-[62%] -translate-x-1/2 -translate-y-1/2 z-10 animate-float-reverse">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#EF4444] rounded-[20px] shadow-2xl shadow-slate-200 flex items-center justify-center text-white text-2xl border-4 border-white">
              🛡️
            </div>
          </div>


          {/* === SIDE & BOTTOM SATELLITES === */}

          {/* 3. Far Left: User Profile */}
          <div className="absolute top-[50%] left-[10%] -translate-x-1/2 -translate-y-1/2 z-10 animate-float-delayed">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-[24px] shadow-2xl shadow-slate-200 overflow-hidden border-4 border-white">
              <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* 4. Bottom Left: Blue Balloon/Docker */}
          <div className="absolute top-[75%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-10 animate-float-slower">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#38BDF8] rounded-[20px] shadow-2xl shadow-slate-200 flex items-center justify-center text-white text-2xl border-4 border-white">
              🐳
            </div>
          </div>

          {/* 5. Far Right: White Eyes/Observability */}
          <div className="absolute top-[50%] left-[90%] -translate-x-1/2 -translate-y-1/2 z-10 animate-float-slow">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-[24px] shadow-2xl shadow-slate-200 flex items-center justify-center text-3xl border-4 border-white">
              👀
            </div>
          </div>

          {/* 6. Bottom Right: User Profile (Woman) */}
          <div className="absolute top-[75%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-10 animate-float-delayed-2">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-[24px] shadow-2xl shadow-slate-200 overflow-hidden border-4 border-white">
              <img src="https://i.pravatar.cc/150?img=5" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>

      </div>

      {/* === ANIMATION STYLES === */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-6px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(6px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 6s ease-in-out infinite; }
        .animate-float-slower { animation: float 7s ease-in-out infinite; }
        .animate-float-delayed-2 { animation: float-delayed 4s ease-in-out infinite; }
        .animate-float-reverse { animation: float-delayed 8s ease-in-out infinite reverse; }
        .animate-float-slow { animation: float 5.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}