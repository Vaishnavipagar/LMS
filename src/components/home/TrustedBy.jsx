import { ORGANIZATIONS as O } from "../../data/organizations";

const GLYPHS = ["✦", "◈", "⬢", "✧", "❖", "⬣", "✶"];

export default function TrustedBy() {
  return (
    <section className="bg-white">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-12 text-center">
        <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#191817]">
          Trusted by Leading
          <br />
          Organizations Worldwide
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-7">
          {O.orgs.map((name, i) => (
            <span key={name} className="text-[#191817]/60 font-bold text-[13px] whitespace-nowrap">
              <span className="mr-1.5 text-[#191817]/40">{GLYPHS[i % GLYPHS.length]}</span>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
