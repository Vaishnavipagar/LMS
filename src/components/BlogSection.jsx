import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Ensure this import remains if you have the CSS

/* ---------------- Blog Data ---------------- */
const posts = [
  {
    id: 1,
    title: "React Performance Optimization",
    date: "Dec 2025",
    category: "Frontend",
    image: "https://cdn.pixabay.com/photo/2023/10/30/05/18/react-8352178_1280.png", // Using a placeholder that matches your previous files
    content: `
High-performance React apps rely on understanding **render behavior**.

### Core Optimizations
- useMemo / useCallback

\`\`\`js
const MemoComponent = React.memo(() => {
  return <div>Optimized</div>;
});
\`\`\`

Well-optimized apps feel instant.
`,
  },
  {
    id: 2,
    title: "Why Linux is the Backbone",
    date: "Jan 2026",
    category: "DevOps",
    image: "https://t3.ftcdn.net/jpg/06/07/04/30/360_F_607043015_0F4e0j0Q4e0j0Q4e0j0Q4e0j0Q4e0j0.jpg",
    content: `
Linux dominates modern infrastructure.

### Why Linux Wins
- Lightweight kernel
- Strong security model

\`\`\`bash
docker run -d nginx
\`\`\`

Linux is infrastructure.
`,
  },
  {
    id: 3,
    title: "Mastering Docker & Kubernetes",
    date: "Feb 2026",
    category: "Cloud Native",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg",
    content: `
Container orchestration is the future of deployment.

### Key Concepts
- Pods & Services
- Deployments

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
\`\`\`

Scale with confidence.
`,
  }
];

/* ---------------- Component ---------------- */

export default function BlogSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.1, once: true });

  // Highlight code when component mounts or updates
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white overflow-hidden"
      // Same consistent background pattern
      style={{
        backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 max-w-3xl mx-auto px-2">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 sm:mb-6 tracking-tight"
          >
            The Linux  <span className="text-gray-500 bg-clip-text ">School Blog</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm sm:text-base lg:text-lg text-slate-500 font-medium"
          >
            Linux • React • DevOps • System Engineering
          </motion.p>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1, 
                ease: "easeOut" 
              }}
              whileHover={{ y: -8 }}
              // Apple-style Card: Rounded-32px, White BG, Slate Border, Soft Shadows
              className="group flex flex-col bg-white rounded-[24px] sm:rounded-[32px] border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200 hover:border-slate-300"
            >
              
              {/* IMAGE AREA */}
              <div className="h-36 sm:h-40 md:h-48 w-full relative overflow-hidden bg-slate-50 border-b border-slate-100 p-4 sm:p-6 flex items-center justify-center">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="p-5 sm:p-6 md:p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-slate-400">
                  <span>{post.date}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight group-hover:text-slate-800 transition-colors">
                  {post.title}
                </h3>

                {/* Markdown Preview (Restricted Height) */}
                <div className="flex-grow prose prose-slate prose-sm max-w-none text-slate-600 line-clamp-3 overflow-hidden mb-6">
                  {/* We strip code blocks for the preview to keep it clean */}
                  <ReactMarkdown 
                     components={{
                        code: ({node, ...props}) => <span className="text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-500 font-mono" {...props} />,
                        pre: () => null // Hide big code blocks in preview
                     }}
                  >
                    {post.content.substring(0, 150) + "..."}
                  </ReactMarkdown>
                </div>

                {/* Read More Button */}
                <div className="mt-auto">
                  <button className="w-full py-3 rounded-xl font-bold text-sm bg-slate-900 text-white border border-slate-200 transition-all duration-300 group-hover:bg-slate-800 group-hover:text-white group-hover:border-slate-900 hover:shadow-lg">
                    Read Full Article
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}