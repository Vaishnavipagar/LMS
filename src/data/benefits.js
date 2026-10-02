// EDIT BENEFITS CARDS ONLY HERE.
// Image fields: `local` = cropped reference asset in /public/images,
// `remote` = temporary stand-in until the crops are placed.

export const BENEFITS = {
  eyebrow: "Benefits",
  title: "Why Choose LearnLoop?",
  desc: "We're redefining online education with flexible, engaging, and outcome-driven learning experiences tailored to your goals.",
  cards: [
    {
      label: "Learn on your schedule",
      title: "Flexible Learning",
      text: "Access courses anytime, anywhere with our mobile-friendly platform. Whether you're commuting, taking a lunch break, or learning late at night, our content adapts to your lifestyle. Pause, rewind, and revisit lessons as many times as you need.",
      local: "/images/flexible.jpg",
      remote: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&auto=format&fit=crop",
      imgAlt: "Student learning on a laptop",
      imgLeft: true,
      bg: "#FFF0DC",
    },
    {
      label: "Expert instructors",
      title: "Guided by Industry Experts",
      text: "Learn from professionals who are actively working in their fields and bring real-world experience to every lesson. Our instructors include industry leaders, certified professionals, and passionate educators who understand both theory and practice.",
      local: "/images/experts.jpg",
      remote: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80&auto=format&fit=crop",
      imgAlt: "Industry expert mentor",
      imgLeft: false,
      bg: "#F1FAD9",
    },
    {
      label: "Interactive experience",
      title: "Engage with Hands-On Projects",
      text: "Move beyond passive watching with our interactive learning approach. Apply your knowledge through practical assignments, real-world projects, and skill-building exercises that reinforce your understanding. Participate in quizzes and assessments that track your progress and identify areas for improvement.",
      local: "/images/projects.jpg",
      remote: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&q=80&auto=format&fit=crop",
      imgAlt: "Student with study materials",
      imgLeft: true,
      bg: "#F6DDFA",
    },
  ],
};
