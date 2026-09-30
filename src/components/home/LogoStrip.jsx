import { BRANDS } from "../../data/brands";

export default function LogoStrip() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        {BRANDS.map((b) => (
          <span key={b} className="text-[#101c19] font-extrabold text-lg tracking-tight">
            {b === "Trello" && <span className="mr-1.5 inline-block w-4 h-4 rounded-[4px] bg-[#0079bf] align-middle" />}
            {b === "monday.com" && <span className="mr-1.5 text-[#ff3d2e]">∿</span>}
            {b === "slack" && <span className="mr-1.5 text-[#611f69]">#</span>}
            <span className={b === "Google" ? "font-medium text-[#5f6368]" : ""}>{b}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
