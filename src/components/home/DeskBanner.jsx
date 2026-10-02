import SmartImg from "../../lib/SmartImg";

export default function DeskBanner() {
  return (
    <section className="bg-white">
      <div className="w-full">
        <SmartImg
          local="/images/desk.jpg"
          remote="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&q=80&auto=format&fit=crop"
          alt="Bright study desk with green notebook, yellow mug and handwritten notes"
          className="block w-full h-[380px] object-cover"
        />
      </div>
    </section>
  );
}
