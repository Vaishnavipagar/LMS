import { BRANDS } from "../../data/brands";

function Brand({ name, hidden }) {
  return (
    <span
      aria-hidden={hidden || undefined}
      className="text-[#101c19] font-extrabold text-base sm:text-lg tracking-tight whitespace-nowrap shrink-0 pr-12 sm:pr-16"
    >
      {name === "Trello" && <span className="mr-1.5 inline-block w-4 h-4 rounded-[4px] bg-[#0079bf] align-middle" />}
      {name === "monday.com" && <span className="mr-1.5 text-[#ff3d2e]">∿</span>}
      {name === "slack" && <span className="mr-1.5 text-[#611f69]">#</span>}
      <span className={name === "Google" ? "font-medium text-[#5f6368]" : ""}>{name}</span>
    </span>
  );
}

export default function LogoStrip() {
  return (
    <section className="bg-white border-b border-gray-100 overflow-hidden">
      <div className="marquee relative py-6 sm:py-7">
        <div className="animate-marquee flex w-max items-center">
          {BRANDS.map((b) => (
            <Brand key={`a-${b}`} name={b} />
          ))}
          {BRANDS.map((b) => (
            <Brand key={`b-${b}`} name={b} hidden />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}
