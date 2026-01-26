import React, { useState, useRef } from "react";
import { FaPlay } from "react-icons/fa";

const videos = [
  {
    id: 1,
    title: "Linux Full Course in One Shot",
    thumbnail: "https://img.youtube.com/vi/XwMulKXIa8E/maxresdefault.jpg",
    link: "https://youtu.be/XwMulKXIa8E",
    tag: "Linux",
  },
  {
    id: 2,
    title: "Git & GitHub Complete Tutorial",
    thumbnail: "https://img.youtube.com/vi/7tOLcNZfPso/maxresdefault.jpg",
    link: "https://youtu.be/7tOLcNZfPso",
    tag: "Git",
  },
  {
    id: 3,
    title: "HTML & CSS Full Course",
    thumbnail: "https://img.youtube.com/vi/mU6anWqZJcc/maxresdefault.jpg",
    link: "https://youtu.be/mU6anWqZJcc",
    tag: "Frontend",
  },
  {
    id: 4,
    title: "JavaScript Full Course",
    thumbnail: "https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg",
    link: "https://youtu.be/PkZNo7MFNFg",
    tag: "JavaScript",
  },
  {
    id: 5,
    title: "React Full Course",
    thumbnail: "https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg",
    link: "https://youtu.be/bMknfKXIFA8",
    tag: "React",
  },
];

export default function YouTubeSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const currentScroll = scrollRef.current.scrollLeft;
    const progress = Math.min(currentScroll / 400, 1);
    setScrollProgress(progress);
  };

  return (
    <section 
      className="py-20 bg-white relative overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      <div className="text-center mb-10 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Our Videos
        </h2>
      </div>

      <div className="relative w-full max-w-[1400px] mx-auto h-auto lg:h-[480px] flex flex-col lg:block gap-10">
        
        {/* TEXT LAYER */}
        <div 
          className="relative lg:absolute lg:top-1/2 lg:-translate-y-1/2 left-0 lg:left-[60px] w-full lg:w-[420px] z-[1] text-center lg:text-left px-6 lg:px-0 transition-all duration-100 ease-linear will-change-transform"
          style={{
            ...(window.innerWidth >= 1024 ? {
              opacity: 1 - scrollProgress,
              filter: `blur(${scrollProgress * 20}px)`,
              transform: `translateY(-50%) scale(${1 - scrollProgress * 0.1})`,
            } : {})
          }}
        >
          <div className="mb-6">
            <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              Learn. Build. <br />
              <span className="text-gray-500">
                Become Job-Ready.
              </span>
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              High-quality YouTube courses to master Linux, DevOps, React, and more 
              by building real projects.
            </p>
          </div>

          <div className="mt-8">
            <button className="
            bg-slate-900 hover:bg-slate-800
            text-white text-[18px] font-bold
            px-10 py-4
            rounded-2xl
            shadow-lg shadow-slate-200
            transition-all duration-300
            hover:-translate-y-1
            hover:shadow-2xl hover:shadow-slate-300
          ">  Explore Full Library
            </button>
          </div>
        </div>

        {/* SCROLL LAYER */}
        <div 
          // Added [&::-webkit-scrollbar]:hidden to hide scrollbar in Chrome/Safari
          className="relative lg:absolute inset-0 z-10 overflow-x-auto flex items-center [&::-webkit-scrollbar]:hidden"
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            // Added scrollbarWidth: 'none' for Firefox/IE
            scrollbarWidth: "none", 
            msOverflowStyle: "none",
            maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)"
          }}
        >
          <div className="flex items-center gap-6 h-full pl-6 lg:pl-0 pr-6 lg:pr-[60px]">
            <div className="hidden lg:block flex-shrink-0 w-[500px] h-full pointer-events-none"></div>

            {[...videos, ...videos].map((video, index) => (
              <a
                key={index}
                href={video.link}
                target="_blank"
                rel="noreferrer"
                className="group flex-shrink-0 w-[320px] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-300 hover:border-slate-300"
              >
                <div className="relative h-[180px] overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 pl-1 shadow-lg">
                       <FaPlay />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-900 px-3 py-1 rounded-full shadow-sm">
                    {video.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-slate-800 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium group-hover:translate-x-1 transition-transform duration-300">
                    Watch now on YouTube →
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}