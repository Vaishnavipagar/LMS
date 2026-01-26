import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom"; // 👈 IMPORT ADDED
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  const footerRef = useRef(null);

  const isInView = useInView(footerRef, {
    amount: 0.15,
  });

  // 👇 Define links with their destinations
  const quickLinks = [
    { name: "Home", path: "/#home" },
    { name: "Courses", path: "/#courses" },
    { name: "Blogs", path: "/blogs" },
    { name: "Reviews", path: "/#reviews" },
    { name: "Contact", path: "/#footer" }, // Scrolls to this footer
  ];

  const resourceLinks = [
    { name: "Documentation", path: "/" },
    { name: "Community", path: "/" },
    { name: "Support", path: "/" },
    { name: "Privacy Policy", path: "/" },
    { name: "Terms of Service", path: "/" },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" },
    },
  };

  const columnAnim = (delay = 0) => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    },
  });

  return (
    <motion.footer
      id="footer" /* 👈 Added ID for "Contact" link scrolling */
      ref={footerRef}
      variants={footerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="
        relative overflow-hidden
        bg-[#05070c]
        rounded-t-[50px]
        text-slate-400
        pt-[90px]
        mt-20
      "
    >
      {/* Soft dark glow */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_60%)]
          animate-pulse
        "
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-4 gap-8 pb-[44px] max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
          {/* Column 1 */}
          <motion.div
            variants={columnAnim(0.1)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="transition-transform duration-300 hover:-translate-y-2"
          >
            <div
              className="
                text-[22px] font-extrabold tracking-wide text-white
                transition-all duration-300
                hover:scale-105 hover:text-blue-500
                hover:shadow-[0_0_12px_rgba(37,99,235,0.5)]
                inline-block
              "
            >
              The <span className="text-gray-500">Linux School</span>
            </div>

            <p className="mt-4 text-[13.8px] leading-[1.9] text-slate-400">
              Learn Linux, DevOps, and Full Stack development with industry-ready
              courses and hands-on projects.
            </p>

            <div className="flex gap-4 mt-6">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, i) => (
                  <span
                    key={i}
                    className="
                      w-9 h-9 rounded-full border border-slate-700
                      flex items-center justify-center
                      text-slate-400
                      transition-all duration-300
                      hover:text-white hover:border-blue-500 hover:bg-blue-600
                      hover:shadow-[0_0_12px_rgba(37,99,235,0.5)]
                      hover:-translate-y-1 hover:scale-110
                      cursor-pointer
                    "
                  >
                    <Icon size={14} />
                  </span>
                )
              )}
            </div>
          </motion.div>

          {/* Column 2 - QUICK LINKS */}
          <motion.div
            variants={columnAnim(0.2)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="transition-transform duration-300 hover:-translate-y-2"
          >
            <h5 className="text-[12px] font-extrabold tracking-[1.4px] uppercase text-white mb-5">
              Quick Links
            </h5>
            <ul className="space-y-3 text-[13.8px]">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path} /* 👈 Replaced static text with functional Link */
                    className="
                      relative pl-4 cursor-pointer
                      text-slate-400 block
                      transition-all duration-300
                      hover:text-blue-400 hover:translate-x-1
                      before:content-['→']
                      before:absolute before:left-0
                      before:opacity-0 hover:before:opacity-100
                      before:transition-all
                    "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 - RESOURCES */}
          <motion.div
            variants={columnAnim(0.3)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="transition-transform duration-300 hover:-translate-y-2"
          >
            <h5 className="text-[12px] font-extrabold tracking-[1.4px] uppercase text-white mb-5">
              Resources
            </h5>
            <ul className="space-y-3 text-[13.8px]">
              {resourceLinks.map((item) => (
                <li key={item.name}>
                   <Link
                    to={item.path}
                    className="
                      relative pl-4 cursor-pointer
                      text-slate-400 block
                      transition-all duration-300
                      hover:text-blue-400 hover:translate-x-1
                      before:content-['→']
                      before:absolute before:left-0
                      before:opacity-0 hover:before:opacity-100
                      before:transition-all
                    "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 */}
          <motion.div
            variants={columnAnim(0.4)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="transition-transform duration-300 hover:-translate-y-2"
          >
            <h5 className="text-[12px] font-extrabold tracking-[1.4px] uppercase text-white mb-5">
              Newsletter
            </h5>

            <p className="text-[13.8px] leading-[1.9] text-slate-400">
              Subscribe to get updates about new courses and offers.
            </p>

            <div className="mt-4 flex items-center border-b border-slate-700 pb-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="
                  flex-1 bg-transparent outline-none text-white
                  placeholder:text-slate-600 text-sm
                "
              />
              <button
                className="
                  text-blue-500 text-xl
                  transition-all duration-200
                  hover:text-blue-400 hover:translate-x-1
                "
              >
                →
              </button>
            </div>

            <div className="mt-3 text-[13.5px] font-semibold text-slate-500">
              We respect your privacy. Unsubscribe anytime.
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="
          border-t border-slate-800
          text-center text-[12.5px] text-slate-500
          py-5 mt-8
        "
      >
        © {new Date().getFullYear()} The Linux School. All rights reserved.
      </div>
    </motion.footer>
  );
}