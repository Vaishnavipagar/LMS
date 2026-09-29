import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/*
  R2/HLS-ready player.
  Priority: lesson.hls_url (signed R2 master.m3u8) > lesson.video_url > legacy lesson.video_path.
  hls.js is loaded lazily only when an .m3u8 URL is present, so no extra bundle cost.
*/
export default function LessonPlayer({ lesson }) {
  const videoRef = useRef(null);

  const src =
    lesson?.hls_url ||
    lesson?.video_url ||
    (lesson?.video_path
      ? lesson.video_path.startsWith("http")
        ? lesson.video_path
        : `http://localhost${lesson.video_path}`
      : null);
  const isHls = typeof src === "string" && src.includes(".m3u8");

  useEffect(() => {
    let hls = null;
    let cancelled = false;
    const el = videoRef.current;
    if (!el || !src || !isHls) return;

    if (el.canPlayType("application/vnd.apple.mpegurl")) {
      el.src = src;
      return;
    }

    (async () => {
      try {
        const { default: Hls } = await import("hls.js");
        if (cancelled || !videoRef.current) return;
        if (Hls.isSupported()) {
          hls = new Hls({ capLevelToPlayerSize: true });
          hls.loadSource(src);
          hls.attachMedia(videoRef.current);
        } else {
          videoRef.current.src = src;
        }
      } catch {
        if (videoRef.current) videoRef.current.src = src;
      }
    })();

    return () => { cancelled = true; if (hls) hls.destroy(); };
  }, [src, isHls]);

  if (!lesson) {
    return <div className="bg-slate-950 rounded-2xl p-10 text-center text-slate-400 font-medium">Select a lesson to start learning</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
      {src ? (
        isHls ? (
          <video ref={videoRef} controls playsInline preload="metadata" className="w-full max-h-[500px] bg-black" poster={lesson.poster_url || undefined} />
        ) : (
          <video key={src} controls playsInline preload="metadata" className="w-full max-h-[500px] bg-black" src={src} poster={lesson.poster_url || undefined} />
        )
      ) : (
        <div className="p-16 text-center text-slate-400">No video uploaded for this lesson yet</div>
      )}
      <div className="p-6 space-y-2">
        <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
        {lesson.duration && <p className="text-sm text-slate-400">Duration: {lesson.duration}</p>}
        {lesson.content && <p className="text-slate-300 text-sm leading-relaxed">{lesson.content}</p>}
        {lesson.notes_url && (
          <a href={lesson.notes_url} target="_blank" rel="noreferrer" className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-bold hover:-translate-y-0.5 transition-transform">
            Download notes (PDF)
          </a>
        )}
      </div>
    </motion.div>
  );
}
