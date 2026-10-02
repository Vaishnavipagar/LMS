import { ORGANIZATIONS as O } from "../../data/organizations";

function Glyph({ index }) {
  const common = "mr-2.5 opacity-90";
  switch (index) {
    case 0: // 45 Degrees — arrow
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={common}>
          <path d="M4 16L16 4" />
          <path d="M7 4h9v9" />
        </svg>
      );
    case 1: // BuildingBlocks — cube
      return (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className={common}>
          <path d="M11 2l8 4.5v7L11 18l-8-4.5v-7z" />
          <path d="M11 11L3.5 6.7M11 11l7.5-4.3M11 11v7" />
        </svg>
      );
    case 2: // Capsule — two overlapping circles
      return (
        <svg width="24" height="20" viewBox="0 0 24 20" fill="currentColor" className={common}>
          <circle cx="8" cy="10" r="6" opacity="0.55" />
          <circle cx="16" cy="10" r="6" opacity="0.85" />
        </svg>
      );
    case 3: // Constellation — 4-point star
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className={common}>
          <path d="M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z" />
        </svg>
      );
    case 4: // Clandestine — bold plus
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className={common}>
          <path d="M7 1h6v6h6v6h-6v6H7v-6H1V7h6z" />
        </svg>
      );
    case 5: // Acme Corp — sparkle
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className={common}>
          <path d="M10 0l1.6 8.4L20 10l-8.4 1.6L10 20l-1.6-8.4L0 10l8.4-1.6z" />
        </svg>
      );
    default: // Chromatools — striped circle
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" className={common}>
          <defs>
            <clipPath id="ct-clip">
              <circle cx="10" cy="10" r="8" />
            </clipPath>
          </defs>
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
          <g clipPath="url(#ct-clip)" stroke="currentColor" strokeWidth="1.6">
            <path d="M-2 14L14 -2M-2 18L18 -2M2 22L22 2" />
          </g>
        </svg>
      );
  }
}

function Org({ name, index }) {
  return (
    <span className="text-[#999] font-semibold text-[19px] whitespace-nowrap inline-flex items-center tracking-tight">
      <Glyph index={index} />
      {name}
      {name === "45 Degrees" ? "°" : ""}
    </span>
  );
}

export default function TrustedBy() {
  const row1 = O.orgs.slice(0, 4);
  const row2 = O.orgs.slice(4);

  return (
    <section className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-20 text-center">
        <h2 className="text-[40px] font-medium tracking-tight text-[#111] leading-[1.15]">
          Trusted by Leading
          <br />
          Organizations Worldwide
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5 mt-10">
          {row1.map((name, i) => (
            <Org key={name} name={name} index={i} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5 mt-5">
          {row2.map((name, i) => (
            <Org key={name} name={name} index={i + 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
