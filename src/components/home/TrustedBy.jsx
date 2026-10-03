import { PLATFORM_FEATURES as FEATURES } from "../../data/organizations";

function Icon({ kind }) {
  const props = {
    width: 26,
    height: 26,
    viewBox: "0 0 26 26",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (kind) {
    case "spark":
      return (
        <svg {...props}>
          <path d="M13 2l2.4 9.6L25 14l-9.6 2.4L13 26l-2.4-9.6L1 14l9.6-2.4z" transform="scale(0.92) translate(1,0)" />
        </svg>
      );
    case "grid":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="15" y="3" width="8" height="8" rx="1.5" />
          <rect x="3" y="15" width="8" height="8" rx="1.5" />
          <rect x="15" y="15" width="8" height="8" rx="1.5" />
        </svg>
      );
    case "hourglass":
      return (
        <svg {...props}>
          <path d="M6 3h14M6 23h14M8 3c0 6 5 6.5 5 10s-5 4-5 10M18 3c0 6-5 6.5-5 10s5 4 5 10" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="13" cy="13" r="9" />
          <circle cx="13" cy="13" r="4.5" />
          <circle cx="13" cy="13" r="1" fill="currentColor" />
        </svg>
      );
  }
}

export default function TrustedBy() {
  return (
    <section className="bg-[#F5F2EA]">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-16 text-center">
        <span className="inline-block text-[10px] font-semibold tracking-[0.2em] text-[#111]/55 border border-black/15 rounded-full px-4 py-1.5">
          ALL IN ONE PLATFORM
        </span>
        <h2 className="text-[30px] sm:text-[36px] font-medium tracking-tight text-[#111] leading-[1.2] mt-5 max-w-[560px] mx-auto">
          The only source for courses in its most powerful form.
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-12 max-w-3xl mx-auto">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center">
              <span className="w-14 h-14 rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.08)] grid place-items-center text-[#111]">
                <Icon kind={f.icon} />
              </span>
              <p className="text-[13px] font-semibold text-[#111] mt-3 leading-tight">
                {f.title.split(" ")[0]}
                <br />
                {f.title.split(" ").slice(1).join(" ")}
              </p>
              <p className="text-[11px] text-[#111]/50 mt-1.5 leading-snug max-w-[150px] hidden sm:block">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
