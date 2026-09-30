// EDIT NAV + FOOTER LINKS ONLY HERE.
// App.jsx renders Navbar/Footer from this file. Buttons scroll to section ids.

export const NAV_LINKS = [
  { label: "Home", to: "/#home" },
  { label: "Courses", to: "/#courses" },
  { label: "Instructors", to: "/#instructors" },
  { label: "Testimonial", to: "/#testimonial" },
  { label: "Blog", to: "/#blog" },
];

export const FOOTER_BOTTOM_LINKS = [
  { label: "Home", to: "/#home" },
  { label: "Courses", to: "/#courses" },
  { label: "Instructors", to: "/#instructors" },
  { label: "Testimonial", to: "/#testimonial" },
  { label: "Blog", to: "/#blog" },
];

// Navbar-only link. Points to the existing contact destination used
// everywhere else in the project (Navbar + Footer "Contact us" → /login).
export const CONTACT_LINK = { label: "Contact Us", to: "/login" };
