export default function Watermark() {
  return (
    <section className="bg-white overflow-hidden py-4" aria-hidden>
      <div className="whitespace-nowrap overflow-hidden select-none">
        <p className="text-outline font-extrabold text-[13vw] lg:text-[110px] leading-none tracking-tight text-center">
          amazing online courses
        </p>
      </div>
      <p className="text-center text-[13px] font-semibold text-gray-500 -mt-3 sm:-mt-6">
        Online learning wherever and whenever.
      </p>
    </section>
  );
}
