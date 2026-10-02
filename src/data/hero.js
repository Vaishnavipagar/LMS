// EDIT HERO ONLY HERE.
// `personImg` = transparent cut-out in /public/images ( Falls back to the
// stand-in photo until hero-person.png is placed there ).

export const HERO = {
  titleLines: ["Learn Anything", "And Achieve", "Everything"],
  subtitle: "Master new skills with expert-led courses designed for real-world success. Start learning today at your own pace.",
  ctaText: "Browse Courses",
  ctaTo: "/courses",
  stats: [
    { value: "50k+", labelLines: ["Active", "Learners"] },
    { value: "500+", labelLines: ["Expert", "Courses"] },
    { value: "92%", labelLines: ["Completion", "Rate"] },
  ],
  personImg: "/images/hero.png",
  personFallback:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop",
  personAlt: "Smiling student with a laptop",
  avatarImg:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&q=80&auto=format&fit=crop",
  cards: [
    {
      tone: "lime",
      title: "1:1 Couching Session",
      desc: "Let's meet up with the quick 30 minutes meeting and resolve your problems.",
      action: "Book a meeting",
      actionTo: "/courses",
      avatar: true,
    },
    {
      tone: "white",
      title: "Ask for any help!  Get a Quick response",
      desc: null,
      action: null,
      actionTo: null,
      avatar: true,
    },
    {
      tone: "white",
      title: "Get your solution fast!",
      desc: null,
      action: null,
      actionTo: null,
      flame: true,
    },
    {
      tone: "faded",
      title: "Get started with a course",
      desc: null,
      action: null,
      actionTo: null,
      avatar: false,
    },
  ],
};
